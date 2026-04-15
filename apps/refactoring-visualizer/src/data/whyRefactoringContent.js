/**
 * Copy for the “Why refactoring” card. Use **phrase** for neutral keyword emphasis.
 * @typedef {{ title: string, items: string[] }} WhyBlock
 * @typedef {{ title: string, lead: string, flowBefore: string, flowAfter: string, blocks: WhyBlock[] }} WhyContent
 */

/** @type {Record<'en'|'sv', WhyContent>} */
export const whyRefactoringByLang = {
  en: {
    title: 'Why refactoring matters',
    lead:
      'Refactoring is about turning complex code into simple, understandable building blocks.',
    flowBefore: 'One big block',
    flowAfter: 'Smaller clear blocks',
    blocks: [
      {
        title: 'The problem',
        items: [
          'All logic lives in one place',
          'Hard to understand',
          'Hard to test',
          'Small changes affect everything',
        ],
      },
      {
        title: 'The solution',
        items: [
          'Split into clear layers',
          'Each part has **one responsibility**',
          '**Easier to test** and maintain',
          '**Safer to change**',
        ],
      },
      {
        title: 'Refactoring tests',
        items: [
          'Identify dependencies',
          'Break them apart',
          'Write focused tests for each part',
          'Ensure behavior stays the same',
        ],
      },
      {
        title: 'How to think about it',
        items: [
          'Think in blocks',
          'Each block has one job',
          'Move logic to the right place',
          'Let parts work together',
        ],
      },
    ],
  },
  sv: {
    title: 'Varför omfaktorisering spelar roll',
    lead:
      'Omfaktorisering handlar om att göra komplex kod till enkla, begripliga byggstenar.',
    flowBefore: 'Ett stort block',
    flowAfter: 'Mindre tydliga block',
    blocks: [
      {
        title: 'Problemet',
        items: [
          'All logik ligger på samma ställe',
          'Svårt att överblicka',
          'Svårt att testa',
          'Små ändringar påverkar allt',
        ],
      },
      {
        title: 'Lösningen',
        items: [
          'Dela upp i tydliga lager',
          'Varje del har **ett ansvar**',
          '**Lättare att testa** och underhålla',
          '**Tryggare att ändra**',
        ],
      },
      {
        title: 'Tester följer samma mönster',
        items: [
          'Identifiera beroenden',
          'Bryt isär dem',
          'Skriv fokuserade tester per del',
          'Säkerställ att beteendet är oförändrat',
        ],
      },
      {
        title: 'Så kan du tänka',
        items: [
          'Tänk i block',
          'Varje block har en uppgift',
          'Flytta logik till rätt plats',
          'Låt delarna samverka',
        ],
      },
    ],
  },
}

/**
 * @param {string} lang
 * @returns {WhyContent}
 */
export function getWhyRefactoringContent(lang) {
  return whyRefactoringByLang[lang === 'en' ? 'en' : 'sv']
}
