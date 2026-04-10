import { indexBySlug } from './projectRoutes';

import bookingCover from '../assets/projects/booking-api/cover.svg';
import fishingCover from '../assets/projects/fishing-club/sfkmFrontpage.jpeg';
import jarnviljaCover from '../assets/projects/jarnvilja/jarnviljaFrontpage.jpeg';

/**
 * Slugs for projects shown on home and /projects (UI filter only; i18n keeps full list).
 * Display order: Järnvilja, Fishing Club, Booking API.
 */
export const FEATURED_PROJECT_SLUGS = [
  'jarnvilja-app',
  'fishing-club-website',
  'booking-api',
];

const PROJECT_COVER_IMAGES = {
  'booking-api': bookingCover,
  'fishing-club-website': fishingCover,
  'jarnvilja-app': jarnviljaCover,
};

export function getProjectCoverImage(slug) {
  return PROJECT_COVER_IMAGES[slug] ?? null;
}

/**
 * @param {unknown[]} items - `t('projects.items', { returnObjects: true })`
 * @returns {{ slug: string, index: number, project: object }[]}
 */
export function getFeaturedProjectEntries(items) {
  if (!Array.isArray(items)) return [];
  return FEATURED_PROJECT_SLUGS.map((slug) => {
    const idx = indexBySlug(slug);
    if (idx < 0 || !items[idx]) return null;
    return { slug, index: idx, project: items[idx] };
  }).filter(Boolean);
}
