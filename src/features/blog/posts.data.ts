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
    date: '2026-07-13',
  },
  {
    slug: 'yaku-archetypes',
    title: 'Yaku Archetypes',
    description: 'Another way to think about yaku',
    date: '2026-05-27',
  },
  {
    slug: 'suji-secret',
    title: 'The Suji Secret',
    description: "It's not actually that complicated",
    date: '2026-07-13',
  },
]
