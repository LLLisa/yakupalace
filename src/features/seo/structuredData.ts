import { ARTICLES } from '../memorization/articles.data'
import { POSTS } from '../blog/posts.data'
import { YAKU_DEFINITIONS } from '../memorization/yakuDefinitions'
import { getPageMeta } from './pageMeta'

// Builds schema.org JSON-LD nodes for a route. Origin-dependent (absolute URLs),
// so it runs only in the build-time prerender (entry-server.tsx), which
// serializes each node into its own <script type="application/ld+json">.

const SITE_NAME = 'Yaku Palace'
const AUTHOR_NAME = 'Lisa'

type Json = Record<string, unknown>

interface ContentItem {
  slug: string
  title: string
  date: string
}

function organization(siteUrl: string): Json {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/og-default.png` },
  }
}

function breadcrumb(
  siteUrl: string,
  trail: Array<{ name: string; path: string }>,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${siteUrl}${t.path}`,
    })),
  }
}

function contentArticle(
  type: 'Article' | 'BlogPosting',
  siteUrl: string,
  path: string,
  item: ContentItem,
): Json {
  const pageUrl = `${siteUrl}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: item.title,
    description: getPageMeta(path).description,
    datePublished: item.date,
    dateModified: item.date,
    author: { '@type': 'Person', name: AUTHOR_NAME },
    publisher: organization(siteUrl),
    image: `${siteUrl}/og-default.png`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    url: pageUrl,
  }
}

// "menzen-tsumo" -> "Menzen Tsumo"
function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function definedTermSet(pageUrl: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Riichi Yaku Glossary',
    url: pageUrl,
    hasDefinedTerm: Object.entries(YAKU_DEFINITIONS).map(([id, definition]) => ({
      '@type': 'DefinedTerm',
      name: titleCaseSlug(id),
      description: definition,
      url: `${pageUrl}#${id}`,
      inDefinedTermSet: pageUrl,
    })),
  }
}

const INDEX_NAMES: Record<string, string> = {
  '/learn': 'Learn',
  '/blog': 'Blog',
  '/calculator': 'Calculator',
}

export function buildStructuredData(path: string, siteUrl: string): Json[] {
  const pageUrl = `${siteUrl}${path}`

  if (path === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${siteUrl}/`,
        publisher: organization(siteUrl),
        // No SearchAction: there's no site-search endpoint yet. Add a
        // potentialAction → SearchAction with a working target URL if one ships.
      },
    ]
  }

  const learn = path.match(/^\/learn\/(.+)$/)
  if (learn) {
    const article = ARTICLES.find((a) => a.slug === learn[1])
    if (!article) return []
    const nodes: Json[] = [
      contentArticle('Article', siteUrl, path, article),
      breadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'Learn', path: '/learn' },
        { name: article.title, path },
      ]),
    ]
    if (article.slug === 'yaku-glossary') nodes.push(definedTermSet(pageUrl))
    return nodes
  }

  const blog = path.match(/^\/blog\/(.+)$/)
  if (blog) {
    const post = POSTS.find((p) => p.slug === blog[1])
    if (!post) return []
    return [
      contentArticle('BlogPosting', siteUrl, path, post),
      breadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]),
    ]
  }

  if (INDEX_NAMES[path]) {
    return [
      breadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: INDEX_NAMES[path], path },
      ]),
    ]
  }

  return []
}
