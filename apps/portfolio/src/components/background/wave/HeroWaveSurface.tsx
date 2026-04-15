import { memo, useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import type { WaveConfig } from '../backgroundConfig';

// -----------------------------------------------------------------------------
// Grid geometry — positions only; displacement happens in the vertex shader
// -----------------------------------------------------------------------------
function fillGridPositions(positions: Float32Array, segments: number, aspect: number): void {
  const n = Math.max(2, segments);
  const denom = Math.max(1, n - 1);
  let idx = 0;
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      const u = ix / denom;
      const v = iy / denom;
      const x = (u - 0.5) * 2.0 * aspect;
      const y = (v - 0.5) * 2.0;
      positions[idx++] = x;
      positions[idx++] = y;
      positions[idx++] = 0;
    }
  }
}

// -----------------------------------------------------------------------------
// Vertex — grid wave system (X, Y, diagonal, radial + damped scroll/mouse)
// -----------------------------------------------------------------------------
const VERT = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uAmp;
uniform float uFreqX;
uniform float uFreqY;
uniform float uSpeed;
uniform float uHeight;
uniform float uDiagonalFreq;
uniform float uScrollInfl;
uniform float uMouseInfl;
uniform float uScrollSpatialScale;
uniform float uSection;
uniform float uPointSize;
uniform float uPointDispBoost;

attribute vec3 position;

varying float vDisp;
varying vec2 vNorm;

