import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mt-24 border-t border-neutral-800/60">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 text-sm text-neutral-500">
        <div className="flex items-center gap-3 text-center lg:text-left">
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`https://${t('github.com/robertrizzo-developer')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
            aria-label="GitHub"
          >
            GH
          </a>

          <a
            href={`https://${t('linkedin.com/in/robert-rizzo-8071b128b/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            LI
          </a>
        </div>

        <div className="text-center lg:text-right text-neutral-600">
          © {new Date().getFullYear()} Robert Rizzo
        </div>
      </div>
    </footer>
  );
}

export default Footer;
