import { HIGHLIGHT_ROLES } from '../data/codeExamples'
import { useI18n } from '../i18n/useI18n'

/**
 * Top legend — one choice highlights both columns.
 */
export function HighlightStrip({ focusedRole, onChange }) {
  const { t } = useI18n()

  return (
    <div className="highlight-strip">
      <p className="highlight-strip__label">{t('highlight.label')}</p>
      <div
        className="highlight-strip__chips"
        role="group"
        aria-label={t('highlight.ariaGroup')}
      >
        <button
          type="button"
          className={`highlight-strip__chip${focusedRole == null ? ' highlight-strip__chip--on' : ''}`}
          onClick={() => onChange(null)}
          aria-pressed={focusedRole == null}
        >
          {t('highlight.all')}
        </button>
        {HIGHLIGHT_ROLES.map((id) => {
          const on = focusedRole === id
          const plain = t(`layers.${id}Plain`)
          const label = t(`layers.${id}`)
          return (
            <button
              key={id}
              type="button"
              className={`highlight-strip__chip highlight-strip__chip--${id}${on ? ' highlight-strip__chip--on' : ''}`}
              onClick={() => onChange(on ? null : id)}
              aria-pressed={on}
              title={plain}
            >
              <span className="highlight-strip__dot" data-role={id} aria-hidden />
              {label}
            </button>
          )
        })}
      </div>

    </div>
  )
}
