# Robert Rizzo — Developer Portfolio

Personal portfolio website showcasing my projects and skills as a Java / backend / system developer.

Built as a single-page React application with bilingual support (Swedish and English).

## Tech Stack

- **React 19** — UI framework
- **Vite 7** — Build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **i18next** — Internationalization (SV / EN)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Header.jsx        # Navigation with mobile menu
│   ├── Footer.jsx        # Site footer
│   ├── ProjectCard.jsx   # Case study project cards
│   ├── SkillsGrid.jsx    # Technical skills grid
│   ├── Section.jsx       # Animated section wrapper
│   └── ...
├── pages/           # Page sections
│   ├── Home.jsx          # Hero section
│   ├── About.jsx         # Bio, skills, education
│   ├── Projects.jsx      # Project case studies
│   └── Contact.jsx       # Contact information
├── locales/         # Translation files
│   ├── en/translation.json
│   └── sv/translation.json
└── hooks/           # Custom React hooks
```

## Deployment

Configured for static hosting with SPA redirect support. Currently uses `public/_redirects` for Netlify-compatible hosting.

## License

All rights reserved.
