import type { ComponentType } from 'react'
import { POSTS } from './posts.data'

// Metadata lives in a pure-data module (no React/Vite-glob imports) so the
// build-time sitemap generator can consume it too. Re-exported here so existing
// importers keep working unchanged.
export { POSTS }
export type { PostMeta } from './posts.data'

// Eagerly import every post MDX so it renders synchronously — the build-time
// prerender's renderToString does not await Suspense, and eager modules on both
// server and client keep the hydrated markup identical.
const modules = import.meta.glob<{ default: ComponentType }>('./content/*.mdx', {
  eager: true,
})

const componentBySlug: Record<string, ComponentType> = {}
for (const path in modules) {
  const slug = path.replace('./content/', '').replace('.mdx', '')
  componentBySlug[slug] = modules[path].default
}

export function getPostComponent(slug: string) {
  return componentBySlug[slug] ?? null
}

export function getPostMeta(slug: string) {
  return POSTS.find((p) => p.slug === slug) ?? null
}
