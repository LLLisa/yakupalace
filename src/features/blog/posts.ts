import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { POSTS } from './posts.data'

// Metadata lives in a pure-data module (no React/Vite-glob imports) so the
// build-time sitemap generator can consume it too. Re-exported here so existing
// importers keep working unchanged.
export { POSTS }
export type { PostMeta } from './posts.data'

// Eagerly map every MDX file to a lazy-loaded component, keyed by slug.
const modules = import.meta.glob('./content/*.mdx')

const componentBySlug: Record<string, LazyExoticComponent<ComponentType>> = {}
for (const path in modules) {
  const slug = path.replace('./content/', '').replace('.mdx', '')
  componentBySlug[slug] = lazy(
    modules[path] as () => Promise<{ default: ComponentType }>,
  )
}

export function getPostComponent(slug: string) {
  return componentBySlug[slug] ?? null
}

export function getPostMeta(slug: string) {
  return POSTS.find((p) => p.slug === slug) ?? null
}
