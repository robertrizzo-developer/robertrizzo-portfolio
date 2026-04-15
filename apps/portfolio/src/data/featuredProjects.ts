import { indexBySlug } from './projectRoutes';
import type { ProjectItem } from '../types/project';

import refactoringCover from '../assets/projects/refactoring-visualizer/cover.svg';
import fishingCover from '../assets/projects/fishing-club/sfkmFrontpage.jpeg';
import jarnviljaCover from '../assets/projects/jarnvilja/jarnviljaFrontpage.jpeg';

export const FEATURED_PROJECT_SLUGS = [
  'jarnvilja-app',
  'fishing-club-website',
  'refactoring-visualizer',
] as const;

const PROJECT_COVER_IMAGES: Record<string, string> = {
  'refactoring-visualizer': refactoringCover,
  'fishing-club-website': fishingCover,
  'jarnvilja-app': jarnviljaCover,
};

export function getProjectCoverImage(slug: string | undefined): string | null {
  if (!slug) return null;
  return PROJECT_COVER_IMAGES[slug] ?? null;
}

export type FeaturedProjectEntry = {
  slug: string;
  index: number;
  project: ProjectItem;
};

export function getFeaturedProjectEntries(items: unknown): FeaturedProjectEntry[] {
  if (!Array.isArray(items)) return [];
  const out: FeaturedProjectEntry[] = [];
  for (const slug of FEATURED_PROJECT_SLUGS) {
    const idx = indexBySlug(slug);
    if (idx < 0 || !items[idx]) continue;
    out.push({ slug, index: idx, project: items[idx] as ProjectItem });
  }
  return out;
}
