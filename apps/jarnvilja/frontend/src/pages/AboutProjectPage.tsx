export function AboutProjectPage() {
  return (
    <main>
      <h1>Om Projektet</h1>
      <p className="project-intro">
        Järnvilja är ett fullstack-portfolioprojekt byggt för att demonstrera moderna webbutvecklingstekniker
        i ett realistiskt scenario &ndash; en kampsportklubb med bokning, autentisering och administrationsfunktioner.
      </p>

      <section className="tech-section">
        <h2>Teknikstack</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Backend</h3>
            <ul>
              <li>Java 17</li>
              <li>Spring Boot 3.4</li>
              <li>Spring Security (rollbaserad åtkomstkontroll)</li>
              <li>Spring Data JPA / Hibernate</li>
              <li>Lombok</li>
              <li>Maven</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Frontend</h3>
            <ul>
              <li>React 19 + TypeScript</li>
              <li>Vite dev-server med HMR</li>
              <li>Mock/Live API-abstraction</li>
              <li>CSS3 (dark theme, responsiv design)</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Databas</h3>
            <ul>
              <li>MySQL 8 (produktion)</li>
              <li>H2 In-Memory (demo/test)</li>
              <li>Spring Profiles (dev/demo/prod)</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>DevOps &amp; Verktyg</h3>
            <ul>
              <li>Docker &amp; Docker Compose</li>
              <li>GitHub Actions CI</li>
              <li>Git versionshantering</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <h2>Arkitektur</h2>
        <div className="architecture-overview">
          <div className="arch-layer">
            <h3>Presentationslager</h3>
            <p>React SPA med mock/live API-abstraktion. Thymeleaf-templates som alternativ rendering.</p>
          </div>
          <div className="arch-layer">
            <h3>Controllerlager</h3>
            <p>Separata controllers per roll (Member, Admin, Trainer) med <code>@PreAuthorize</code> för säkerhet.</p>
          </div>
          <div className="arch-layer">
            <h3>Servicelager</h3>
            <p>Affärslogik med <code>@Transactional</code> för dataintegritet och <code>@Service</code>-beans.</p>
          </div>
          <div className="arch-layer">
            <h3>Datalager</h3>
            <p>Spring Data JPA-repositories med custom queries, indexering och unika constraints.</p>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <h2>Demonstrerade kompetenser</h2>
        <div className="skills-grid">
          {[
            'REST API-design', 'Rollbaserad åtkomstkontroll', 'CSRF-skydd',
            'Databasdesign & normalisering', 'Transaction management', 'Global exception handling',
            'DTO-mönster', 'Spring Profiles', 'Docker-containerisering',
            'CI/CD-pipeline', 'Responsiv design', 'Tillgänglighet (ARIA)',
            'Database seeding', 'E-postintegration', 'Input-validering',
          ].map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      </section>

      <section className="tech-section">
        <h2>Demokonton</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Roll</th><th>Användarnamn</th><th>Lösenord</th></tr>
            </thead>
            <tbody>
              <tr><td>Admin</td><td>demo_admin</td><td>demo123</td></tr>
              <tr><td>Medlem</td><td>demo</td><td>demo123</td></tr>
              <tr><td>Tränare</td><td>demo_trainer</td><td>demo123</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="tech-section" style={{ textAlign: 'center' }}>
        <a href="https://github.com/robertrizzo/jarnvilja" className="btn-primary" target="_blank" rel="noopener noreferrer">
          Visa på GitHub
        </a>
      </section>
    </main>
  )
}
