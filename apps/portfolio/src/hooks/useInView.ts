import { useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS: IntersectionObserverInit = { threshold: 0.1 };

export default function useInView(
  options: IntersectionObserverInit = DEFAULT_OPTIONS
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const { threshold, root, rootMargin } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return [ref, isInView];
}
