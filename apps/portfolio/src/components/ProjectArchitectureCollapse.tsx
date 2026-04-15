import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ArchitectureDecisions } from '../types/project';

type Props = {
  architectureDecisions?: ArchitectureDecisions;
};

function ProjectArchitectureCollapse({ architectureDecisions }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!architectureDecisions) return null;

  return (
    <div className="mt-8 pt-6 border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {t('projects.architectureLabel')}
      </button>

      {open && (
        <div className="mt-4 space-y-3 pl-4 border-l-2 border-neutral-200">
          {architectureDecisions.design && (
            <div>
              <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                {t('projects.designLabel')}
              </h5>
              <p className="text-sm text-neutral-600">{architectureDecisions.design}</p>
            </div>
          )}
          {architectureDecisions.database && (
            <div>
              <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                {t('projects.databaseLabel')}
              </h5>
              <p className="text-sm text-neutral-600">{architectureDecisions.database}</p>
            </div>
          )}
          {architectureDecisions.scalability && (
            <div>
              <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                {t('projects.scalabilityLabel')}
              </h5>
              <p className="text-sm text-neutral-600">{architectureDecisions.scalability}</p>
            </div>
          )}
          {architectureDecisions.tradeoffs && (
            <div>
              <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                {t('projects.tradeoffsLabel')}
              </h5>
              <p className="text-sm text-neutral-600">{architectureDecisions.tradeoffs}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectArchitectureCollapse;
