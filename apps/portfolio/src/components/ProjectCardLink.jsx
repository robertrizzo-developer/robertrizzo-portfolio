import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { slugByIndex } from '../data/projectRoutes';
import { getProjectCoverImage } from '../data/featuredProjects';

const TYPE_COLORS = {
  Skolprojekt: 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  'School Project': 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  Volontär: 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  Volunteer: 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  'Produktionssystem': 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  'Production System': 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  Hobby: 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  'Eget projekt': 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
  'Personal Project': 'bg-neutral-900/5 text-neutral-700 border border-neutral-200',
};

function ProjectCardLink({ project, index, slug: slugProp }) {
  const { t } = useTranslation();
  const slug = slugProp ?? slugByIndex(index);
  if (!slug) return null;

  const coverSrc = getProjectCoverImage(slug);
  const summary = project.solution || project.description || '';
  const techChips = (project.technologies || []).slice(0, 2);

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
      {/* IMAGE */}
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

      {/* CONTENT */}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-xl opacity-80" aria-hidden>
            {project.emoji}
          </span>

          <h3 className="
            text-base md:text-lg font-medium text-neutral-100
            tracking-tight leading-snug
            group-hover:text-white transition-colors
          ">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-4">
          {summary}
        </p>

        {/* BADGES */}
        <div className="flex flex-wrap gap-2">
          {project.type ? (
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${TYPE_COLORS[project.type]}`}
            >
              {project.type}
            </span>
          ) : (
            techChips.map((tech) => (
              <span
                key={tech}
                className="
                  text-xs px-2.5 py-1 rounded-full
                  bg-neutral-900/40 text-neutral-400
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