import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  motion as Motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { BackgroundConfig } from './backgroundConfig';
import { mergeBackgroundConfig } from './backgroundConfig';
import HeroWaveSurface from './wave/HeroWaveSurface';

// -----------------------------------------------------------------------------
// SVG noise (fractal turbulence) — no network
// -----------------------------------------------------------------------------
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const BLOB_SPEED_DURATION: Record<string, [number, number, number]> = {
  slow: [24, 28, 20],
  medium: [14, 16, 12],
  fast: [8, 9, 7],
};

// -----------------------------------------------------------------------------
// Debug: live scroll progress (isolated subscription; avoids parent re-renders)
// -----------------------------------------------------------------------------
const ScrollProgressDebug = memo(function ScrollProgressDebug({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [v, setV] = useState(() => progress.get());
  useMotionValueEvent(progress, 'change', (latest) => {
    setV(latest);
  });
  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-[9998] rounded bg-neutral-950/90 px-2 py-1 font-mono text-[10px] text-white shadow-lg">
      scroll: {v.toFixed(3)}
    </div>
  );
});

// -----------------------------------------------------------------------------
// Dot pattern definitions — grid | diagonal | noise-grid
// -----------------------------------------------------------------------------
function DotPatternDef({
  patternId,
  cfg,
}: {
  patternId: string;
  cfg: BackgroundConfig;
}) {
  const s = cfg.dotSpacing;
  const r = cfg.dotSize;
  const fill = cfg.dotColor;
  const half = s / 2;

  if (cfg.dotPatternType === 'diagonal') {
    return (
      <pattern
        id={patternId}
        width={s}
        height={s}
        patternUnits="userSpaceOnUse"
        patternTransform={`rotate(35 ${half} ${half})`}
      >
        <circle cx={half} cy={half} r={r} fill={fill} />
      </pattern>
    );
  }

  if (cfg.dotPatternType === 'noise-grid') {
    return (
      <pattern id={patternId} width={s} height={s} patternUnits="userSpaceOnUse">
        <circle cx={half * 0.45} cy={half * 0.5} r={r * 0.85} fill={fill} opacity={0.9} />
        <circle cx={half * 1.35} cy={half * 0.65} r={r * 0.75} fill={fill} opacity={0.75} />
        <circle cx={half} cy={half * 1.2} r={r * 0.7} fill={fill} opacity={0.65} />
      </pattern>
    );
  }

  return (
    <pattern id={patternId} width={s} height={s} patternUnits="userSpaceOnUse">
      <circle cx={half} cy={half} r={r} fill={fill} />
    </pattern>
  );
}

export type BackgroundSystemProps = {
  className?: string;
  debug?: boolean;
  config?: Partial<BackgroundConfig>;
};

/**
 * Fixed viewport background engine.
 * Stack (back → front): wave backdrop → blur blobs → dotted surface (subtle) → wave points → glow → noise.
 */