void main() {
  float x = position.x;
  float y = position.y;
  float t = uTime * uSpeed;

  float baseWave = sin(x * uFreqX + t);
  float baseWave2 = sin(y * uFreqY + t * 1.2);
  float diagonal = sin((x + y) * uDiagonalFreq + t);
  float radial = sin(length(vec2(x, y)) * uFreqY - t);

  vec2 m = (uMouse - vec2(0.5)) * 2.0;
  float mouseWave = sin((x + m.x) * uFreqX + (y + m.y) * uFreqY) * uMouseInfl;
  float scrollWave =
    sin(y * uFreqY * uScrollSpatialScale + uScroll * 6.28318 * uScrollInfl) * uScrollInfl;

  float raw = baseWave + baseWave2 + diagonal + radial + mouseWave + scrollWave;
  float h = raw * uAmp * uHeight * uSection;

  vec4 mvPosition = modelViewMatrix * vec4(x, y, h, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vDisp = h;
  vNorm = vec2(x / max(uAspect, 0.0001), y);

  float sizeBoost = 1.0 + abs(h) * uPointDispBoost;
  gl_PointSize = uPointSize * sizeBoost;
}
`;

// -----------------------------------------------------------------------------
// Fragment — high-contrast liquid energy (peaks bright, valleys dark)
// -----------------------------------------------------------------------------
const FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uBgTop;
uniform vec3 uBgMid;
uniform vec3 uBgBottom;
uniform float uOpacity;
uniform float uPeakEmphasis;
uniform float uValleyDepth;
uniform float uSurfaceVibrance;

varying float vDisp;
varying vec2 vNorm;

void main() {
  vec2 pc = gl_PointCoord - vec2(0.5);
  if (dot(pc, pc) > 0.25) discard;

  float ny = vNorm.y * 0.5 + 0.5;
  vec3 bg = mix(uBgTop, uBgBottom, ny);
  bg = mix(bg, uBgMid, (1.0 - abs(ny - 0.5) * 1.15) * 0.55);

  float peak = smoothstep(-0.08, 0.32, vDisp);
  float valley = smoothstep(0.06, -0.38, vDisp);

  vec3 neon = mix(uColorA, uColorB, clamp(peak + vDisp * 3.5, 0.0, 1.0));
  vec3 tint = mix(bg, neon, uSurfaceVibrance);

  float light = mix(1.0 - uValleyDepth, uPeakEmphasis, peak);
  vec3 col = tint * light;

  col += neon * peak * (uPeakEmphasis - 1.0) * 0.55;
  col = mix(col, col * (1.0 - uValleyDepth), valley);

  gl_FragColor = vec4(col, uOpacity);
}
`;

export type HeroWaveSurfaceProps = {
  wave: WaveConfig;
  reduceMotion: boolean;
  scrollYProgress: MotionValue<number>;
  waveSectionIntensity: MotionValue<number>;
  className?: string;
};

const HeroWaveSurface = memo(function HeroWaveSurface({
  wave,
  reduceMotion,
  scrollYProgress,
  waveSectionIntensity,
  className = '',
}: HeroWaveSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cfgRef = useRef(wave);
  useEffect(() => {
    cfgRef.current = wave;
  }, [wave]);

  const scrollTarget = useRef(0);
  const sectionTarget = useRef(1);
  const scrollSmooth = useRef(0);
  const sectionSmooth = useRef(1);
  const mouseTarget = useRef({ x: 0.5, y: 0.48 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.48 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollTarget.current = v;
  });
  useMotionValueEvent(waveSectionIntensity, 'change', (v) => {
    sectionTarget.current = v;
  });

  useEffect(() => {
    scrollTarget.current = scrollYProgress.get();
    sectionTarget.current = waveSectionIntensity.get();
    scrollSmooth.current = scrollTarget.current;
    sectionSmooth.current = sectionTarget.current;
  }, [scrollYProgress, waveSectionIntensity]);

  useEffect(() => {
    if (reduceMotion || !wave.enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const wcfg = cfgRef.current;
    const segments = Math.max(16, Math.min(256, Math.floor(wcfg.gridSegments)));

    // -------------------------------------------------------------------------
    // Scene setup
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    camera.position.z = 10;

    const count = segments * segments;
    const positions = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.48) },
        uAmp: { value: wcfg.amplitude },
        uFreqX: { value: wcfg.frequencyX },
        uFreqY: { value: wcfg.frequencyY },
        uSpeed: { value: wcfg.speed },
        uHeight: { value: wcfg.height },
        uDiagonalFreq: { value: wcfg.diagonalFrequency },
        uScrollInfl: { value: wcfg.scrollInfluence },
        uMouseInfl: { value: wcfg.mouseInfluence },
        uScrollSpatialScale: { value: wcfg.scrollSpatialScale },
        uSection: { value: 1 },
        uPointSize: { value: wcfg.pointSize },
        uPointDispBoost: { value: wcfg.pointDisplacementBoost },
        uColorA: { value: new THREE.Color(wcfg.colorA) },
        uColorB: { value: new THREE.Color(wcfg.colorB) },
        uBgTop: { value: new THREE.Color(wcfg.backdropTop) },
        uBgMid: { value: new THREE.Color(wcfg.backdropMid) },
        uBgBottom: { value: new THREE.Color(wcfg.backdropBottom) },
        uOpacity: { value: wcfg.opacity },
        uPeakEmphasis: { value: wcfg.peakEmphasis },
        uValleyDepth: { value: wcfg.valleyDepth },
        uSurfaceVibrance: { value: wcfg.surfaceVibrance },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geo, material);
    scene.add(points);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'block h-full w-full';
    container.appendChild(renderer.domElement);

    let raf = 0;
    let disposed = false;

    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

    const resize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return;
      const aspect = w / h;
      material.uniforms.uAspect.value = aspect;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      const seg = Math.max(16, Math.min(256, Math.floor(cfgRef.current.gridSegments)));
      fillGridPositions(posAttr.array as Float32Array, seg, aspect);
      posAttr.needsUpdate = true;
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    fillGridPositions(positions, segments, 1);
    posAttr.needsUpdate = true;
    resize();

    const onPointer = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 1 || h < 1) return;
      mouseTarget.current = {
        x: e.clientX / w,
        y: e.clientY / h,
      };
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;

      const c = cfgRef.current;

      material.uniforms.uColorA.value.set(c.colorA);
      material.uniforms.uColorB.value.set(c.colorB);
      material.uniforms.uBgTop.value.set(c.backdropTop);
      material.uniforms.uBgMid.value.set(c.backdropMid);
      material.uniforms.uBgBottom.value.set(c.backdropBottom);

      material.uniforms.uAmp.value = c.amplitude;
      material.uniforms.uFreqX.value = c.frequencyX;
      material.uniforms.uFreqY.value = c.frequencyY;
      material.uniforms.uSpeed.value = c.speed;
      material.uniforms.uHeight.value = c.height;
      material.uniforms.uDiagonalFreq.value = c.diagonalFrequency;
      material.uniforms.uScrollInfl.value = c.scrollInfluence;
      material.uniforms.uMouseInfl.value = c.mouseInfluence;
      material.uniforms.uScrollSpatialScale.value = c.scrollSpatialScale;
      material.uniforms.uOpacity.value = c.opacity;
      material.uniforms.uPointSize.value = c.pointSize;
      material.uniforms.uPointDispBoost.value = c.pointDisplacementBoost;
      material.uniforms.uPeakEmphasis.value = c.peakEmphasis;
      material.uniforms.uValleyDepth.value = c.valleyDepth;
      material.uniforms.uSurfaceVibrance.value = c.surfaceVibrance;

      // -----------------------------------------------------------------------
      // Scroll influence
      // -----------------------------------------------------------------------
      const sl = c.scrollLerp;
      scrollSmooth.current += (scrollTarget.current - scrollSmooth.current) * sl;
      material.uniforms.uScroll.value = scrollSmooth.current;

      sectionSmooth.current += (sectionTarget.current - sectionSmooth.current) * sl;
      material.uniforms.uSection.value = Math.max(0.08, sectionSmooth.current);

      // -----------------------------------------------------------------------
      // Mouse influence
      // -----------------------------------------------------------------------
      const ml = c.mouseLerp;
      const mt = mouseTarget.current;
      const ms = mouseSmooth.current;
      ms.x += (mt.x - ms.x) * ml;
      ms.y += (mt.y - ms.y) * ml;
      material.uniforms.uMouse.value.set(ms.x, ms.y);

      // -----------------------------------------------------------------------
      // Wave motion — continuous time only
      // -----------------------------------------------------------------------
      material.uniforms.uTime.value = clock.getElapsedTime();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduceMotion, wave.enabled, wave.gridSegments]);

  if (reduceMotion || !wave.enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden
    />
  );
});

export default HeroWaveSurface;
