import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { slugByIndex } from '../data/projectRoutes';
import { getProjectCoverImage } from '../data/featuredProjects';
import type { ProjectItem } from '../types/project';

const TYPE_COLORS: Record<string, string> = {
  Skolprojekt: 'bg-white/10 text-white border border-white/20',
  'School Project': 'bg-white/10 text-white border border-white/20',
  Volontär: 'bg-emerald-500/15 text-white border border-emerald-400/30',
  Volunteer: 'bg-emerald-500/15 text-white border border-emerald-400/30',
  Produktionssystem: 'bg-teal-500/15 text-white border border-teal-400/30',
  'Production System': 'bg-teal-500/15 text-white border border-teal-400/30',
  Hobby: 'bg-violet-500/15 text-white border border-violet-400/30',
  'Eget projekt': 'bg-sky-500/15 text-white border border-sky-400/30',
  'Personal Project': 'bg-sky-500/15 text-white border border-sky-400/30',
};

type ProjectCardLinkProps = {
  project: ProjectItem;
  index: number;
  slug?: string;
};

function ProjectCardLink({ project, index, slug: slugProp }: ProjectCardLinkProps) {
  const { t } = useTranslation();
  const slug = slugProp ?? slugByIndex(index);
  if (!slug) return null;

  const coverSrc = getProjectCoverImage(slug);
  const summary = project.solution || project.description || '';
  const techChips = (project.technologies || []).slice(0, 2);
  const typeClass = project.type ? TYPE_COLORS[project.type] ?? TYPE_COLORS['Hobby'] : '';

  return (
    <Link
      to={`/projects/${slug}`}
      className="
        group block overflow-hidden rounded-2xl
        border border-neutral-800/40
        bg-neutral-950/40
        backdrop-blur-md
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-neutral-700/60
        hover:bg-neutral-950/60
      "
      aria-label={`${project.title} — ${t('projects.viewDetails')}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            className="
              h-full w-full object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-[1.03]
              opacity-90 group-hover:opacity-100
            "
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" aria-hidden />
        )}
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl opacity-80" aria-hidden>
            {project.emoji}
          </span>

          <h3
            className="
            text-base md:text-lg font-medium text-white
            tracking-tight leading-snug
            group-hover:text-white transition-colors
          "
          >
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-white/80 leading-relaxed line-clamp-2 mb-4">{summary}</p>

        <div className="flex flex-wrap gap-2">
          {project.type ? (
            <span className={`text-xs px-2.5 py-1 rounded-full ${typeClass}`}>{project.type}</span>
          ) : (
            techChips.map((tech) => (
              <span
                key={tech}
                className="
                  text-xs px-2.5 py-1 rounded-full
                  bg-white/10 text-white/85
                  border border-neutral-800/40
                "
              >
                {tech}
              </span>
            ))
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProjectCardLink;
