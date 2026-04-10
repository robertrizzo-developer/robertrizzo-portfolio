import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-white/10 mt-10">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
        <div className="text-center md:text-left">
          <span className="text-white/70 font-medium">Robert Rizzo</span>
          <span className="mx-2">|</span>
          <span>{t('footer.tagline')}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://${t('contact.github')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href={`https://${t('contact.linkedin')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>
        <div className="text-center md:text-right">
          &copy; {new Date().getFullYear()} Robert Rizzo. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
