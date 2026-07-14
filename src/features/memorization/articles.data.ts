export interface ArticleMeta {
  slug: string
  title: string
  /** Short tagline shown in the article list UI. */
  description: string
  /**
   * Longer, keyword-aware copy (~140–160 chars) for the SEO <meta description>
   * and social cards. Falls back to `description` when absent.
   */
  seoDescription?: string
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
    seoDescription:
      'Learn the memory-palace (mnemonic) technique and use it to memorize riichi mahjong scoring — how memory really works, plus a worked example.',
    date: '2026-05-26'
  },
  {
    slug: 'memorize-yaku',
    title: 'How I Memorized Yaku',
    description: 'My Yaku Memory Palace / Dream Home',
    seoDescription:
      'A complete memory palace for every riichi mahjong yaku, organized by open/closed han value, with the vivid images used to recall each one.',
    date: '2026-05-26'
  },
  {
    slug: 'memorize-fu',
    title: 'How I Memorized Fu',
    description: 'Cooking Points Up in the Kitchen',
    seoDescription:
      'A step-by-step memory palace for counting fu in riichi mahjong: pairs, triplets, kans, waits, and base points, laid out as a kitchen.',
    date: '2026-05-26'
  },
  {
    slug: 'yaku-glossary',
    title: 'Yaku Glossary',
    description: 'Every standard yaku, with tile illustrations',
    seoDescription:
      'Every standard riichi mahjong yaku in one place, with tile illustrations, han values, and open/closed scoring — from pinfu to the yakuman.',
    date: '2026-05-27',
  },
  // {
  //   slug: 'table-builder',
  //   title: 'Table builder',
  //   description: 'Fill in your own values, then export the table as a PDF.',
  //   date: '2026-05-26',
  // },
]
