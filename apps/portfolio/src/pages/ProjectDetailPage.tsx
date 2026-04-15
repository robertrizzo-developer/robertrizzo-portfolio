import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../components/Section';
import ProjectArchitectureCollapse from '../components/ProjectArchitectureCollapse';
import { getProjectBySlug } from '../data/projectRoutes';
import { getProjectCoverImage } from '../data/featuredProjects';
const TYPE_COLORS: Record<string, string> = {
  Skolprojekt: 'bg-amber-500/15 text-white border border-amber-400/25',
  'School Project': 'bg-amber-500/15 text-white border border-amber-400/25',
  Volontär: 'bg-emerald-500/15 text-white border border-emerald-400/30',
  Volunteer: 'bg-emerald-500/15 text-white border border-emerald-400/30',
  Produktionssystem: 'bg-teal-500/15 text-white border border-teal-400/30',
  'Production System': 'bg-teal-500/15 text-white border border-teal-400/30',
  Hobby: 'bg-violet-500/15 text-white border border-violet-400/30',
  'Eget projekt': 'bg-sky-500/15 text-white border border-sky-400/30',
  'Personal Project': 'bg-sky-500/15 text-white border border-sky-400/30',
};

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true });
  const resolved = getProjectBySlug(slug, items);

  if (!resolved) {
    return <Navigate to="/projects" replace />;
  }

  const { project } = resolved;
  const heroSrc = getProjectCoverImage(slug);
  const badgeClass = project.type
    ? TYPE_COLORS[project.type] ?? 'bg-white/10 text-white border border-white/20'
    : 'bg-white/10 text-white border border-white/20';
  const linkLabel = project.link ? project.linkLabel || t('projects.viewProject') : null;

  return (
    <Section className="!pt-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-8"
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
            className="group block mb-8 rounded-xl overflow-hidden border border-white/15 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            aria-label={t('projects.backToList')}
          >
            <img
              src={heroSrc}
              alt=""
              className="w-full aspect-[21/9] object-cover transition-transform duration-200 ease-out group-hover:scale-[1.01]"
            />
          </Link>
        ) : (
          <div className="rounded-xl bg-white/5 aspect-video mb-8 border border-white/10" aria-hidden />
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-4xl shrink-0">{project.emoji}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h1>
          </div>
          {project.type && (
            <span className={`text-xs font-semibold rounded-full px-3 py-1 shrink-0 ${badgeClass}`}>
              {project.type}
            </span>
          )}
        </div>

        {project.problem && (
          <div className="mb-6">
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              {t('projects.problemLabel')}
            </span>
            <p className="text-white/85 mt-1 leading-relaxed">{project.problem}</p>
          </div>
        )}

        <p className="text-white/90 leading-relaxed mb-8">
          {project.solution || project.description}
        </p>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-2 mb-8">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-white/85">
                <span className="text-white mt-0.5 shrink-0">▸</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {(project.technologies || []).map((tech) => (
            <span
              key={tech}
              className="bg-white/10 text-white rounded-full px-3 py-1 text-sm font-medium border border-white/15"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-2">
          {project.link && project.link.startsWith('/') ? (
            <Link
              to={project.link}
              className="inline-flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              {linkLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              {linkLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          ) : null}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/75 hover:text-white text-sm font-medium transition-colors"
            >
              GitHub
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
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
