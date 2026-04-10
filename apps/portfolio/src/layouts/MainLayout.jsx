import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackgroundSystem from '../components/background/BackgroundSystem';
import { BACKGROUND_PRESETS } from '../components/background/backgroundConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout() {
  const { pathname } = useLocation();
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

  if (isJarnviljaDemo) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
        <Outlet />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-neutral-900 font-sans antialiased flex flex-col ${
        backgroundConfig ? 'bg-neutral-50' : 'bg-white'
      }`}
    >
      {backgroundConfig && (
        <BackgroundSystem key={pathname} config={backgroundConfig} />
      )}
      <Header />
      <main className={`flex-1 pt-24 ${backgroundConfig ? 'bg-transparent' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
