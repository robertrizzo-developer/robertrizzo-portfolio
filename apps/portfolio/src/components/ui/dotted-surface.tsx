'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';

const DEFAULT_SEPARATION = 64;
const DEFAULT_AMOUNTX = 52;
const DEFAULT_AMOUNTY = 36;
const DEFAULT_SPEED = 0.014;
const DEFAULT_HEIGHT = 48;
const DEFAULT_SAFE_ZONE = 0.36;
const DEFAULT_VERTICAL_RANGE = 0.42;
const DEFAULT_CAMERA_DISTANCE = 5600;
const DEFAULT_GRID_Z_OFFSET = -2800;
const DEFAULT_MOTION_SCALE = 0.5;
const DEFAULT_EDGE_FALLOFF = 0.92;
const DEFAULT_CAMERA_FOV = 40;

/** Slightly larger points so they remain legible at a distant camera. */
const DOT_PIXEL_SIZE = 72;

/**
 * Mobile-only boosts (max-width: 768px). Desktop/tablet use ×1 — defaults unchanged.
 * Tune these without editing DEFAULT_* or spiral/camera logic.
 */
const MOBILE_DOT_SIZE_MULT = 1.22;
const MOBILE_MATERIAL_OPACITY = 0.94;
const MOBILE_SPEED_MULT = 1.45;
const MOBILE_MOTION_SCALE_MULT = 1.22;
/** <1 scales down edge dimming vs base EDGE_FALLOFF (brighter dots on small screens). */
const MOBILE_EDGE_FALLOFF_FACTOR = 0.82;

const DEV = import.meta.env.DEV;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export type DottedSurfaceConfig = {
  separation?: number;
  amountX?: number;
  amountY?: number;
  speed?: number;
  height?: number;
  colorLight?: string;
  colorDark?: string;
  safeZone?: number;
  verticalRange?: number;
  cameraDistance?: number;
  gridZOffset?: number;
  motionScale?: number;
  edgeFalloff?: number;
  cameraFov?: number;
};

export type DottedSurfaceProps = {
  className?: string;
  config?: DottedSurfaceConfig;
  reduceMotion?: boolean;
};

