import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition, Transition, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import HomeHeroVisual from '../components/HomeHeroVisual';

const MotionLink = motion.create(Link);

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

type HeroVariants = {
  container: Variants;
  item: Variants;
  outer: {
    initial?: TargetAndTransition;
    animate?: TargetAndTransition;
    transition?: Transition;
  };
  float: {
    animate?: TargetAndTransition;
    transition?: Transition;
  };
};

function useHeroMotionVariants(): HeroVariants {
  const reduce = useReducedMotion();

  if (reduce) {
    return {
      container: { hidden: {}, visible: {} },
      item: { hidden: {}, visible: {} },
      outer: { initial: {}, animate: {} },
      float: { animate: {} },
    };
  }

  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.08 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 18 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easeOut },
      },
    },
    outer: {
      initial: { opacity: 0, y: 22 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.65, ease: easeOut },
    },
    float: {
      animate: { y: [0, -4, 0] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
    },
  };
}

const ctaTap = { scale: 0.97 };

/**
 * Hero: stacked through `md` (phone + tablet); two-column from `lg` (1024px+).
 * Tablet uses the same column order as mobile with larger type/gaps (`md:` utilities).
 */
function HomePage() {
  const { t } = useTranslation();
  const v = useHeroMotionVariants();

  return (
    <div className="relative z-10 overflow-hidden">
      <section className="relative z-10 w-full px-0 pb-16 pt-6 sm:pt-8 md:pb-20 md:pt-12 lg:pb-20 lg:pt-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 md:gap-y-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12 xl:gap-x-16">
          <motion.div
            className="col-span-12 min-w-0 text-center lg:col-span-5 lg:text-left"
            initial={v.outer.initial}
            animate={v.outer.animate}
            transition={v.outer.transition}
          >
            <motion.div animate={v.float.animate} transition={v.float.transition}>
              <motion.div variants={v.container} initial="hidden" animate="visible">
                <motion.p
                  variants={v.item}
                  className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400"
                >
                  Backend Developer
                </motion.p>

                <motion.h1
                  variants={v.item}
                  className="text-4xl font-semibold tracking-tight text-neutral-50 md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                >
                  {t('home.name')}
                </motion.h1>

                <motion.p
                  variants={v.item}
                  className="mt-6 mx-auto max-w-xl text-lg leading-relaxed text-neutral-300 md:max-w-2xl md:text-xl lg:mx-0"
                >
                  {t('home.subtitle')}
                </motion.p>

                <motion.p variants={v.item} className="mt-4 text-sm text-neutral-500 md:text-base">
                  {t('home.availability')}
                </motion.p>

                <motion.div variants={v.item} className="mt-8 flex justify-center lg:justify-start">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent lg:from-white/20 lg:via-white/30" />
                </motion.div>

                <motion.div
                  variants={v.item}
                  className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4 lg:justify-start"
                >
                  <MotionLink
                    to="/projects"
                    className="rounded-full bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-950 shadow-sm transition hover:bg-white md:px-6 md:py-3 md:text-base"
                    whileTap={ctaTap}
                  >
                    Se projekt
                  </MotionLink>

                  <MotionLink
                    to="/about"
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-100 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10 md:px-6 md:py-3 md:text-base"
                    whileTap={ctaTap}
                  >
                    Om mig
                  </MotionLink>

                  <MotionLink
                    to="/contact"
                    className="rounded-full px-5 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-neutral-100 md:px-6 md:py-3 md:text-base"
                    whileTap={ctaTap}
                  >
                    Kontakt
                  </MotionLink>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="col-span-12 flex min-w-0 justify-center lg:col-span-7 lg:justify-end">
            <HomeHeroVisual
              alt={t('home.profileImageAlt')}
              className="w-full max-w-[20rem] sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-none"
            />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-0 pb-24 md:pb-28">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 md:max-w-3xl md:gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {(
            [
              { title: 'Backend', desc: 'Spring Boot, API design' },
              { title: 'Architecture', desc: 'Clean structure & scaling' },
              { title: 'Delivery', desc: 'Production-ready systems' },
            ] as const
          ).map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/15 hover:shadow-xl md:p-6"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-white/[0.06] to-transparent" />

              <p className="text-sm font-medium text-neutral-100">{item.title}</p>
              <p className="mt-1 text-sm text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
