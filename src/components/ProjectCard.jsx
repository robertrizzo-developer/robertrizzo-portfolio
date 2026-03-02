import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TYPE_COLORS = {
  Skolprojekt: 'bg-amber-400/20 text-amber-200',
  'School Project': 'bg-amber-400/20 text-amber-200',
  Volontär: 'bg-green-400/20 text-green-200',
  Volunteer: 'bg-green-400/20 text-green-200',
  'Produktionssystem': 'bg-teal-400/20 text-teal-200',
  'Production System': 'bg-teal-400/20 text-teal-200',
  Hobby: 'bg-purple-400/20 text-purple-200',
  'Eget projekt': 'bg-blue-400/20 text-blue-200',
  'Personal Project': 'bg-blue-400/20 text-blue-200',
};

function ProjectCard({
  emoji,
  title,
  description,
  problem,
  solution,
  highlights,
  architectureDecisions,
  technologies,
  type,
  link,
  linkLabel,
  githubLink,
  featured,
}) {
  const { t } = useTranslation();
  const [showArchitecture, setShowArchitecture] = useState(false);
  const badgeClass = TYPE_COLORS[type] || 'bg-white/10 text-white/70';

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200/50 rounded-l-2xl" />
      <div className="p-6 md:p-8 pl-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
          </div>
          {type && (
            <span className={`text-xs font-semibold rounded-full px-3 py-1 ${badgeClass}`}>
              {type}
            </span>
          )}
        </div>

        {problem && (
          <div className="mb-4">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              {t('projects.problemLabel')}
            </span>
            <p className="text-blue-100/80 text-sm mt-1">{problem}</p>
          </div>
        )}

        <p className="text-blue-100 mb-4 leading-relaxed">
          {solution || description}
        </p>

        {highlights && highlights.length > 0 && (
          <ul className="space-y-1.5 mb-5">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <span className="text-blue-200 mt-0.5 shrink-0">▸</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="bg-blue-200/20 text-blue-100 rounded-full px-3 py-1 text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm font-medium transition-colors"
            >
              {linkLabel || t('projects.viewProject')}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              GitHub
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {architectureDecisions && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center gap-2 text-sm font-medium text-blue-200/80 hover:text-blue-200 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform duration-200 ${showArchitecture ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {t('projects.architectureLabel')}
            </button>

            {showArchitecture && (
              <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-200/20">
                {architectureDecisions.design && (
                  <div>
                    <h5 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                      {t('projects.designLabel')}
                    </h5>
                    <p className="text-sm text-white/70">{architectureDecisions.design}</p>
                  </div>
                )}
                {architectureDecisions.database && (
                  <div>
                    <h5 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                      {t('projects.databaseLabel')}
                    </h5>
                    <p className="text-sm text-white/70">{architectureDecisions.database}</p>
                  </div>
                )}
                {architectureDecisions.scalability && (
                  <div>
                    <h5 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                      {t('projects.scalabilityLabel')}
                    </h5>
                    <p className="text-sm text-white/70">{architectureDecisions.scalability}</p>
                  </div>
                )}
                {architectureDecisions.tradeoffs && (
                  <div>
                    <h5 className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                      {t('projects.tradeoffsLabel')}
                    </h5>
                    <p className="text-sm text-white/70">{architectureDecisions.tradeoffs}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
