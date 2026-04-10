import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLanguage('sv')}
        className={`text-xl transition-transform hover:scale-125 cursor-pointer ${
          i18n.language === 'sv' ? 'scale-110 drop-shadow-lg' : 'opacity-60'
        }`}
        aria-label="Svenska"
      >
        🇸🇪
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`text-xl transition-transform hover:scale-125 cursor-pointer ${
          i18n.language === 'en' ? 'scale-110 drop-shadow-lg' : 'opacity-60'
        }`}
        aria-label="English"
      >
        🇬🇧
      </button>
    </div>
  );
}

export default LanguageSwitcher;
