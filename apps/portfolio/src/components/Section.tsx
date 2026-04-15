import type { ReactNode } from 'react';
import useInView from '../hooks/useInView';

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  fullScreen?: boolean;
};

function Section({ id, children, className = '', fullScreen = false }: SectionProps) {
  const [ref, isInView] = useInView();

  return (
    <section
      id={id}
      ref={ref}
      className={`relative z-10 px-6 sm:px-8 md:px-10 lg:px-12 py-24 md:py-28 lg:py-32 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${fullScreen ? 'min-h-screen flex items-center justify-center' : ''} ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl md:max-w-3xl lg:max-w-5xl">{children}</div>
    </section>
  );
}

export default Section;
