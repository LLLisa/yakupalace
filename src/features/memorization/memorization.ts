import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  /** ISO date string. */
  date: string
}

/**
 * Article metadata. Keep this in sync with the .mdx files in `content/`.
 * The slug must match the filename (without extension).
 */
export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'how-to-memorize',
    title: 'How to Memorize Anything',
    description: 'The keys to the Palace',
    date: '2026-05-26'
  },
  {
    slug: 'what-is-riichi',
    title: 'What is Riichi Mahjong?',
    description: 'A one-page orientation to the four-player Japanese game.',
    date: '2026-05-25',
  },
  {
    slug: 'adding-articles',
    title: 'How to Add an Article',
    description: 'A template showing the MDX authoring workflow for this site.',
    date: '2026-05-25',
  },
  {
    slug: 'table-builder',
    title: 'Table builder',
    description: 'Fill in your own values, then export the table as a PDF.',
    date: '2026-05-26',
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

export function getArticleComponent(slug: string) {
  return componentBySlug[slug] ?? null
}

export function getArticleMeta(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) ?? null
}
