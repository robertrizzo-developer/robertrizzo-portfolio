import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import BackgroundSystem from '../components/background/BackgroundSystem';
import { BACKGROUND_PRESETS } from '../components/background/backgroundConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CAROUSEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const carouselVariants: Variants = {
  initial: {
    rotateY: 35,
    x: 200,
    z: -400,
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    rotateY: 0,
    x: 0,
    z: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: CAROUSEL_EASE,
    },
  },
  exit: {
    rotateY: -35,
    x: -200,
    z: -400,
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.58,
      ease: CAROUSEL_EASE,
    },
  },
};

function MainLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const isJarnviljaDemo = pathname === '/projects/jarnvilja';

  const backgroundConfig = useMemo(() => {
    if (isJarnviljaDemo) return null;
    if (pathname === '/') return BACKGROUND_PRESETS.home;
    if (pathname === '/about') return BACKGROUND_PRESETS.about;
    if (pathname.startsWith('/projects') || pathname === '/contact') {
      return BACKGROUND_PRESETS.projects;
    }
    return BACKGROUND_PRESETS.projects;
  }, [pathname, isJarnviljaDemo]);

  const showSiteChrome = !isJarnviljaDemo;

  /** Match document canvas to route so overscroll never flashes the wrong color (dark vs white demo). */
  useEffect(() => {
    const dark = '#09090b';
    const light = '#ffffff';
    const bg = isJarnviljaDemo ? light : dark;
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isJarnviljaDemo ? light : dark);
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [isJarnviljaDemo]);

  return (
    <div
      className={`relative min-h-screen font-sans antialiased flex flex-col ${
        backgroundConfig
          ? 'bg-neutral-950 text-neutral-100'
          : 'bg-white text-neutral-900'
      }`}
    >
      {backgroundConfig && (
        <BackgroundSystem config={backgroundConfig} className="z-0" />
      )}

      {showSiteChrome && <Header />}

      <main
        className={`relative z-20 flex-1 min-h-0 overflow-x-hidden ${
          showSiteChrome ? 'pt-20 md:pt-24' : ''
        }`}
      >
        <div
          className={`carousel-stage relative isolate w-full ${
            showSiteChrome
              ? 'min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-6rem)] md:min-h-[calc(100dvh-8rem)] px-6 sm:px-8 md:px-10 lg:px-12'
              : 'min-h-dvh'
          }`}
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 45%',
          }}
        >
          <AnimatePresence mode="sync" initial={false}>
            <Motion.div
              key={pathname}
              className="carousel-panel absolute left-0 right-0 top-0 w-full min-h-full origin-center"
              variants={carouselVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                transformStyle: 'preserve-3d',
                transformPerspective: 1400,
                backfaceVisibility: 'hidden',
              }}
            >
              <Outlet />
            </Motion.div>
          </AnimatePresence>
        </div>
      </main>

      {showSiteChrome && <Footer />}
    </div>
  );
}

export default MainLayout;
