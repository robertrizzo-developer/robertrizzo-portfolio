import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../components/Section';
import ProjectArchitectureCollapse from '../components/ProjectArchitectureCollapse';
import { getProjectBySlug } from '../data/projectRoutes';
import { getProjectCoverImage } from '../data/featuredProjects';

const TYPE_COLORS = {
  Skolprojekt: 'bg-amber-50 text-amber-900',
  'School Project': 'bg-amber-50 text-amber-900',
  Volontär: 'bg-emerald-50 text-emerald-900',
  Volunteer: 'bg-emerald-50 text-emerald-900',
  'Produktionssystem': 'bg-teal-50 text-teal-900',
  'Production System': 'bg-teal-50 text-teal-900',
  Hobby: 'bg-purple-50 text-purple-900',
  'Eget projekt': 'bg-blue-50 text-blue-900',
  'Personal Project': 'bg-blue-50 text-blue-900',
};

function ProjectDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true });
  const resolved = getProjectBySlug(slug, items);

  if (!resolved) {
    return <Navigate to="/projects" replace />;
  }

  const { project } = resolved;
  const heroSrc = getProjectCoverImage(slug);
  const badgeClass = TYPE_COLORS[project.type] || 'bg-neutral-100 text-neutral-700';
  const linkLabel = project.link ? project.linkLabel || t('projects.viewProject') : null;

  return (
    <Section className="!pt-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-blue-700 transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('projects.backToList')}
        </Link>

        {heroSrc ? (
          <Link
            to="/projects"
            className="group block mb-8 rounded-xl overflow-hidden border border-neutral-200 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label={t('projects.backToList')}
          >
            <img
              src={heroSrc}
              alt=""
              className="w-full aspect-[21/9] object-cover transition-transform duration-200 ease-out group-hover:scale-[1.01]"
            />
          </Link>
        ) : (
          <div className="rounded-xl bg-neutral-100 aspect-video mb-8 border border-neutral-200" aria-hidden />
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-4xl shrink-0">{project.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{project.title}</h1>
          </div>
          {project.type && (
            <span className={`text-xs font-semibold rounded-full px-3 py-1 shrink-0 ${badgeClass}`}>
              {project.type}
            </span>
          )}
        </div>

        {project.problem && (
          <div className="mb-6">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {t('projects.problemLabel')}
            </span>
            <p className="text-neutral-600 mt-1 leading-relaxed">{project.problem}</p>
          </div>
        )}

        <p className="text-neutral-700 leading-relaxed mb-8">
          {project.solution || project.description}
        </p>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-2 mb-8">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-neutral-600">
                <span className="text-blue-600 mt-0.5 shrink-0">▸</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {(project.technologies || []).map((tech) => (
            <span
              key={tech}
              className="bg-neutral-100 text-neutral-800 rounded-full px-3 py-1 text-sm font-medium border border-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-2">
          {project.link && project.link.startsWith('/') ? (
            <Link
              to={project.link}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
            >
              {linkLabel}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
            >
              {linkLabel}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          ) : null}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors"
            >
              GitHub
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        <ProjectArchitectureCollapse architectureDecisions={project.architectureDecisions} />
      </div>
    </Section>
  );
}

export default ProjectDetailPage;
