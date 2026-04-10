import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-neutral-200 mt-20 bg-neutral-50/80">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
        <div className="text-center md:text-left">
          <span className="text-neutral-800 font-medium">Robert Rizzo</span>
          <span className="mx-2">|</span>
          <span>{t('footer.tagline')}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://${t('contact.github')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href={`https://${t('contact.linkedin')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
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
