import type { ProjectItem } from '../types/project';

export const PROJECT_SLUGS = [
  'refactoring-visualizer',
  'fishing-club-website',
  'jarnvilja-app',
  'weather-app',
  'ai-chatbot',
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export function slugByIndex(index: number): string | null {
  return PROJECT_SLUGS[index] ?? null;
}

export function indexBySlug(slug: string | undefined): number {
  if (!slug) return -1;
  return PROJECT_SLUGS.indexOf(slug as ProjectSlug);
}

export function getProjectBySlug(
  slug: string | undefined,
  items: unknown
): { project: ProjectItem; index: number } | null {
  const idx = indexBySlug(slug);
  if (idx < 0 || !Array.isArray(items) || !items[idx]) return null;
  return { project: items[idx] as ProjectItem, index: idx };
}
