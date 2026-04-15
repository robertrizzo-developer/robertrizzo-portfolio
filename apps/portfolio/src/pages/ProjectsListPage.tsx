import { useTranslation } from 'react-i18next';
import Section from '../components/Section';
import ProjectCardLink from '../components/ProjectCardLink';
import { getFeaturedProjectEntries } from '../data/featuredProjects';

function ProjectsListPage() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true });
  const featured = getFeaturedProjectEntries(items);

  return (
    <Section className="!pt-4">
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-10 text-center md:mb-12 lg:mb-12">
        {t('projects.title')}
      </h1>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:max-w-3xl md:gap-7 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {featured.map(({ slug, project, index }) => (
          <ProjectCardLink key={slug} project={project} index={index} slug={slug} />
        ))}
      </div>
    </Section>
  );
}

export default ProjectsListPage;
