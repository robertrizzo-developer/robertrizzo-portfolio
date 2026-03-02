import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative z-10 min-h-[70vh] flex items-center justify-center px-6 pt-24"
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          {t('home.name')}
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 italic mb-3">
          {t('home.tagline')}
        </p>
        <p className="text-base md:text-lg text-white/70 mb-4 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <p className="text-sm md:text-base text-green-300/90 font-medium mb-8">
          {t('home.availability')}
        </p>
        <div className="flex justify-center gap-4 text-3xl md:text-4xl mb-8">
          {t('home.emojis')
            .split(' ')
            .map((emoji, i) => (
              <span
                key={i}
                className="transition-transform hover:scale-125 cursor-default"
              >
                {emoji}
              </span>
            ))}
        </div>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-white/30 hover:bg-white/10 text-white font-medium rounded-full px-8 py-3 transition-all duration-300 hover:scale-105 hover:border-white/60"
        >
          {t('home.downloadCv')}
        </a>
        <div className="mt-10 flex justify-center">
          <span className="w-3 h-3 bg-blue-200 rounded-full animate-pulse-dot" />
        </div>
      </div>
    </section>
  );
}

export default Home;
