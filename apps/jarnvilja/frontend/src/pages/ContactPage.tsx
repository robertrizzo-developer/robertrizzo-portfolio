export function ContactPage() {
  return (
    <main>
      <h1>Kontakt &amp; Hitta hit</h1>
      <p>Vi är alltid här för att hjälpa dig! Om du har några frågor eller vill boka en klass, tveka inte att kontakta oss via någon av våra kanaler nedan.</p>

      <h2>Adress:</h2>
      <p>
        <strong>Järnvilja Kampsport</strong><br />
        Kung Fu Gatan 12<br />
        123 45 Kampsportsstaden
      </p>

      <h2>Kontaktinformation:</h2>
      <div className="contact-info">
        <h3>Receptionen:</h3>
        <p>
          Telefon: <strong>08-123 456 78</strong><br />
          Öppettider:<br />
          Måndag &ndash; Fredag: 08:00 &ndash; 20:00<br />
          Lördag &ndash; Söndag: 09:00 &ndash; 16:00
        </p>

        <h3>Tränare:</h3>
        <p>För specifika frågor om träning, boka pass eller andra träningsrelaterade frågor kan du kontakta våra tränare direkt:</p>
        <ul>
          <li><strong>Leif &quot;Benlåset&quot; (BJJ):</strong> leif@jarnviljakampsport.com</li>
          <li><strong>Tony &quot;McClinch&quot; (Thaiboxning):</strong> tony@jarnviljakampsport.com</li>
          <li><strong>Hanna &quot;Kroknäsa&quot; (Boxning):</strong> hanna@jarnviljakampsport.com</li>
          <li><strong>Kettlebell-Kajsa (Fysträning):</strong> kajsa@jarnviljakampsport.com</li>
        </ul>

        <h3>Generell klubbmail:</h3>
        <p>
          <strong>info@jarnviljakampsport.com</strong><br />
          För allmänna förfrågningar eller om du vill boka en gratis provklass!
        </p>
      </div>

      <h2>Hitta hit:</h2>
      <p>Vårt gym ligger lättillgängligt i Kampsportsstaden, och vi är bara ett stenkast från tågstationen!</p>
      <h3>Så här hittar du oss:</h3>
      <ul>
        <li><strong>Buss:</strong> Ta buss 56 mot &quot;Kampsportsparken&quot;, hållplats: <strong>Kung Fu Gatan</strong>.</li>
        <li><strong>Tåg:</strong> Närmaste station är <strong>Kampsportsstationen</strong>, och det tar bara 5 minuter att gå hitifrån.</li>
        <li><strong>Bil:</strong> Vi har gott om parkeringsplatser precis utanför gymmet.</li>
      </ul>
    </main>
  )
}
