import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** ISO date string. */
  date: string
}

/**
 * Blog post metadata. Keep this in sync with the .mdx files in `content/`.
 * The slug must match the filename (without extension).
 */
export const POSTS: PostMeta[] = [
  {
    slug: 'yaku-archetypes',
    title: 'Yaku Archetypes',
    description: 'Another way to think about yaku',
    date: '2026-05-27',
  },
]

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
