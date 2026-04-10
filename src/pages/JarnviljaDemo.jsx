import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEMO_URL = 'https://jarnvilja.example.com';

function JarnviljaDemo() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 shrink-0">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors"
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
        <span className="text-sm font-medium text-white/70">Järnvilja</span>
      </div>

      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-200/30 border-t-blue-200 rounded-full animate-spin" />
              <span className="text-sm text-white/50">{t('demo.loading')}</span>
            </div>
          </div>
        )}
        <iframe
          src={DEMO_URL}
          title="Järnvilja Demo"
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        />
      </div>
    </div>
  );
}

export default JarnviljaDemo;
