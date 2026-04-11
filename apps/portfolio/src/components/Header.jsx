import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const NAV = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.projects', to: '/projects' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.contact', to: '/contact' },
];

const navLinkClass = ({ isActive }) =>
  `relative text-sm tracking-wide transition-all duration-300
   text-neutral-400 hover:text-white
   after:content-[''] after:absolute after:left-0 after:-bottom-1
   after:h-px after:w-0 after:bg-white/70
   after:transition-all after:duration-300
   hover:after:w-full
   ${isActive ? 'text-white after:w-full' : ''}`;

function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  return (
    <>
      {/* HEADER (NO BACKGROUND) */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center justify-between">

          {/* NAME */}
          <Link
            to="/"
            className="text-white font-medium tracking-tight text-sm uppercase"
          >
            {t('home.name')}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
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

            <LanguageSwitcher />

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
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
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

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

            <a
              href="/cv.pdf"
              className="mt-8 text-sm text-neutral-500 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              CV
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;