export const PROJECT_SLUGS = [
  'booking-api',
  'fishing-club-website',
  'jarnvilja-app',
  'weather-app',
  'ai-chatbot',
];

export function slugByIndex(index) {
  return PROJECT_SLUGS[index] ?? null;
}

export function indexBySlug(slug) {
  return PROJECT_SLUGS.indexOf(slug);
}

export function getProjectBySlug(slug, items) {
  const idx = indexBySlug(slug);
  if (idx < 0 || !Array.isArray(items) || !items[idx]) return null;
  return { project: items[idx], index: idx };
}
