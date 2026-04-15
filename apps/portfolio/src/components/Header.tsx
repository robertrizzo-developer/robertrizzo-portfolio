'use client';

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NAV = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.projects', to: '/projects' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.contact', to: '/contact' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm tracking-wide transition-all duration-300
   ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}
   after:content-[''] after:absolute after:left-0 after:-bottom-1
   after:h-px after:w-0 after:bg-white/70
   after:transition-all after:duration-300
   hover:after:w-full
   ${isActive ? 'after:w-full' : ''}`;

function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [menuOpen]);

  // Detect scroll → glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          transition-all duration-500
          ${
            scrolled
              ? 'bg-neutral-950/40 backdrop-blur-xl border-b border-neutral-800/50'
              : 'bg-transparent'
          }
        `}
      >
        {/* Gradient edge */}
        <div
          className={`
            pointer-events-none absolute inset-x-0 bottom-0 h-16
            transition-opacity duration-500
            ${scrolled ? 'opacity-100' : 'opacity-0'}
            bg-gradient-to-b from-transparent to-neutral-950/40
          `}
        />

        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8 md:px-10 lg:px-12">

          {/* EMPTY LEFT (space for balance) */}
          <div />

          {/* Laptop+ nav — tablet uses drawer like phone */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClass}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-sm text-neutral-500 hover:text-white transition-colors"
            >
              CV
            </a>

            {/* Language: header on tablet+ until desktop nav owns the bar */}
            <div className="hidden md:block lg:hidden">
              <LanguageSwitcher />
            </div>
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Menu: phone + tablet */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-neutral-400 transition-colors hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* DRAWER */}
        <aside
          className={`absolute right-0 top-0 h-full w-80 bg-neutral-950/90 backdrop-blur-xl border-l border-neutral-800 transform transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-800">
            <span className="text-white text-sm tracking-wide">
              {t('nav.menu')}
            </span>

            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col px-6 py-8 gap-5">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className="text-lg text-neutral-400 hover:text-white transition-colors tracking-wide"
              >
                {t(item.key)}
              </NavLink>
            ))}

            {/* CV */}
            <a
              href="/cv.pdf"
              className="mt-8 text-sm text-neutral-500 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              CV
            </a>

            {/* LANGUAGE SWITCHER (MOBILE) */}
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;