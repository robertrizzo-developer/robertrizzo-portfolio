const faqs = [
  { q: '1. Kan jag prova en klass innan jag blir medlem?', a: 'Ja! Vi erbjuder engångspass där du kan testa ett pass innan du bestämmer dig.' },
  { q: '2. Hur avslutar jag mitt medlemskap?', a: 'Om du har autogiro kan du säga upp ditt medlemskap när som helst enligt avtalsvillkoren. Bundna avtal löper ut automatiskt efter perioden du valt.' },
  { q: '3. Finns det rabatter för studenter eller arbetslösa?', a: 'Ja, vi erbjuder rabatter för studenter och arbetslösa på alla medlemskap och träningskort.' },
  { q: '4. Kan jag gå på vilka pass jag vill?', a: 'Ja, alla medlemmar kan delta i samtliga pass. Med klippkort eller engångspass betalar du per träningstillfälle.' },
  { q: '5. Behöver jag föranmäla mig till pass?', a: 'Nej, men vi rekommenderar att du bokar plats via vår hemsida för att garantera att du får plats.' },
  { q: '6. Vad behöver jag ta med mig till första träningen?', a: 'Träningskläder, vattenflaska och eventuellt egen utrustning om du har. Vi har låneutrustning för nybörjare.' },
  { q: '7. Kan jag pausa mitt medlemskap om jag blir sjuk eller skadad?', a: 'Ja, vi kan pausa ditt medlemskap vid sjukdom eller skada om du visar upp ett läkarintyg.' },
  { q: '8. Finns det barn- och ungdomspass?', a: 'Ja! Vi har anpassade pass för barn och ungdomar under 18 år.' },
  { q: '9. Kan jag köpa utrustning hos er?', a: 'Vi har ett mindre utbud av handskar, tandskydd och annan grundutrustning till försäljning på plats i gymmet.' },
  { q: '10. Kan jag hyra lokalen för privata träningar eller event?', a: 'Ja! Kontakta oss för mer information om priser och bokning.' },
]

export function FaqPage() {
  return (
    <main>
      <h1>Vanliga Frågor (FAQ)</h1>
      <section className="faq-list">
        {faqs.map((f, i) => (
          <details key={i}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </main>
  )
}
