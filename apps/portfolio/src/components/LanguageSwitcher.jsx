import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-neutral-100 p-1 text-sm">
      
      <button
        onClick={() => switchLanguage('sv')}
        aria-label="Svenska"
        className={`px-2 py-1 rounded-full transition-all duration-200
          ${
            i18n.language === 'sv'
              ? 'bg-white text-black shadow-sm'
              : 'text-neutral-500 hover:text-black'
          }`}
      >
        SV
      </button>

      <button
        onClick={() => switchLanguage('en')}
        aria-label="English"
        className={`px-2 py-1 rounded-full transition-all duration-200
          ${
            i18n.language === 'en'
              ? 'bg-white text-black shadow-sm'
              : 'text-neutral-500 hover:text-black'
          }`}
      >
        EN
      </button>

    </div>
  );
}

export default LanguageSwitcher;