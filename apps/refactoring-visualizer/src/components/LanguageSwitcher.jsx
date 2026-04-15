import { useI18n } from '../i18n/useI18n'

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="lang-switcher" role="group" aria-label={t('common.language')}>
      <button
        type="button"
        className={`lang-switcher__btn${lang === 'sv' ? ' lang-switcher__btn--active' : ''}`}
        onClick={() => setLang('sv')}
        aria-pressed={lang === 'sv'}
        aria-label={t('lang.switchToSv')}
      >
        SV
      </button>
      <button
        type="button"
        className={`lang-switcher__btn${lang === 'en' ? ' lang-switcher__btn--active' : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        aria-label={t('lang.switchToEn')}
      >
        EN
      </button>
    </div>
  )
}
