import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-neutral-800/80 backdrop-blur px-1 py-1 text-xs w-fit">
      <button
        type="button"
        onClick={() => switchLanguage('sv')}
        aria-label="Svenska"
        className={`px-2 py-1 rounded-full transition-all duration-200
          ${
            i18n.language === 'sv'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/75 hover:text-white'
          }`}
      >
        SV
      </button>

      <button
        type="button"
        onClick={() => switchLanguage('en')}
        aria-label="English"
        className={`px-2 py-1 rounded-full transition-all duration-200
          ${
            i18n.language === 'en'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/75 hover:text-white'
          }`}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;