function subscribePrefersDark(callback: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getPrefersDarkServer() {
  return false;
}

function subscribeMobileMax768(callback: () => void) {
  const mq = window.matchMedia('(max-width: 768px)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getMobileMax768() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function getMobileMax768Server() {
  return false;
}

function createRoundDotTexture(): THREE.CanvasTexture {
  const s = 64;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function DottedSurface({
  className = '',
  config = {},
  reduceMotion = false,
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const timeRef = useRef(0);

  const prefersDark = useSyncExternalStore(
    subscribePrefersDark,
    getPrefersDark,
    getPrefersDarkServer
  );

  const isMobileViewport = useSyncExternalStore(
    subscribeMobileMax768,
    getMobileMax768,
    getMobileMax768Server
  );

  const SEPARATION = config.separation ?? DEFAULT_SEPARATION;
  const AMOUNTX = config.amountX ?? DEFAULT_AMOUNTX;
  const AMOUNTY = config.amountY ?? DEFAULT_AMOUNTY;
  const SPEED = config.speed ?? DEFAULT_SPEED;
  const HEIGHT = config.height ?? DEFAULT_HEIGHT;
  const SAFE_ZONE = config.safeZone ?? DEFAULT_SAFE_ZONE;
  const VERTICAL_RANGE = config.verticalRange ?? DEFAULT_VERTICAL_RANGE;
  const CAMERA_DISTANCE = config.cameraDistance ?? DEFAULT_CAMERA_DISTANCE;
  const GRID_Z_OFFSET = config.gridZOffset ?? DEFAULT_GRID_Z_OFFSET;
  const MOTION_SCALE = config.motionScale ?? DEFAULT_MOTION_SCALE;
  const EDGE_FALLOFF = config.edgeFalloff ?? DEFAULT_EDGE_FALLOFF;
  const CAMERA_FOV = config.cameraFov ?? DEFAULT_CAMERA_FOV;

  const colorHex = prefersDark
    ? (config.colorDark ?? '#f8fafc')
    : (config.colorLight ?? '#0f172a');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      if (DEV) {
        console.warn('[DottedSurface] no container ref');
      }
      return;
    }

    timeRef.current = 0;
    const pointCount = AMOUNTX * AMOUNTY;

    // Mobile (≤768px): stronger dots & motion only; desktop/tablet = base values (×1).
    const dotPixelSize = isMobileViewport ? DOT_PIXEL_SIZE * MOBILE_DOT_SIZE_MULT : DOT_PIXEL_SIZE;
    const materialOpacity = isMobileViewport ? MOBILE_MATERIAL_OPACITY : 0.88;
    const animationSpeed = isMobileViewport ? SPEED * MOBILE_SPEED_MULT : SPEED;
    const motionScaleEffective = isMobileViewport
      ? MOTION_SCALE * MOBILE_MOTION_SCALE_MULT
      : MOTION_SCALE;
    const edgeFalloffEffective = isMobileViewport
      ? EDGE_FALLOFF * MOBILE_EDGE_FALLOFF_FACTOR
      : EDGE_FALLOFF;

    if (DEV) {
      console.log('[DottedSurface] init', {
        points: pointCount,
        reduceMotion,
        SAFE_ZONE,
        isMobileViewport,
      });
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 1, 20000);
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    // -------------------------------------------------------------------------
    // 3D parametric spiral (tunnel / “galaxy”): XY = circular sweep, Z = depth.
    // t = k / pointCount — one continuous curve; not a flat 2D projection.
    //
    // Quick tuning:
    // - Tighter coil (arms closer together) → ↑ SPIRAL_TURNS or ↑ PINCH_POWER
    // - Wider arms / bigger funnel opening → ↑ R_OUT (and optionally ↑ R_IN together)
    // - Looser pinch at the far end → bring R_IN closer to R_OUT
    // - More depth / longer tunnel → ↑ DEPTH_LENGTH (and/or more negative GRID_Z_OFFSET in config)
    // - Slower, calmer motion → ↓ `speed` / `motionScale` in DottedSurfaceConfig (not here)
    // -------------------------------------------------------------------------
    // SPIRAL_TURNS — full rotations over t∈[0,1); main control for “number of rotations”.
    const SPIRAL_TURNS = 25;
    // R_OUT — starting arm radius at t≈0 (↑ = wider opening / “wider spiral”).
    // R_IN — radius at the deep end t≈1 (↓ closer to R_OUT = less pinch / looser funnel).
    const R_OUT = 920 * SAFE_ZONE;
    const R_IN = 78 * SAFE_ZONE;
    // PINCH_POWER — eases radius from R_OUT→R_IN; >1 keeps outer arms wider longer, then tightens.
    const PINCH_POWER = 1.28;
    // DEPTH_LENGTH — |ΔZ| along the spiral (↑ = more depth / longer tunnel into the scene).
    // z = GRID_Z_OFFSET - t * DEPTH_LENGTH  → points recede in −Z as t grows (away from camera at +Z).
    const DEPTH_LENGTH = 8400;

    let i = 0;
    for (let k = 0; k < pointCount; k++) {
      const t = k / pointCount;

      // Polar angle: full rotations × 2π — SPIRAL_TURNS is the main “number of rotations” knob.
      const angle = t * SPIRAL_TURNS * Math.PI * 2;

      // Radius shrinks along t so the path corkscrews inward (cinematic funnel / tunnel).
      const radius = R_IN + (R_OUT - R_IN) * Math.pow(1 - t, PINCH_POWER);

      // True circular motion in XY; together with changing Z this reads as 3D, not a flat ring.
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Depth: linear recession — tweak DEPTH_LENGTH / GRID_Z_OFFSET for “more depth” / camera clearance.
      const z = GRID_Z_OFFSET - t * DEPTH_LENGTH;

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      // Edge dimming from radial distance in XY (keeps outer arm subtle vs center).
      const rxy = Math.sqrt(x * x + y * y) / (R_OUT + 1e-6);
      const dim = 1 - smoothstep(0.22, 1.08, rxy) * edgeFalloffEffective;

      colors[i] = dim;
      colors[i + 1] = dim;
      colors[i + 2] = dim;

      i += 3;
    }

    // Base geometry for animation — wave only adds a small offset so the spiral stays 3D.
    const basePositions = new Float32Array(positions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dotMap = createRoundDotTexture();
    const material = new THREE.PointsMaterial({
      map: dotMap,
      color: new THREE.Color().set(colorHex),
      size: dotPixelSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: materialOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
      alphaTest: 0.08,
      vertexColors: true,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pos = geometry.attributes.position.array as Float32Array;

    // Wave strength — global HEIGHT / VERTICAL_RANGE; “slower movement feel” → lower SPEED (config) & MOTION_SCALE.
    const waveAmp = HEIGHT * VERTICAL_RANGE * 0.32;

    const applyWave = (time: number) => {
      const wt = time * motionScaleEffective;
      for (let k = 0; k < pointCount; k++) {
        const idx = k * 3;
        const tn = k / pointCount;
        const spiralAngle = tn * SPIRAL_TURNS * Math.PI * 2;
        // Subtle breathing along the spiral — phase uses spiral angle so motion follows 3D path, not a grid.
        const wobble =
          Math.sin(spiralAngle * 2 + wt * 0.38) * waveAmp * 0.55 +
          Math.cos(spiralAngle * 1.1 + wt * 0.29) * waveAmp * 0.25;
        const clamped = Math.max(-waveAmp, Math.min(waveAmp, wobble));

        pos[idx] = basePositions[idx];
        pos[idx + 1] = basePositions[idx + 1] + clamped;
        pos[idx + 2] = basePositions[idx + 2];
      }
      geometry.attributes.position.needsUpdate = true;
    };

    const readSize = () => {
      let w = container.clientWidth;
      let h = container.clientHeight;
      if (w < 2 || h < 2) {
        w = window.innerWidth;
        h = window.innerHeight;
      }
      return { w, h };
    };

    let resizeAttempts = 0;
    const MAX_RESIZE_ATTEMPTS = 180;

    const resize = () => {
      const { w, h } = readSize();

      if (DEV && resizeAttempts === 0) {
        console.log('[DottedSurface] container / fallback size', {
          client: { w: container.clientWidth, h: container.clientHeight },
          used: { w, h },
        });
      }

      if (w < 2 || h < 2) {
        resizeAttempts += 1;
        if (resizeAttempts <= MAX_RESIZE_ATTEMPTS) {
          requestAnimationFrame(() => resize());
        } else if (DEV) {
          console.error('[DottedSurface] never got valid dimensions');
        }
        return;
      }

      resizeAttempts = 0;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (DEV) {
        console.log('[DottedSurface] canvas buffer', {
          width: renderer.domElement.width,
          height: renderer.domElement.height,
          inDom: container.contains(canvas),
        });
      }
    };

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize());
      ro.observe(container);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(() => resize());

    let rafId = 0;
    let tickLog = 0;

    if (reduceMotion) {
      applyWave(0);
      camera.position.set(0, 0, CAMERA_DISTANCE);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    } else {
      const loop = () => {
        camera.position.set(0, 0, CAMERA_DISTANCE);
        camera.lookAt(0, 0, 0);

        applyWave(timeRef.current);
        timeRef.current += animationSpeed;

        renderer.render(scene, camera);

        if (DEV && tickLog < 2) {
          tickLog += 1;
          console.log('[DottedSurface] rAF tick', tickLog);
        }

        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      materialRef.current = null;
      dotMap.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
    // colorHex applied in separate effect to avoid rebuilding the whole scene on theme change
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see material color effect below
  }, [
    SEPARATION,
    AMOUNTX,
    AMOUNTY,
    SPEED,
    HEIGHT,
    SAFE_ZONE,
    VERTICAL_RANGE,
    CAMERA_DISTANCE,
    GRID_Z_OFFSET,
    MOTION_SCALE,
    EDGE_FALLOFF,
    CAMERA_FOV,
    reduceMotion,
    isMobileViewport,
  ]);

  useEffect(() => {
    const m = materialRef.current;
    if (m) {
      m.color.set(colorHex);
    }
  }, [colorHex]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        minWidth: '100%',
        minHeight: '100%',
      }}
      aria-hidden
    />
  );
}
