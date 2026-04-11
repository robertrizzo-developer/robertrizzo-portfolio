'use client';

import { memo, useMemo, useRef, useState } from 'react';
import {
  motion as Motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import type { BackgroundConfig } from './backgroundConfig';
import { mergeBackgroundConfig } from './backgroundConfig';

import { DottedSurface } from '@/components/ui/dotted-surface';
import HeroWaveSurface from './wave/HeroWaveSurface';

// -----------------------------------------------------------------------------
// NOISE
// -----------------------------------------------------------------------------
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// -----------------------------------------------------------------------------
// DEBUG
// -----------------------------------------------------------------------------
const ScrollProgressDebug = memo(function ScrollProgressDebug({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const [v, setV] = useState(progress.get());

  useMotionValueEvent(progress, 'change', (latest) => {
    setV(latest);
  });

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-[9999] rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-white">
      scroll: {v.toFixed(3)}
    </div>
  );
});

export type BackgroundSystemProps = {
  className?: string;
  debug?: boolean;
  config?: Partial<BackgroundConfig>;
};

export default function BackgroundSystem({
  className = '',
  debug = false,
  config: userConfig = {},
}: BackgroundSystemProps) {
  const reduceMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);

  const cfg = useMemo(() => mergeBackgroundConfig(userConfig), [userConfig]);

  const { scrollYProgress } = useScroll();

  // ---------------------------------------------------------------------------
  // WAVE INTENSITY (stable number output)
  // ---------------------------------------------------------------------------
  const waveSectionIntensity = useTransform(
    scrollYProgress,
    (p): number => {
      if (!cfg.wave.enabled || reduceMotion) return 0.85;

      if (p < 0.27) return 0.95;
      if (p < 0.56) return 0.75;
      return 0.9;
    }
  );

  // ---------------------------------------------------------------------------
  // BACKGROUND GRADIENT
  // ---------------------------------------------------------------------------
  const washBackground = `linear-gradient(to bottom, ${cfg.backgroundTopColor}, ${cfg.backgroundMidColor}, ${cfg.backgroundBottomColor})`;

  const showWave = cfg.wave.enabled && !reduceMotion;

  const debugCls = debug ? 'outline outline-1 outline-white/20' : '';

  if (import.meta.env.DEV && debug) {
    // eslint-disable-next-line no-console -- intentional debug trace
    console.log('[BackgroundSystem]', {
      enableDottedSurface: cfg.enableDottedSurface,
      enableWave: cfg.wave.enabled,
      reduceMotion: !!reduceMotion,
    });
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-0 h-full min-h-screen w-full min-w-full overflow-hidden ${className}`}
      aria-hidden
    >
      {debug && <ScrollProgressDebug progress={scrollYProgress} />}

      {/* ------------------------------------------------------------------ */}
      {/* BLOBS — z-1 */}
      {/* ------------------------------------------------------------------ */}
      {cfg.enableBlurBlobs && (
        <div className={`absolute inset-0 z-[1] ${debugCls}`}>
          <Motion.div
            className={cfg.blobColors[0].className}
            style={{
              backgroundColor: cfg.blobColors[0].color,
              opacity: 0.25,
            }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WAVE — z-2 (below dots so grid stays visible) */}
      {/* ------------------------------------------------------------------ */}
      {showWave ? (
        <div className={`absolute inset-0 z-[2] min-h-0 h-full w-full ${debugCls}`}>
          <HeroWaveSurface
            wave={{
              ...cfg.wave,
              amplitude: (cfg.wave.amplitude ?? 1) * 0.65, // 🔥 IMPORTANT FIX
            }}
            reduceMotion={!!reduceMotion}
            scrollYProgress={scrollYProgress}
            waveSectionIntensity={waveSectionIntensity}
          />
        </div>
      ) : (
        <Motion.div
          className={`absolute inset-0 z-[2] h-full w-full ${debugCls}`}
          style={{ background: washBackground }}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DOTTED SURFACE — z-3 above wave; page chrome uses z-10+ */}
      {/* ------------------------------------------------------------------ */}
      {cfg.enableDottedSurface && (
        <div
          className={`pointer-events-none absolute inset-0 z-[3] h-full w-full min-h-full ${debugCls}`}
        >
          <DottedSurface
            className="pointer-events-none absolute inset-0 h-full w-full min-h-full"
            config={cfg.dottedSurface}
            reduceMotion={!!reduceMotion}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* GLOW — z-4 (was z-3 above dots and could hide the grid) */}
      {/* ------------------------------------------------------------------ */}
      {cfg.enableGlow && (
        <div
          ref={glowRef}
          className={`absolute inset-0 z-[4] blur-[70px] ${debugCls}`}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* NOISE — z-5 */}
      {/* ------------------------------------------------------------------ */}
      {cfg.enableNoise && (
        <Motion.div
          className={`absolute inset-0 z-[5] mix-blend-overlay ${debugCls}`}
          style={{
            backgroundImage: NOISE_DATA_URI,
            opacity: cfg.noiseOpacity ?? 0.15,
          }}
        />
      )}
    </div>
  );
}