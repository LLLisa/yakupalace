import { ARTICLES } from '../memorization/articles.data'
import { POSTS } from '../blog/posts.data'

const SITE_NAME = 'Yaku Palace'
const DEFAULT_DESCRIPTION =
  'A system to learn how to calculate scores in riichi mahjong.'

export interface PageMeta {
  title: string
  description: string
  /** Open Graph type: 'article' for content pages, 'website' otherwise. */
  type: 'website' | 'article'
  /** ISO publish date, present on article/blog pages. */
  datePublished?: string
}

// Copy for the fixed (non-content) routes. Content routes (/learn/:slug,
// /blog/:slug) derive their meta from the article/post registries below.
const STATIC: Record<string, PageMeta> = {
  '/': {
    title: `${SITE_NAME} · Learn Riichi Mahjong Scoring`,
    description: DEFAULT_DESCRIPTION,
    type: 'website',
  },
  '/learn': {
    title: `Learn Riichi Scoring · ${SITE_NAME}`,
    description:
      'Articles on memorizing the yaku, calculating fu, and the riichi scoring system.',
    type: 'website',
  },
  '/blog': {
    title: `Blog · ${SITE_NAME}`,
    description: 'Notes and theory on riichi mahjong strategy.',
    type: 'website',
  },
  '/calculator': {
    title: `Score Calculator · ${SITE_NAME}`,
    description: 'Work out a riichi mahjong hand score from its han and fu.',
    type: 'website',
  },
}

/**
 * Title + description for a given route path. Pure and origin-free so it can run
 * both in the browser (RouteMeta, for the document title on client nav) and in
 * the build-time prerender (entry-server, which adds the absolute canonical/OG
 * URLs). A trailing slash is tolerated. Unknown paths fall back to site copy.
 */
export function getPageMeta(pathname: string): PageMeta {
  const path =
    pathname !== '/' && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname

  if (STATIC[path]) return STATIC[path]

  const learn = path.match(/^\/learn\/(.+)$/)
  if (learn) {
    const article = ARTICLES.find((a) => a.slug === learn[1])
    if (article) {
      return {
        title: `${article.title} · ${SITE_NAME}`,
        description: article.seoDescription ?? article.description,
        type: 'article',
        datePublished: article.date,
      }
    }
  }

  const blog = path.match(/^\/blog\/(.+)$/)
  if (blog) {
    const post = POSTS.find((p) => p.slug === blog[1])
    if (post) {
      return {
        title: `${post.title} · ${SITE_NAME}`,
        description: post.seoDescription ?? post.description,
        type: 'article',
        datePublished: post.date,
      }
    }
  }

  return { title: SITE_NAME, description: DEFAULT_DESCRIPTION, type: 'website' }
}
