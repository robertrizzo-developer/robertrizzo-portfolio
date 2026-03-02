import { useTranslation } from 'react-i18next';

const CATEGORIES = [
  { key: 'skills.backend', icon: '⚙️' },
  { key: 'skills.databases', icon: '🗄️' },
  { key: 'skills.testing', icon: '🧪' },
  { key: 'skills.security', icon: '🔐' },
  { key: 'skills.frontend', icon: '🖥️' },
  { key: 'skills.devops', icon: '🚀' },
  { key: 'skills.observability', icon: '📊' },
  { key: 'skills.methodologies', icon: '📋' },
];

function SkillsGrid() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map(({ key, icon }) => (
        <div
          key={key}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-200/30 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{icon}</span>
            <h4 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
              {t(`${key}.title`)}
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {t(`${key}.items`, { returnObjects: true }).map((skill) => (
              <span
                key={skill}
                className="bg-blue-200/10 text-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillsGrid;
