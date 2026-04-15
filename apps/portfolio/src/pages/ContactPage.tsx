import { useTranslation } from 'react-i18next';
import Section from '../components/Section';

const CONTACT = {
  email: {
    value: 'robertrizzo.dev@gmail.com',
    href: 'mailto:robertrizzo.dev@gmail.com',
  },
  phone: {
    value: '+46 76 948 68 54',
    href: 'tel:+46769486854',
  },
  linkedin: {
    value: 'LinkedIn',
    href: 'https://www.linkedin.com/in/robert-rizzo-8071b128b/',
  },
  github: {
    value: 'GitHub',
    href: 'https://github.com/robertrizzo-developer',
  },
} as const;

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4.5h3l1.5 4.5-2 1.5a11 11 0 006 6l1.5-2 4.5 1.5v3a1 1 0 01-1 1A17 17 0 016.5 5.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-2 3.75h4V20h-4V11.75zM11 11.75h3.85v1.12h.05c.54-1 1.85-2.12 3.8-2.12 4.06 0 4.8 2.67 4.8 6.15V20h-4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.97V20h-4v-8.25z" />
    </svg>
  );
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.01 10.01 0 0022 12.25C22 6.58 17.52 2 12 2z"
      />
    </svg>
  );
}

function IconArrowOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactPage() {
  const { t } = useTranslation();

  const rows = [
    {
      labelKey: 'contact.emailLabel' as const,
      ...CONTACT.email,
      Icon: IconMail,
      external: false,
    },
    {
      labelKey: 'contact.phoneLabel' as const,
      ...CONTACT.phone,
      Icon: IconPhone,
      external: false,
    },
    {
      labelKey: 'contact.linkedinLabel' as const,
      ...CONTACT.linkedin,
      Icon: IconLinkedIn,
      external: true,
    },
    {
      labelKey: 'contact.githubLabel' as const,
      ...CONTACT.github,
      Icon: IconGitHub,
      external: true,
    },
  ];

  return (
    <Section className="!pt-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t('contact.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          {t('contact.description')}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl md:mt-14">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-60" />
          <ul className="relative divide-y divide-white/[0.06]">
            {rows.map(({ labelKey, value, href, Icon, external }) => (
              <li key={labelKey}>
                <a
                  href={href}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex flex-col gap-3 rounded-xl px-4 py-4 transition duration-200 hover:bg-white/[0.05] active:scale-[0.99] sm:flex-row sm:items-center sm:gap-4 sm:py-5 sm:pl-5 sm:pr-4 md:px-6"
                >
                  <div className="flex shrink-0 items-center gap-3 sm:w-[8.5rem] md:w-36">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/90 shadow-inner transition group-hover:border-white/20 group-hover:bg-white/[0.1] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/70 sm:hidden">
                      {t(labelKey)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <span className="mb-1 hidden text-xs font-semibold uppercase tracking-wider text-white/70 sm:block">
                      {t(labelKey)}
                    </span>
                    <span className="block break-words text-sm font-medium text-white transition group-hover:text-white md:text-base">
                      {value}
                    </span>
                  </div>

                  <span className="flex shrink-0 items-center justify-end text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white/90">
                    {external ? (
                      <IconArrowOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <span className="text-xs font-medium text-white/70 group-hover:text-white">
                        →
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export default ContactPage;
