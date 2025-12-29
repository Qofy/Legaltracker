// Small utility helpers used across the frontend
// Export `createPageUrl` so components can import from `@/utils`

export function createPageUrl(pageName) {
  if (!pageName) return '/';
  return `/${String(pageName).toLowerCase().replace(/\s+/g, '-')}`;
}

export default {
  createPageUrl
}
