import { useTranslation } from 'react-i18next';
import Section from '../components/Section';

const BLOCKS = [
  { titleKey: 'about.educationTitle', itemsKey: 'about.education' },
  { titleKey: 'about.coursesTitle', itemsKey: 'about.courses' },
  { titleKey: 'about.experienceTitle', itemsKey: 'about.experience' },
] as const;

function Details() {
  const { t } = useTranslation();

  return (
    <Section id="details">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12 text-center">
        {t('sections.details')}
      </h2>
      <div className="space-y-12">
        {BLOCKS.map(({ titleKey, itemsKey }) => {
          const raw = t(itemsKey, { returnObjects: true });
          const items = Array.isArray(raw) ? (raw as string[]) : [];
          return (
            <div key={titleKey}>
              <h3 className="text-xl font-semibold text-blue-700 mb-4">{t(titleKey)}</h3>
              <ul className="list-disc list-inside space-y-1 text-neutral-700">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default Details;
