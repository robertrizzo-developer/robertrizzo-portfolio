import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEMO_URL =
  import.meta.env.VITE_REFACTORING_VISUALIZER_URL || 'https://refactoring-visualizer.example.com';

function RefactoringVisualizerDemo() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200 shadow-sm shrink-0">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-700 hover:text-blue-700 transition-colors"
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
          {t('demo.backToPortfolio')}
        </Link>
        <span className="text-sm font-medium text-neutral-900">Refactoring Visualizer</span>
      </div>

      <div className="relative flex-1 flex flex-col min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-neutral-200 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm text-neutral-500">{t('demo.loading')}</span>
            </div>
          </div>
        )}
        <iframe
          src={DEMO_URL}
          title="Refactoring Visualizer Demo"
          className="w-full flex-1 min-h-0 border-0"
          onLoad={() => setLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
        <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-center text-sm">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-medium"
          >
            {t('demo.openInNewTab')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default RefactoringVisualizerDemo;
