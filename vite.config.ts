import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import tailwindcss from '@tailwindcss/vite'
import { ARTICLES } from './src/features/memorization/articles.data'
import { POSTS } from './src/features/blog/posts.data'

// Public origin the site is served from. Override with SITE_URL (e.g. a custom
// domain) — otherwise it falls back to the Heroku app URL. No trailing slash.
const SITE_URL = (
  process.env.SITE_URL ?? 'https://yakupalace-b4e6516422db.herokuapp.com'
).replace(/\/$/, '')

interface SitemapEntry {
  path: string
  priority: string
  /** ISO date string, if the route has a known publish/update date. */
  lastmod?: string
}

// Emit sitemap.xml and robots.txt into the build output. Driven by the same
// route registries the app uses, so new articles/posts appear automatically.
function seoFiles(): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      const entries: SitemapEntry[] = [
        { path: '/', priority: '1.0' },
        { path: '/learn', priority: '0.9' },
        { path: '/blog', priority: '0.9' },
        { path: '/calculator', priority: '0.8' },
        ...ARTICLES.map((a): SitemapEntry => ({
          path: `/learn/${a.slug}`,
          priority: '0.7',
          lastmod: a.date,
        })),
        ...POSTS.map((p): SitemapEntry => ({
          path: `/blog/${p.slug}`,
          priority: '0.7',
          lastmod: p.date,
        })),
      ]

      const urls = entries
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
