import useInView from '../hooks/useInView';

function Section({ id, children, className = '', fullScreen = false }) {
  const [ref, isInView] = useInView();

  return (
    <section
      id={id}
      ref={ref}
      className={`relative z-10 px-6 py-20 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${fullScreen ? 'min-h-screen flex items-center justify-center' : ''} ${className}`}
    >
      <div className="max-w-4xl mx-auto w-full">{children}</div>
    </section>
  );
}

export default Section;
