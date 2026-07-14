export interface PostMeta {
  slug: string
  title: string
  /** Short tagline shown in the blog list UI. */
  description: string
  /**
   * Longer, keyword-aware copy (~140–160 chars) for the SEO <meta description>,
   * social cards, and RSS. Falls back to `description` when absent.
   */
  seoDescription?: string
  /** ISO date string. */
  date: string
}

/**
 * Blog post metadata. Keep this in sync with the .mdx files in `content/`.
 * The slug must match the filename (without extension).
 *
 * Pure data with no React or Vite-glob imports, so it can also be consumed at
 * build time by the sitemap generator in vite.config.ts. The runtime registry
 * (posts.ts) re-exports these.
 */
export const POSTS: PostMeta[] = [
  {
    slug: 'about-me',
    title: 'About Me',
    description: 'More than an anime pfp',
    seoDescription:
      'Lisa — a New York software engineer, musician, and riichi mahjong player — on why she built Yaku Palace to sort through scoring theory and strategy.',
    date: '2026-07-13',
  },
  {
    slug: 'yaku-archetypes',
    title: 'Yaku Archetypes',
    description: 'Another way to think about yaku',
    seoDescription:
      "Group riichi mahjong yaku by archetype — chi-based, pon-based, and shape-agnostic — to steer your own hand and read your opponents' hands in practice.",
    date: '2026-05-27',
  },
  {
    slug: 'suji-secret',
    title: 'The Suji Secret',
    description: "It's not actually that complicated",
    seoDescription:
      'Suji defense in riichi mahjong made simple: why the dangerous-tile concepts (ura-suji, matagi-suji, aida-yonken) are redundant once you know basic suji.',
    date: '2026-07-13',
  },
]
