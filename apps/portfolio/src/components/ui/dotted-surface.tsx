'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';

const DEFAULT_SEPARATION = 64;
const DEFAULT_AMOUNTX = 52;
const DEFAULT_AMOUNTY = 36;
const DEFAULT_SPEED = 0.065;
const DEFAULT_HEIGHT = 52;

/** Reference-style visible dots (not specks); scales with sizeAttenuation. */
const DOT_PIXEL_SIZE = 5;

const DEV = import.meta.env.DEV;

export type DottedSurfaceConfig = {
  separation?: number;
  amountX?: number;
  amountY?: number;
  speed?: number;
  height?: number;
  colorLight?: string;
  colorDark?: string;
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
  g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
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

  const SEPARATION = config.separation ?? DEFAULT_SEPARATION;
  const AMOUNTX = config.amountX ?? DEFAULT_AMOUNTX;
  const AMOUNTY = config.amountY ?? DEFAULT_AMOUNTY;
  const SPEED = config.speed ?? DEFAULT_SPEED;
  const HEIGHT = config.height ?? DEFAULT_HEIGHT;

  const colorHex = prefersDark
    ? (config.colorDark ?? '#f8fafc')
    : (config.colorLight ?? '#0f172a');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      if (DEV) {
        // eslint-disable-next-line no-console -- diagnostics
        console.warn('[DottedSurface] no container ref');
      }
      return;
    }

    timeRef.current = 0;
    const pointCount = AMOUNTX * AMOUNTY;

    if (DEV) {
      // eslint-disable-next-line no-console -- diagnostics
      console.log('[DottedSurface] init', { points: pointCount, reduceMotion });
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
    camera.position.set(0, 0, 900);
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
    const geometry = new THREE.BufferGeometry();

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        i += 3;
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dotMap = createRoundDotTexture();
    const material = new THREE.PointsMaterial({
      map: dotMap,
      color: new THREE.Color().set(colorHex),
      size: DOT_PIXEL_SIZE,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.NormalBlending,
      alphaTest: 0.1,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pos = geometry.attributes.position.array as Float32Array;

    const applyWave = (time: number) => {
      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[idx + 1] =
            Math.sin((ix + time) * 0.3) * HEIGHT +
            Math.sin((iy + time) * 0.5) * HEIGHT;
          idx += 3;
        }
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
        // eslint-disable-next-line no-console -- diagnostics
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
          // eslint-disable-next-line no-console -- diagnostics
          console.error('[DottedSurface] never got valid dimensions');
        }
        return;
      }

      resizeAttempts = 0;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (DEV) {
        // eslint-disable-next-line no-console -- diagnostics
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
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    } else {
      const loop = () => {
        camera.position.set(0, 0, 900);
        camera.lookAt(0, 0, 0);

        applyWave(timeRef.current);
        timeRef.current += SPEED;

        renderer.render(scene, camera);

        if (DEV && tickLog < 2) {
          tickLog += 1;
          // eslint-disable-next-line no-console -- diagnostics
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme: material.color via effect below
  }, [SEPARATION, AMOUNTX, AMOUNTY, SPEED, HEIGHT, reduceMotion]);

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
