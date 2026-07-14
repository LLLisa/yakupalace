import type { ComponentType } from 'react'
import { ARTICLES } from './articles.data'

// Metadata lives in a pure-data module (no React/Vite-glob imports) so the
// build-time sitemap generator can consume it too. Re-exported here so existing
// importers keep working unchanged.
export { ARTICLES }
export type { ArticleMeta } from './articles.data'

// Eagerly import every article MDX so it renders synchronously. The build-time
// prerender's renderToString does not await Suspense, and eager modules on both
// server and client keep the hydrated markup identical. table-builder.mdx is
// excluded: it pulls in @react-pdf/renderer (browser-only) and isn't a live
// route.
const modules = import.meta.glob<{ default: ComponentType }>(
  ['./content/*.mdx', '!./content/table-builder.mdx'],
  { eager: true },
)

const componentBySlug: Record<string, ComponentType> = {}
for (const path in modules) {
  const slug = path.replace('./content/', '').replace('.mdx', '')
  componentBySlug[slug] = modules[path].default
}

export function getArticleComponent(slug: string) {
  return componentBySlug[slug] ?? null
}

export function getArticleMeta(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null
}
