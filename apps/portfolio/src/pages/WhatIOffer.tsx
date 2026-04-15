import { useTranslation } from 'react-i18next';
import Section from '../components/Section';

const SKILL_CATEGORY_KEYS = [
  'skills.backendJava',
  'skills.databases',
  'skills.testing',
  'skills.security',
  'skills.devops',
  'skills.architecture',
] as const;

function WhatIOffer() {
  const { t } = useTranslation();

  return (
    <Section id="offer">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        {t('about.title')}
      </h2>
      <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-prose mx-auto text-center">
        {t('about.bio')}
      </p>

      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        {t('about.skillsTitle')}
      </h3>
      <div className="space-y-10 mb-10 max-w-prose mx-auto w-full">
        {SKILL_CATEGORY_KEYS.map((key) => {
          const raw = t(`${key}.items`, { returnObjects: true });
          const skills = Array.isArray(raw) ? (raw as string[]) : [];
          return (
            <div key={key}>
              <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wide mb-2">
                {t(`${key}.title`)}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-white/90">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default WhatIOffer;
