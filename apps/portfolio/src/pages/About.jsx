import { useTranslation } from 'react-i18next';
import Section from '../components/Section';
import SkillsGrid from '../components/SkillsGrid';

function About() {
  const { t } = useTranslation();

  const lists = [
    { titleKey: 'about.educationTitle', itemsKey: 'about.education' },
    { titleKey: 'about.coursesTitle', itemsKey: 'about.courses' },
    { titleKey: 'about.experienceTitle', itemsKey: 'about.experience' },
  ];

  return (
    <Section id="about">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
        {t('about.title')}
      </h2>
      <p className="text-blue-100 text-lg leading-relaxed mb-10">
        {t('about.bio')}
      </p>

      <h3 className="text-2xl font-bold text-white mb-6">
        {t('about.skillsTitle')}
      </h3>
      <div className="mb-12">
        <SkillsGrid />
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-10">
        {lists.map(({ titleKey, itemsKey }) => (
          <div key={titleKey}>
            <h3 className="text-xl font-semibold text-blue-200 mb-3">
              {t(titleKey)}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-white/90">
              {t(itemsKey, { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </Section>
  );
}

export default About;
