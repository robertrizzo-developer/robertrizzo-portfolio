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
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12 text-center">
        {t('projects.title')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(({ slug, project, index }) => (
          <ProjectCardLink key={slug} project={project} index={index} slug={slug} />
        ))}
      </div>
    </Section>
  );
}

export default ProjectsListPage;
