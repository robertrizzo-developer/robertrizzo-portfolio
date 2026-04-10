import { useTranslation } from 'react-i18next';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';

function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true });

  return (
    <Section id="projects">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
        {t('projects.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((project, i) => (
          <ProjectCard
            key={i}
            emoji={project.emoji}
            title={project.title}
            description={project.description}
            problem={project.problem}
            solution={project.solution}
            highlights={project.highlights}
            architectureDecisions={project.architectureDecisions}
            technologies={project.technologies}
            type={project.type}
            link={project.link || null}
            linkLabel={project.link ? (project.linkLabel || t('projects.viewProject')) : null}
            githubLink={project.githubLink || null}
            featured={project.featured}
          />
        ))}
      </div>
    </Section>
  );
}

export default Projects;
