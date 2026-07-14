import { ARTICLES } from '../memorization/articles.data'
import { POSTS } from '../blog/posts.data'

export interface RouteInfo {
  path: string
  /** Sitemap priority, 0.0–1.0 as a string. */
  priority: string
  /** ISO date string for <lastmod>, when the route has a known date. */
  lastmod?: string
}

// Fixed (non-content) routes.
const STATIC_ROUTES: RouteInfo[] = [
  { path: '/', priority: '1.0' },
  { path: '/learn', priority: '0.9' },
  { path: '/blog', priority: '0.9' },
  { path: '/calculator', priority: '0.8' },
]

/**
 * Every route to prerender and to list in the sitemap: the static routes plus
 * one per live article/post, derived from the registries so new content is
 * picked up automatically. Single source of truth shared by the build-time
 * sitemap generator (vite.config.ts) and the prerender script, so the two can't
 * drift. The catch-all 404 route is intentionally excluded — unknown URLs fall
 * back to the SPA at runtime.
 */
export function getRoutes(): RouteInfo[] {
  return [
    ...STATIC_ROUTES,
    ...ARTICLES.map(
      (a): RouteInfo => ({ path: `/learn/${a.slug}`, priority: '0.7', lastmod: a.date }),
    ),
    ...POSTS.map(
      (p): RouteInfo => ({ path: `/blog/${p.slug}`, priority: '0.7', lastmod: p.date }),
    ),
  ]
}

export function getRoutePaths(): string[] {
  return getRoutes().map((r) => r.path)
}
