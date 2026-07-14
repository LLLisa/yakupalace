import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import tailwindcss from '@tailwindcss/vite'
import { getRoutes } from './src/features/seo/routePaths'
import { POSTS } from './src/features/blog/posts.data'

// Public origin the site is served from. Override with SITE_URL (e.g. a custom
// domain) — otherwise it falls back to the Heroku app URL. No trailing slash.
const SITE_URL = (
  process.env.SITE_URL ?? 'https://yakupalace-b4e6516422db.herokuapp.com'
).replace(/\/$/, '')

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// RSS 2.0 feed for the blog, newest first.
function rssFeed(): string {
  const items = [...POSTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const description = p.seoDescription ?? p.description
      return (
        '    <item>\n' +
        `      <title>${escapeXml(p.title)}</title>\n` +
        `      <link>${url}</link>\n` +
        `      <guid isPermaLink="true">${url}</guid>\n` +
        `      <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n` +
        `      <description>${escapeXml(description)}</description>\n` +
        '    </item>'
      )
    })
    .join('\n')

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>Yaku Palace Blog</title>\n' +
    `    <link>${SITE_URL}/blog</link>\n` +
    '    <description>Notes and theory on riichi mahjong strategy.</description>\n' +
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n` +
    items +
    '\n  </channel>\n</rss>\n'
  )
}

// Emit sitemap.xml and robots.txt into the build output. Uses the same route
// list (getRoutes) as the prerender script, so the two never drift.
function seoFiles(): Plugin {
  let isSsr = false
  return {
    name: 'seo-files',
    apply: 'build',
    configResolved(config) {
      isSsr = !!config.build.ssr
    },
    generateBundle() {
      // Only emit during the client build; the SSR build's output is discarded.
      if (isSsr) return
      const urls = getRoutes()
        .map((e) => {
          const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''
          return `  <url><loc>${SITE_URL}${e.path}</loc>${lastmod}<priority>${e.priority}</priority></url>`
        })
        .join('\n')

      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls +
        '\n</urlset>\n'

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: rssFeed() })
    },
  }
}

// MDX must be registered before the React plugin (enforce: 'pre') so that
// .mdx files are transformed to JSX before React's Fast Refresh runs.
export default defineConfig({
  // Pin the dev server to a dedicated port so it never collides with (or hops
  // around) other running Vite instances. strictPort makes a taken port a hard
  // error instead of a silent fallback to the next free one.
  server: {
    port: 4556,
    strictPort: true,
  },
  plugins: [
    {
      enforce: 'pre',
      // providerImportSource lets <MDXProvider> inject element overrides (e.g.
      // routing-aware links) into compiled MDX — see src/components/MdxLink.tsx.
      ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: '@mdx-js/react' }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    seoFiles(),
  ],
})
