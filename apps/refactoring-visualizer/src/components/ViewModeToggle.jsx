import { useI18n } from '../i18n/useI18n'

export function ViewModeToggle({ mode, onChange }) {
  const { t } = useI18n()

  return (
    <div className="view-mode-toggle" role="group" aria-label={t('viewMode.aria')}>
      <button
        type="button"
        className={`view-mode-toggle__btn${mode === 'code' ? ' view-mode-toggle__btn--on' : ''}`}
        onClick={() => onChange('code')}
        aria-pressed={mode === 'code'}
      >
        {t('viewMode.code')}
      </button>
      <button
        type="button"
        className={`view-mode-toggle__btn${mode === 'explanation' ? ' view-mode-toggle__btn--on' : ''}`}
        onClick={() => onChange('explanation')}
        aria-pressed={mode === 'explanation'}
      >
        {t('viewMode.explanation')}
      </button>
    </div>
  )
}
