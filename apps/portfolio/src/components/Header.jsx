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
  `relative text-sm tracking-wide transition-colors duration-200
   hover:text-neutral-900 text-neutral-500
   ${isActive ? 'text-neutral-900' : ''}`;

function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [menuOpen]);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-4 flex items-center justify-between">

          {/* NAME */}
          <Link
            to="/"
            className="text-neutral-900 font-semibold tracking-tight"
          >
            {t('home.name')}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
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
          <div className="flex items-center gap-3">

            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              CV
            </a>

            <LanguageSwitcher />

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
          className="absolute inset-0 bg-black/30"
        />

        {/* DRAWER */}
        <aside
          className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-neutral-200 transform transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="font-medium text-neutral-900">
              {t('nav.menu')}
            </span>

            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-neutral-500 hover:text-neutral-900"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col px-6 py-6 gap-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className="text-lg text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {t(item.key)}
              </NavLink>
            ))}

            <a
              href="/cv.pdf"
              className="mt-6 text-sm text-neutral-500 hover:text-neutral-900"
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