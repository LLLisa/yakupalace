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
 *
 * Pure data with no React or Vite-glob imports, so it can also be consumed at
 * build time by the sitemap generator in vite.config.ts. The runtime registry
 * (articles.ts) re-exports these.
 */
export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'how-to-memorize',
    title: 'How to Memorize Anything',
    description: 'The keys to the Palace',
    date: '2026-05-26'
  },
  {
    slug: 'memorize-yaku',
    title: 'How I Memorized Yaku',
    description: 'My Yaku Memory Palace / Dream Home',
    date: '2026-05-26'
  },
  {
    slug: 'memorize-fu',
    title: 'How I Memorized Fu',
    description: 'Cooking Points Up in the Kitchen',
    date: '2026-05-26'
  },
  {
    slug: 'yaku-glossary',
    title: 'Yaku Glossary',
    description: 'Every standard yaku, with tile illustrations',
    date: '2026-05-27',
  },
  // {
  //   slug: 'table-builder',
  //   title: 'Table builder',
  //   description: 'Fill in your own values, then export the table as a PDF.',
  //   date: '2026-05-26',
  // },
]
