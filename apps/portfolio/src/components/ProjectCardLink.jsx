import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { slugByIndex } from '../data/projectRoutes';
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

function ProjectCardLink({ project, index, slug: slugProp }) {
  const { t } = useTranslation();
  const slug = slugProp ?? slugByIndex(index);
  if (!slug) return null;

  const coverSrc = getProjectCoverImage(slug);
  const summary = project.solution || project.description || '';
  const badgeClass = TYPE_COLORS[project.type] || 'bg-neutral-100 text-neutral-700';
  const techChips = (project.technologies || []).slice(0, 2);

  return (
    <Link
      to={`/projects/${slug}`}
      className="group block bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label={`${project.title} — ${t('projects.viewDetails')}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" aria-hidden />
        )}
      </div>
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden>
              {project.emoji}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-neutral-900 group-hover:text-blue-800 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>
        </div>
        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2 mb-4">{summary}</p>
        <div className="flex flex-wrap gap-2">
          {project.type ? (
            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${badgeClass}`}>
              {project.type}
            </span>
          ) : (
            techChips.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-neutral-100 text-neutral-700 rounded-full px-2.5 py-0.5 border border-neutral-200 font-medium"
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
