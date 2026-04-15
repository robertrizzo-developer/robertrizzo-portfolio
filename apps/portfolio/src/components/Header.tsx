'use client';

import { useEffect, useRef, useState } from 'react';
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

const SCROLL_GLASS_ON = 14;
const SCROLL_GLASS_OFF = 4;

function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollLockYRef = useRef(0);
  const scrollRafRef = useRef(0);

  // Lock scroll when menu open — fixed body + restore scrollY avoids iOS rubber-band jank vs overflow:hidden alone
  useEffect(() => {
    if (!menuOpen) return;

    scrollLockYRef.current = window.scrollY;
    const y = scrollLockYRef.current;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollLockYRef.current);
    };
  }, [menuOpen]);

  // Glass header: one update per frame max + hysteresis so we don’t thrash React on every scroll tick
  useEffect(() => {
    const onScroll = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        const y = window.scrollY;
        setScrolled((prev) => {
          if (prev) return y > SCROLL_GLASS_OFF;
          return y > SCROLL_GLASS_ON;
        });
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = 0;
      }
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      <header
        className={`
          fixed top-0 left-0 z-50 w-full overflow-hidden
          transition-[background-color,backdrop-filter,box-shadow] duration-300
          ${
            scrolled
              ? 'bg-neutral-950/92 backdrop-blur-md sm:backdrop-blur-lg lg:backdrop-blur-xl shadow-[0_1px_0_0_rgb(23_23_23)]'
              : 'bg-transparent'
          }
        `}
      >
        <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 lg:px-12">

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