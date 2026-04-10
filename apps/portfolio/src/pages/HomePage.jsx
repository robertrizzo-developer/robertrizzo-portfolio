import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

const easeOut = [0.22, 1, 0.36, 1];

function useHeroMotionVariants() {
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

function HomePage() {
  const { t } = useTranslation();
  const v = useHeroMotionVariants();

  return (
    <div className="relative z-10 overflow-hidden">

      {/* HERO */}
      <section className="relative z-10 px-6 pt-28 pb-24 sm:px-8 lg:px-10">

        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={v.outer.initial}
          animate={v.outer.animate}
          transition={v.outer.transition}
        >
          <motion.div
            animate={v.float.animate}
            transition={v.float.transition}
          >
            <motion.div
              variants={v.container}
              initial="hidden"
              animate="visible"
            >

              {/* ROLE */}
              <motion.p
                variants={v.item}
                className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500"
              >
                Backend Developer
              </motion.p>

              {/* NAME */}
              <motion.h1
                variants={v.item}
                className="text-4xl md:text-6xl font-semibold tracking-tight text-neutral-950"
              >
                {t('home.name')}
              </motion.h1>

              {/* SUBTITLE */}
              <motion.p
                variants={v.item}
                className="mt-6 mx-auto max-w-xl text-lg md:text-xl leading-relaxed text-neutral-600"
              >
                {t('home.subtitle')}
              </motion.p>

              {/* AVAILABILITY */}
              <motion.p
                variants={v.item}
                className="mt-4 text-sm text-neutral-500"
              >
                {t('home.availability')}
              </motion.p>

              {/* DIVIDER */}
              <motion.div
                variants={v.item}
                className="mt-8 flex justify-center"
              >
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
              </motion.div>

              {/* CTA */}
              <motion.div
                variants={v.item}
                className="mt-10 flex flex-wrap justify-center gap-3"
              >
                <MotionLink
                  to="/projects"
                  className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black"
                  whileTap={ctaTap}
                >
                  Se projekt
                </MotionLink>

                <MotionLink
                  to="/about"
                  className="rounded-full border border-neutral-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-neutral-800 backdrop-blur-sm transition hover:border-neutral-500"
                  whileTap={ctaTap}
                >
                  Om mig
                </MotionLink>

                <MotionLink
                  to="/contact"
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
                  whileTap={ctaTap}
                >
                  Kontakt
                </MotionLink>
              </motion.div>

            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURE STRIP */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {[
            { title: 'Backend', desc: 'Spring Boot, API design' },
            { title: 'Architecture', desc: 'Clean structure & scaling' },
            { title: 'Delivery', desc: 'Production-ready systems' },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-neutral-200/60 bg-white/40 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-neutral-100/60 to-transparent" />

              <p className="text-sm font-medium text-neutral-900">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default HomePage;