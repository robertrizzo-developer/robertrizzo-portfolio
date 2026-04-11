import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mt-24 border-t border-neutral-800/60">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
        
        {/* LEFT */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <span className="text-neutral-200 font-medium tracking-tight">
            Robert Rizzo
          </span>
          <span className="text-neutral-700">•</span>
          <span className="text-neutral-500">
            {t('footer.tagline')}
          </span>
        </div>

        {/* LINKS */}
        <div className="flex items-center gap-6">
          <a
            href={`https://${t('contact.github')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
            aria-label="GitHub"
          >
            GitHub
          </a>

          <a
            href={`https://${t('contact.linkedin')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
        </div>

        {/* RIGHT */}
        <div className="text-center md:text-right text-neutral-600">
          © {new Date().getFullYear()} Robert Rizzo
        </div>
      </div>
    </footer>
  );
}

export default Footer;