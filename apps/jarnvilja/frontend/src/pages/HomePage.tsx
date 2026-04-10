import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <div className="hero">
        <h1>Det är inte de starkaste som vinner &ndash; det är de som aldrig slutar kämpa.</h1>
        <p>Bli Medlem idag!</p>
        <div className="hero-buttons">
          <Link to="/bli-medlem" className="btn-ghost">Bli Medlem Idag</Link>
        </div>
      </div>

      <main>
        <section className="features-section">
          <h2>Våra Kampsporter</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Thaiboxning</h3>
              <p>Slag, sparkar, knän och armbågar &ndash; den kompletta kampkonsten.</p>
              <Link to="/schema" className="feature-link">Se schema</Link>
            </div>
            <div className="feature-card">
              <h3>BJJ</h3>
              <p>Brazilian Jiu-Jitsu &ndash; teknik och positionering på mattan.</p>
              <Link to="/schema" className="feature-link">Se schema</Link>
            </div>
            <div className="feature-card">
              <h3>Boxning &amp; Fys</h3>
              <p>Klassisk boxning och funktionell styrketräning.</p>
              <Link to="/schema" className="feature-link">Se schema</Link>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-item"><span className="stat-number">70+</span><span className="stat-label">Pass per vecka</span></div>
          <div className="stat-item"><span className="stat-number">8</span><span className="stat-label">Tränare</span></div>
          <div className="stat-item"><span className="stat-number">3</span><span className="stat-label">Kamparter</span></div>
        </section>

        <section className="how-to-section">
          <h2>Kom igång</h2>
          <div className="steps">
            <div className="step"><span className="step-number">1</span><p>Kolla in vårt <Link to="/schema">Träningsschema</Link></p></div>
            <div className="step"><span className="step-number">2</span><p><Link to="/register">Registrera dig</Link> som medlem</p></div>
            <div className="step"><span className="step-number">3</span><p>Boka ditt första pass</p></div>
          </div>
        </section>
      </main>
    </>
  )
}
