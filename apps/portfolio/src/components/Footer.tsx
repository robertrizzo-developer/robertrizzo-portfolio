const SOCIAL = {
  github: 'https://github.com/robertrizzo-developer',
  linkedin: 'https://www.linkedin.com/in/robert-rizzo-8071b128b/',
} as const;

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-neutral-800/40">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 py-3 sm:justify-between sm:gap-x-6 sm:px-6 sm:py-3.5 md:px-10 lg:px-12">
        <nav
          className="flex items-center gap-4 text-xs font-medium text-white/80 sm:gap-5"
          aria-label="Social links"
        >
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            LinkedIn
          </a>
        </nav>

        <p className="w-full text-center text-[11px] leading-tight text-white/65 sm:w-auto sm:text-xs">
          © {year} Robert Rizzo
        </p>
      </div>
    </footer>
  );
}

export default Footer;