export default function BackgroundSystem({
  className = '',
  debug = false,
  config: userConfig = {},
}: BackgroundSystemProps) {
  const reduceMotion = useReducedMotion();
  const patternId = `bg-dots-${useId().replace(/:/g, '')}`;
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef({ x: 0.5, y: 0.45 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.45 });
  const cfgRef = useRef<BackgroundConfig | null>(null);

  const cfg = useMemo(() => mergeBackgroundConfig(userConfig), [userConfig]);

  useEffect(() => {
    cfgRef.current = cfg;
  }, [cfg]);

  const { scrollYProgress } = useScroll();

  // === SCROLL DEPTH (easing / section feel — no per-frame React state) ===
  const depthMix = useTransform(scrollYProgress, (p) => {
    const c = cfg;
    const ds = c.depthStrength;
    if (!c.enableSectionDepth || reduceMotion) return 0.55 * ds;
    if (p < 0.32) return (0.85 + p * 0.4) * ds;
    if (p < 0.62) return (0.55 - (p - 0.32) * 0.35) * ds;
    return (0.42 + (p - 0.62) * 0.2) * ds;
  });

  const washStrength = useTransform(depthMix, (d) => {
    const c = cfg;
    return Math.min(1, (0.52 + Math.min(d, 1.2) * 0.28) * Math.min(c.depthStrength, 1.2));
  });

  const dotLayerOpacity = useTransform(depthMix, (d) => {
    const c = cfg;
    const depthBoost = c.enableSectionDepth ? 0.55 + Math.min(d, 1.5) * 0.32 : 0.92;
    const scrollAdaptive = c.enableSectionDepth ? 0.94 + Math.min(d, 1.2) * 0.05 : 1;
    let op = Math.min(1, c.dotOpacity * depthBoost * scrollAdaptive);
    if (c.wave.enabled && !reduceMotion) {
      op *= c.wave.dotOpacityScaleWhenWave;
    }
    return op;
  });

  const parallaxRawY = useTransform(scrollYProgress, (latest) => {
    const c = cfg;
    if (reduceMotion || !c.enableParallax) return 0;
    return latest * c.dotParallaxStrength * c.dotDirectionY;
  });

  const parallaxRawX = useTransform(scrollYProgress, (latest) => {
    const c = cfg;
    if (reduceMotion || !c.enableParallax) return 0;
    return latest * c.dotParallaxStrength * c.dotDirectionX;
  });

  const parallaxY = useSpring(parallaxRawY, {
    stiffness: 88,
    damping: 32,
    mass: 0.42,
  });
  const parallaxX = useSpring(parallaxRawX, {
    stiffness: 88,
    damping: 32,
    mass: 0.42,
  });

  const dotMotionStyle =
    reduceMotion || !cfg.enableParallax ? { x: 0, y: 0 } : { x: parallaxX, y: parallaxY };

  const blob0Opacity = useTransform(depthMix, (d) => {
    const c = cfg;
    return (0.16 + Math.min(d, 1.2) * 0.26) * c.blobIntensity;
  });
  const blob1Opacity = useTransform(depthMix, (d) => {
    const c = cfg;
    return (0.12 + Math.min(d, 1.2) * 0.22) * c.blobIntensity;
  });
  const blob2Opacity = useTransform(depthMix, (d) => {
    const c = cfg;
    return (0.07 + Math.min(d, 1.2) * 0.14) * c.blobIntensity;
  });

  const mobileGlowOpacity = useTransform(depthMix, (d) => {
    const c = cfg;
    if (reduceMotion || !c.enableGlow) return 0;
    const adaptive = c.enableSectionDepth ? 0.92 + Math.min(d, 1.2) * 0.1 : 1;
    return c.glowStrength * (0.55 + Math.min(d, 1.2) * 0.45) * adaptive;
  });

  const desktopGlowLayerOpacity = useTransform(depthMix, (d) => {
    const c = cfg;
    if (reduceMotion || !c.enableGlow) return 0;
    const adaptive = c.enableSectionDepth ? 0.88 + Math.min(d, 1.2) * 0.14 : 1;
    return Math.min(1, c.glowStrength * 1.2 * adaptive);
  });

  const noiseLayerOpacity = useTransform(scrollYProgress, (p) => {
    const c = cfg;
    if (!c.enableNoise) return 0;
    if (!c.enableSectionDepth || reduceMotion) return c.noiseOpacity;
    if (p < 0.28) return c.noiseOpacity * (0.82 + p * 0.45);
    if (p < 0.58) return c.noiseOpacity * (0.95 - (p - 0.28) * 0.12);
    return c.noiseOpacity * (0.91 + (p - 0.58) * 0.2);
  });

  // Wave section intensity — hero peak, mid softer, footer gentle lift
  const waveSectionIntensity = useTransform(scrollYProgress, (p) => {
    const c = cfg;
    if (!c.wave.enabled || reduceMotion) return 0.88;
    const d = Math.min(c.depthStrength, 1.35);
    if (!c.enableSectionDepth) return 0.78 * d;
    if (p < 0.27) return (0.98 + p * 0.15) * d;
    if (p < 0.56) return (1.02 - (p - 0.27) * 0.55) * d;
    return (0.87 + (p - 0.56) * 0.22) * d;
  });

  const isCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  useEffect(() => {
    if (!cfg.enableGlow || reduceMotion || isCoarsePointer) return;

    let raf = 0;
    const loop = () => {
      const c = cfgRef.current;
      if (!c?.enableGlow) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const el = glowRef.current;
      if (!el) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const t = mouseTarget.current;
      const s = mouseSmooth.current;
      const k = c.glowFollowSpeed;
      s.x += (t.x - s.x) * k;
      s.y += (t.y - s.y) * k;

      const x = s.x * 100;
      const y = s.y * 100;
      const [c1, c2] = c.glowColors;
      el.style.background = `radial-gradient(42rem 42rem at ${x}% ${y}%, ${c1}, ${c2} 40%, transparent 70%)`;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [cfg.enableGlow, reduceMotion, isCoarsePointer, cfg.glowFollowSpeed]);

  useEffect(() => {
    if (!cfg.enableGlow || reduceMotion || isCoarsePointer) return;

    const onMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [cfg.enableGlow, reduceMotion, isCoarsePointer]);

  const durations = BLOB_SPEED_DURATION[cfg.blobSpeed] ?? BLOB_SPEED_DURATION.slow;

  const washBackground = `linear-gradient(to bottom, ${cfg.backgroundTopColor}, ${cfg.backgroundMidColor}, ${cfg.backgroundBottomColor})`;

  const showWaveLayer = cfg.wave.enabled && !reduceMotion;
  const showWashFallback = !showWaveLayer;
  /** Under WebGL wave at z-2; above wash fallback at z-2 when wave is off */
  const dotZClass = showWaveLayer ? 'z-[2]' : 'z-[3]';

  const debugOutline = debug ? 'outline outline-2 outline-offset-[-2px]' : '';
  const debugBlob = debug ? 'outline-red-500/70' : '';
  const debugWash = debug ? 'outline-amber-500/70' : '';
  const debugWave = debug ? 'outline-cyan-500/70' : '';
  const debugDots = debug ? 'outline-emerald-500/70' : '';
  const debugGlow = debug ? 'outline-sky-500/70' : '';
  const debugNoise = debug ? 'outline-violet-500/70' : '';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {debug && <ScrollProgressDebug progress={scrollYProgress} />}

      {/* === LAYER 0 — DARK WAVE BACKDROP (only with live wave) === */}
      {showWaveLayer && (
        <div
          className={`absolute inset-0 z-[0] ${debugOutline}`}
          style={{
            background: `linear-gradient(to bottom, ${cfg.wave.backdropTop}, ${cfg.wave.backdropMid}, ${cfg.wave.backdropBottom})`,
          }}
        />
      )}

      {/* === LAYER 1 — BLUR BLOBS === */}
      {cfg.enableBlurBlobs && (
        <div className={`absolute inset-0 z-[1] ${debugOutline} ${debugBlob}`}>
          {debug && (
            <span className="absolute left-2 top-2 z-10 rounded bg-red-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              blobs
            </span>
          )}
          {cfg.blobColors[0] && (
            <Motion.div
              className={cfg.blobColors[0].className}
              style={{
                backgroundColor: cfg.blobColors[0].color,
                opacity: blob0Opacity,
              }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: ['-2%', '2%', '-2%'],
                      y: ['0%', '3%', '0%'],
                      scale: [1, 1.06, 1],
                    }
              }
              transition={
                reduceMotion
                  ? {}
                  : { duration: durations[0], repeat: Infinity, ease: 'easeInOut' }
              }
            />
          )}
          {cfg.blobColors[1] && (
            <Motion.div
              className={cfg.blobColors[1].className}
              style={{
                backgroundColor: cfg.blobColors[1].color,
                opacity: blob1Opacity,
              }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: ['2%', '-3%', '2%'],
                      y: ['0%', '-4%', '0%'],
                      scale: [1, 1.05, 1],
                    }
              }
              transition={
                reduceMotion
                  ? {}
                  : {
                      duration: durations[1],
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: -4,
                    }
              }
            />
          )}
          {cfg.blobColors[2] && (
            <Motion.div
              className={cfg.blobColors[2].className}
              style={{
                backgroundColor: cfg.blobColors[2].color,
                opacity: blob2Opacity,
              }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: ['0%', '4%', '0%'],
                      y: ['2%', '-2%', '2%'],
                    }
              }
              transition={
                reduceMotion
                  ? {}
                  : {
                      duration: durations[2],
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: -2,
                    }
              }
            />
          )}
        </div>
      )}

      {/* === LAYER 2 — DOTTED SURFACE (under WebGL wave; very subtle when wave on) === */}
      {cfg.enableDottedSurface && (
        <Motion.div
          className={`absolute inset-0 ${dotZClass} will-change-transform ${debugOutline} ${debugDots}`}
          style={{
            ...dotMotionStyle,
            mixBlendMode: cfg.dotBlendMode === 'multiply' ? 'multiply' : 'normal',
          }}
        >
          {debug && (
            <>
              <span className="absolute left-2 top-2 z-10 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                dots
              </span>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgb(16 185 129 / 0.35) 1px, transparent 1px),
                    linear-gradient(to bottom, rgb(16 185 129 / 0.35) 1px, transparent 1px)
                  `,
                  backgroundSize: `${cfg.dotSpacing}px ${cfg.dotSpacing}px`,
                }}
              />
            </>
          )}
          <svg
            className="h-[125%] w-full -translate-y-[10%]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <DotPatternDef patternId={patternId} cfg={cfg} />
            </defs>
            <Motion.g style={{ opacity: dotLayerOpacity }}>
              <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </Motion.g>
          </svg>
        </Motion.div>
      )}

      {/* === LAYER 3 — WAVE (WebGL point grid) or gradient wash fallback === */}
      {showWaveLayer && (
        <div className={`absolute inset-0 z-[3] ${debugOutline} ${debugWave}`}>
          {debug && (
            <span className="absolute left-2 top-2 z-10 rounded bg-cyan-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              wave
            </span>
          )}
          <HeroWaveSurface
            wave={cfg.wave}
            reduceMotion={!!reduceMotion}
            scrollYProgress={scrollYProgress}
            waveSectionIntensity={waveSectionIntensity}
          />
        </div>
      )}
      {showWashFallback && (
        <Motion.div
          className={`absolute inset-0 z-[2] ${debugOutline} ${debugWash}`}
          style={{
            background: washBackground,
            opacity: washStrength,
          }}
        >
          {debug && (
            <span className="absolute left-2 top-2 z-10 rounded bg-amber-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              wash
            </span>
          )}
        </Motion.div>
      )}

      {/* === LAYER 4 — GLOW === */}
      {cfg.enableGlow && !reduceMotion && !isCoarsePointer && (
        <Motion.div
          className={`absolute inset-0 z-[4] blur-[52px] md:blur-[64px] ${debugOutline} ${debugGlow}`}
          style={{ opacity: desktopGlowLayerOpacity }}
        >
          {debug && (
            <span className="absolute right-2 top-2 z-10 rounded bg-sky-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              glow
            </span>
          )}
          <div ref={glowRef} className="absolute inset-0 opacity-100" />
        </Motion.div>
      )}
      {cfg.enableGlow && !reduceMotion && isCoarsePointer && (
        <Motion.div
          className={`absolute inset-0 z-[4] blur-[44px] ${debugOutline} ${debugGlow}`}
          style={{
            opacity: mobileGlowOpacity,
            background: `radial-gradient(36rem 36rem at 50% 28%, ${cfg.glowColors[0]}, transparent 62%)`,
          }}
        >
          {debug && (
            <span className="absolute right-2 top-2 z-10 rounded bg-sky-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              glow
            </span>
          )}
        </Motion.div>
      )}

      {/* === LAYER 5 — NOISE === */}
      {cfg.enableNoise && (
        <Motion.div
          className={`absolute inset-0 z-[5] mix-blend-overlay ${debugOutline} ${debugNoise}`}
          style={{
            backgroundImage: NOISE_DATA_URI,
            opacity: noiseLayerOpacity,
          }}
        >
          {debug && (
            <span className="absolute right-2 bottom-2 z-10 rounded bg-violet-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              noise
            </span>
          )}
        </Motion.div>
      )}
    </div>
  );
}
