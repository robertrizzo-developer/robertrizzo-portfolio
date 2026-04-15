import { useState } from 'react'
import { afterExample, beforeExample } from './data/codeExamples'
import { CodeViewer } from './components/CodeViewer'
import { FileTree } from './components/FileTree'
import { HighlightStrip } from './components/HighlightStrip'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ViewModeToggle } from './components/ViewModeToggle'
import { WhyRefactoring } from './components/WhyRefactoring'
import { useI18n } from './i18n/useI18n'
import './App.css'

export default function App() {
  const [focusedRole, setFocusedRole] = useState(null)
  const [viewMode, setViewMode] = useState('code')
  const { t } = useI18n()

  return (
    <div className="app">
      <div className="app__top-bar">
        <LanguageSwitcher />
      </div>

      <header className="hero">
        <p className="hero__eyebrow">{t('hero.eyebrow')}</p>
        <h1 className="hero__title">{t('hero.title')}</h1>
        <p className="hero__tagline">{t('hero.tagline')}</p>
        <p className="hero__intro">{t('hero.intro')}</p>
        <div
          className="hero__compare"
          role="region"
          aria-label={t('hero.compareRegion')}
        >
          <article className="hero__compare-card hero__compare-card--before">
            <h2 className="hero__compare-title">{t('hero.summaryBefore')}</h2>
            <p className="hero__compare-text">{t('hero.summaryBeforeText')}</p>
          </article>
          <div className="hero__compare-arrow" aria-hidden="true">
            →
          </div>
          <article className="hero__compare-card hero__compare-card--after">
            <h2 className="hero__compare-title">{t('hero.summaryAfter')}</h2>
            <p className="hero__compare-text">{t('hero.summaryAfterText')}</p>
          </article>
        </div>
      </header>

      <div className="panel panel--neutral">
        <HighlightStrip focusedRole={focusedRole} onChange={setFocusedRole} />
      </div>

      <section
        className="page-section page-section--compare"
        aria-labelledby="code-heading"
      >
        <h2 id="code-heading" className="page-section__title">
          {t('sections.codeComparison')}
        </h2>

        <div className="compare-toolbar">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <p className="page-section__lead page-section__lead--tight">
          {viewMode === 'code' ? t('sections.codeLead') : t('sections.pseudoLead')}
        </p>
        {viewMode !== 'code' && (
          <p className="page-section__pseudo-hint">{t('explanation.pseudoHint')}</p>
        )}

        <div className="two-col">
          <div className="stack-card">
            <h3 className="stack-card__label">{t('stack.beforeMonolithic')}</h3>
            <div className="stack-card__body stack-card__body--code">
              <CodeViewer
                example={beforeExample}
                focusedRole={focusedRole}
                hideMeta
                mode={viewMode === 'code' ? 'code' : 'explanation'}
              />
            </div>
          </div>
          <div className="stack-card">
            <h3 className="stack-card__label">{t('stack.afterLayered')}</h3>
            <div className="stack-card__body stack-card__body--code">
              <CodeViewer
                example={afterExample}
                focusedRole={focusedRole}
                hideMeta
                mode={viewMode === 'code' ? 'code' : 'explanation'}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="page-section page-section--files"
        aria-labelledby="structure-heading"
      >
        <h2 id="structure-heading" className="page-section__title">
          {t('sections.fileStructure')}
        </h2>
              <div className="panel panel--neutral">
        <HighlightStrip focusedRole={focusedRole} onChange={setFocusedRole} />
      </div>
        <p className="page-section__lead">{t('sections.fileStructureLead')}</p>
        <div className="two-col">
          <div className="stack-card">
            <h3 className="stack-card__label">{t('stack.before')}</h3>
            <p className="stack-card__hint">{t('stack.hintBefore')}</p>
            <div className="stack-card__body stack-card__body--tree">
              <FileTree
                variant="before"
                focusedRole={focusedRole}
                onSelectRole={setFocusedRole}
              />
            </div>
          </div>
          <div className="stack-card">
            <h3 className="stack-card__label">{t('stack.after')}</h3>
            <p className="stack-card__hint">{t('stack.hintAfter')}</p>
            <div className="stack-card__body stack-card__body--tree">
              <FileTree
                variant="after"
                focusedRole={focusedRole}
                onSelectRole={setFocusedRole}
              />
            </div>
          </div>
        </div>
      </section>



      <WhyRefactoring />

      <footer className="site-footer">
        <span className="site-footer__mark">{t('hero.title')}</span>
        <span className="site-footer__sep" aria-hidden>
          ·
        </span>
        <span>{t('footer.note')}</span>
      </footer>
    </div>
  )
}
