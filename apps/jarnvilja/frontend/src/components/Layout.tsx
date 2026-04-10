import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/services/auth/AuthProvider'
import { ModeBanner } from './ModeBanner'

export function Layout({ children }: { children: React.ReactNode }) {
  const { member, logout } = useAuth()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function navClass(path: string) {
    return pathname === path ? 'active-link' : undefined
  }

  return (
    <>
      <ModeBanner />
      <header role="banner">
        <nav
          role="navigation"
          aria-label="Huvudnavigation"
          className={menuOpen ? 'active' : undefined}
        >
          <Link to="/" className={navClass('/')} onClick={() => setMenuOpen(false)}>Startsida</Link>
          <Link to="/om-klubben" className={navClass('/om-klubben')} onClick={() => setMenuOpen(false)}>Om klubben</Link>
          <Link to="/tranare" className={navClass('/tranare')} onClick={() => setMenuOpen(false)}>Våra tränare</Link>
          <Link to="/schema" className={navClass('/schema')} onClick={() => setMenuOpen(false)}>Träningsschema</Link>
          <Link to="/bli-medlem" className={navClass('/bli-medlem')} onClick={() => setMenuOpen(false)}>Bli Medlem</Link>
          <Link to="/kontakt" className={navClass('/kontakt')} onClick={() => setMenuOpen(false)}>Kontakt</Link>

          {!member && (
            <Link to="/login" className={navClass('/login')} onClick={() => setMenuOpen(false)}>Logga in</Link>
          )}
          {member && (
            <>
              <Link to="/app" className={navClass('/app')} onClick={() => setMenuOpen(false)}>Min sida</Link>
              <button
                type="button"
                className="nav-link-as-button"
                onClick={() => { void logout(); setMenuOpen(false) }}
              >
                Logga ut
              </button>
            </>
          )}

          <span
            className="hamburger"
            role="button"
            aria-label="Meny"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            &#9776;
          </span>
        </nav>
      </header>

      {children}

      <footer role="contentinfo">
        <p>Kontaktinformation: info@jarnvilja.se | Telefon: 012-345 67 89</p>
        <p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |{' '}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a> |{' '}
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </p>
        <p>Adress: Kung Fu Gatan 12, 123 45 Kampsportsstaden</p>
        <p>
          <Link to="/faq">Vanliga frågor</Link> |{' '}
          <Link to="/om-projektet">Om projektet</Link>
        </p>
      </footer>
    </>
  )
}
