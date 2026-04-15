/**
 * UI strings only — Java code samples stay in English in data/codeExamples.js
 */
export const translations = {
  sv: {
    common: {
      language: 'Språk',
    },
    lang: {
      switchToSv: 'Byt till svenska',
      switchToEn: 'Switch to English',
    },
    viewMode: {
      code: 'Kod',
      explanation: 'Förklaring',
      aria: 'Visa kod eller förklaring',
    },
    hero: {
      eyebrow: 'Fallstudie: Omfaktorisering',
      title: 'Refactoring Visualizer',
      tagline: 'Från rörig kod till tydlig arkitektur',
      intro:
        'Det här är ett interaktivt exempel på hur jag refaktorerar kod till en ren arkitektur. Välj ett lager för att se var arbetet fanns före — och vart det flyttar efter.',
      compareRegion: 'Jämförelse före och efter omfaktorisering',
      summaryBefore: 'Före:',
      summaryBeforeText:
        'All logik ligger samlad i en enda klass som hanterar allt på egen hand. Det gör det svårare att testa koden, ger sämre överblick och små ändringar riskerar att påverka hela flödet.',
      summaryAfter: 'Efter:',
      summaryAfterText:
        'Ansvar fördelas i tydliga lager där webbhantering, affärslogik och mappning var och en har sitt eget område. Det gör koden lättare att förstå, testa och bygga ut eftersom varje del har ett enda ansvar.',
    },
    highlight: {
      label: 'Välj vad du vill visa:',
      all: 'Alla',
      ariaGroup: 'Markera lager',
    },
    layers: {
      controller: 'Controller',
      service: 'Service',
      mapper: 'Mapper',
      controllerPlain: 'Hanterar webbförfrågningar och svar.',
      servicePlain: 'Regler och flöden: validering, sparning, uppslag.',
      mapperPlain: 'Omvandlar API-former till databasformer (och tillbaka).',
      otherPlain: 'Extra saker blandat i samma klass.',
      controllerTooltip: 'Grön — weblager: URL:er, statuskoder, headers.',
      serviceTooltip: 'Blå — affärslager: regler och dataarbete.',
      mapperTooltip: 'Rosa — mappningslager: omvandlar mellan format.',
      otherTooltip: 'Neutralt — extra (transaktioner, generiska fel).',
    },
    sections: {
      fileStructure: 'Projektstruktur',
      fileStructureLead:
        'Fiktiva filer visar hur ett större projekt ser ut. Markerade filer är från den här fallstudien.',
      codeComparison: 'Kodjämförelse',
      codeLead:
        'Fokus på den stora kontrollern. Äldre mappning visas nedanför i mindre ruta. Scrolla bara inuti rutan vid behov.',
      pseudoLead:
        'Samma filrutor som i kodläget — innehållet är pseudokod i samma ordning som koden. Färg = lager (som ovan). Välj lager för att tona ner övrigt.',
    },
    stack: {
      before: 'Före',
      after: 'Efter',
      hintBefore: 'Platt — allt trängs i controllern.',
      hintAfter: 'Lager — en roll per yta.',
      beforeMonolithic: 'Före (rörig kontroller)',
      afterLayered: 'Efter (lager)',
    },
    fileTree: {
      caption: 'Exempelprojekt (utbildning)',
      note: '«Fallstudie» = riktiga filer från det här exemplet. «Exempel» = påhittade grannar för kontext.',
      aria: 'Projektstruktur',
      titleShowAll: 'Visa alla markeringar',
      titleHighlight: 'Markera {{layer}}-lager',
      badgeReal: 'Fallstudie',
      badgeExample: 'Exempel',
    },
    codeViewer: {
      legacyMapping: 'Äldre mappning',
    },
    explanation: {
      pseudoHint:
        'Samma filrutor som i kodläget. Läs varje ruta uppifrån — raderna följer koden rad för rad i samma ordning.',
    },
    footer: {
      note: 'Robert Rizzo — Javautvecklare',
    },
  },
  en: {
    common: {
      language: 'Language',
    },
    lang: {
      switchToSv: 'Switch to Swedish',
      switchToEn: 'Switch to English',
    },
    viewMode: {
      code: 'Code',
      explanation: 'Explanation',
      aria: 'Show code or explanation',
    },
    hero: {
      eyebrow: 'Case study: Refactoring',
      title: 'Refactoring Visualizer',
      tagline: 'From messy code to clean architecture',
      intro:
        'This is an interactive example showing how I refactor code into a clean architecture. Pick a layer to see where that work lived before—and where it moves after.',
      compareRegion: 'Before and after refactoring comparison',
      summaryBefore: 'Before:',
      summaryBeforeText:
        'All logic is placed in a single class that handles everything on its own. This leads to harder-to-test code, lower clarity, and small changes potentially affecting the entire flow.',
      summaryAfter: 'After:',
      summaryAfterText:
        'Responsibilities are split into clear layers where web handling, business logic, and mapping each have their own dedicated area. This makes the code easier to understand, test, and extend because each part has a single responsibility.',
    },
    highlight: {
      label: 'Choose what to highlight:',
      all: 'All',
      ariaGroup: 'Layer highlight',
    },
    layers: {
      controller: 'Controller',
      service: 'Service',
      mapper: 'Mapper',
      controllerPlain: 'Handles web requests and responses.',
      servicePlain: 'Rules and workflows: validation, saving, lookups.',
      mapperPlain: 'Turns API shapes to database shapes (and back).',
      otherPlain: 'Extra concerns mixed into the same class.',
      controllerTooltip: 'Green — web layer: URLs, status codes, headers.',
      serviceTooltip: 'Blue — business layer: rules and data work.',
      mapperTooltip: 'Pink — mapping layer: converts between formats.',
      otherTooltip: 'Neutral — extra (transactions, generic errors).',
    },
    sections: {
      fileStructure: 'Project structure',
      fileStructureLead:
        'Fictional files show how a larger app might look. Badged files are from this case study.',
      codeComparison: 'Code comparison',
      codeLead:
        'Focus on the big controller. Legacy mapping sits below in a smaller box. Scroll only inside the box if needed.',
      pseudoLead:
        'Same file boxes as in code mode — content is pseudocode in the same order as the code. Color = layer (as above). Pick a layer to dim the rest.',
    },
    stack: {
      before: 'Before',
      after: 'After',
      hintBefore: 'Flat — everything crowds the controller.',
      hintAfter: 'Layered — one role per area.',
      beforeMonolithic: 'Before (messy controller)',
      afterLayered: 'After (layers)',
    },
    fileTree: {
      caption: 'Example project (teaching)',
      note: '«Case study» = real files in this demo. «Example» = made-up neighbours for context.',
      aria: 'Project structure',
      titleShowAll: 'Click to show all highlights',
      titleHighlight: 'Highlight {{layer}} layer',
      badgeReal: 'Case study',
      badgeExample: 'Example',
    },
    codeViewer: {
      legacyMapping: 'Legacy mapping',
    },
    explanation: {
      pseudoHint:
        'Same file boxes as in code mode. Read each box top to bottom — lines follow the code in the same order.',
    },
    footer: {
      note: 'Robert Rizzo — Java Developer',
    },
  },
}
