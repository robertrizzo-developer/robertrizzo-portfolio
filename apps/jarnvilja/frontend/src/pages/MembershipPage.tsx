import { Link } from 'react-router-dom'

export function MembershipPage() {
  return (
    <main>
      <h1>Bli Medlem</h1>

      <section>
        <h2>1. Välj medlemskap eller träningskort</h2>
        <p>Klicka på ett alternativ för att se detaljer och priser:</p>
        <ul>
          <li>Månadsmedlemskap (12, 6 eller 3 månader)</li>
          <li>Autogiro (12 månader, bundet)</li>
          <li>Autogiro (Obundet)</li>
          <li>10-klippkort</li>
          <li>Engångspass</li>
        </ul>
      </section>

      <section>
        <h2>2. Registrera dig och skapa ditt konto</h2>
        <p className="demo-note">
          Formuläret nedan är en demonstration. <Link to="/register">Registrera dig här</Link> för att skapa ett riktigt konto.
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="firstName">Förnamn:</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Efternamn:</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
          <div className="form-group">
            <label htmlFor="birthDate">Födelsedatum:</label>
            <input type="date" id="birthDate" name="birthDate" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-postadress:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefonnummer:</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="membership">Välj medlemskap/träningskort:</label>
            <select id="membership" name="membership" required>
              <option value="barnmedlemskap">Barnmedlemskap</option>
              <option value="engangspass">Engångspass</option>
              <option value="vuxenmedlemskap">Vuxenmedlemskap</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="payment">Betalning:</label>
            <select id="payment" name="payment" required>
              <option value="kort">Kortbetalning</option>
              <option value="swish">Swish</option>
            </select>
          </div>
          <button type="submit">Registrera (demo)</button>
        </form>
      </section>

      <section>
        <h2>3. Bekräftelse och Välkomstpaket</h2>
        <p>
          När din registrering och betalning är genomförd får du en bekräftelse via e-post, samt ett
          välkomstpaket med all information du behöver för att komma igång på gymmet.
        </p>
      </section>
    </main>
  )
}
