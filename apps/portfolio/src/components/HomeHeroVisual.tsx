import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import profileSrc from '@/assets/profilImage/profile-hero.webp';

export type HomeHeroVisualProps = {
  /** Accessible label (e.g. from i18n). */
  alt: string;
  className?: string;
};

const IMG_MASK =
  'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.92) 88%, transparent 100%)';

/**
 * Editorial-style portrait for the home hero: soft bloom, gentle float, optional scroll parallax.
 * Cutout WebP + bottom mask + cyan/violet drop-shadow to sit on the dotted/wave background.
 */
export function HomeHeroVisual({ alt, className = '' }: HomeHeroVisualProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start 0.85', 'end 0.2'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -14]);

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto w-full lg:mx-0 ${className}`}
    >
      {/* Radial bloom — ties into wave / glow palette */}
      <div
        className="pointer-events-none absolute -inset-6 sm:-inset-10 md:-inset-12 lg:-inset-14 xl:-inset-16 rounded-[3rem] bg-[radial-gradient(ellipse_85%_70%_at_50%_65%,rgba(56,189,248,0.22),rgba(139,92,246,0.1)_42%,transparent_72%)] opacity-95 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-2 top-1/3 -z-10 scale-125 rounded-[100%] bg-gradient-to-t from-sky-500/20 via-violet-500/5 to-transparent blur-3xl"
        aria-hidden
      />

      <motion.div
        className="relative will-change-transform"
        style={reduce ? undefined : { y: parallaxY }}
      >
        <motion.div
          className="relative"
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-[20rem] md:max-w-[26rem] lg:min-w-0 lg:max-w-[42rem] xl:max-w-[min(44rem,100%)] 2xl:max-w-[min(52rem,100%)]">
            <div
              className="relative overflow-visible rounded-[2rem] p-[1px] shadow-[0_28px_90px_-24px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)_inset]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 40%, rgba(56,189,248,0.08))',
              }}
            >
              <div className="overflow-hidden rounded-[calc(2rem-1px)] bg-transparent">
                <img
                  src={profileSrc}
                  alt={alt}
                  className="relative z-[1] mx-auto block h-auto w-full max-h-[min(52vh,26rem)] object-contain object-bottom select-none sm:max-h-[min(56vh,28rem)] md:max-h-[min(58vh,32rem)] lg:max-h-[min(68vh,40rem)] xl:max-h-[min(72vh,48rem)] 2xl:max-h-[min(78vh,56rem)] [filter:drop-shadow(0_12px_48px_rgba(56,189,248,0.22))_drop-shadow(0_4px_24px_rgba(139,92,246,0.12))]"
                  style={{
                    WebkitMaskImage: IMG_MASK,
                    maskImage: IMG_MASK,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                  }}
                  draggable={false}
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomeHeroVisual;
