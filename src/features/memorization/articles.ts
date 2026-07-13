import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { ARTICLES } from './articles.data'

// Metadata lives in a pure-data module (no React/Vite-glob imports) so the
// build-time sitemap generator can consume it too. Re-exported here so existing
// importers keep working unchanged.
export { ARTICLES }
export type { ArticleMeta } from './articles.data'

// Eagerly map every MDX file to a lazy-loaded component, keyed by slug.
const modules = import.meta.glob('./content/*.mdx')

const componentBySlug: Record<string, LazyExoticComponent<ComponentType>> = {}
for (const path in modules) {
  const slug = path.replace('./content/', '').replace('.mdx', '')
  componentBySlug[slug] = lazy(
    modules[path] as () => Promise<{ default: ComponentType }>,
  )
}

export function getArticleComponent(slug: string) {
  return componentBySlug[slug] ?? null
}

export function getArticleMeta(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null
}
