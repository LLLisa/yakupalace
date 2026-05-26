#!/usr/bin/env -S npx tsx
/**
 * Yaku Palace MCP server (stdio).
 *
 * Exposes tools over the deployed site and the local project data:
 *   - fetch_page:      GET a path on yakupalace.com (the live deployment)
 *   - list_articles:   list articles from the local MDX content
 *   - read_article:    return the raw MDX for one article
 *   - calculate_score: riichi scoring, reusing the app's scoring module
 *
 * Note: yakupalace.com is a client-rendered SPA, so fetch_page returns the
 * app shell HTML, not article text — use list_articles/read_article for that.
 */
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { scoreHand } from '../../src/features/calculator/scoring.ts'

const SITE_URL = (process.env.SITE_URL ?? 'https://yakupalace.com').replace(/\/$/, '')
const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, '..', '..', 'src', 'features', 'memorization', 'content')
const MAX_BODY = 20_000

const server = new McpServer({ name: 'yakupalace', version: '0.1.0' })

const text = (body: string) => ({ content: [{ type: 'text' as const, text: body }] })
const fail = (body: string) => ({ content: [{ type: 'text' as const, text: body }], isError: true })

server.registerTool(
  'fetch_page',
  {
    title: 'Fetch a page from yakupalace.com',
    description:
      'GET a path on the deployed site (default https://yakupalace.com) and return the response text. ' +
      'The site is a client-rendered SPA, so this returns the app shell, not rendered article content.',
    inputSchema: { path: z.string().describe('Path to fetch, e.g. "/" or "/articles"') },
  },
  async ({ path }) => {
    const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
    try {
      const res = await fetch(url)
      const body = await res.text()
      const clipped = body.length > MAX_BODY ? `${body.slice(0, MAX_BODY)}\n…[truncated]` : body
      return text(`GET ${url} → ${res.status} ${res.statusText}\n\n${clipped}`)
    } catch (err) {
      return fail(`Failed to fetch ${url}: ${(err as Error).message}`)
    }
  },
)

server.registerTool(
  'list_articles',
  {
    title: 'List articles',
    description: 'List the site\'s articles (slug + title) from the local MDX content.',
    inputSchema: {},
  },
  async () => {
    try {
      const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.mdx'))
      const items = await Promise.all(
        files.map(async (file) => {
          const slug = file.replace(/\.mdx$/, '')
          const body = await readFile(join(CONTENT_DIR, file), 'utf8')
          const title = body.match(/^#\s+(.+)$/m)?.[1] ?? slug
          return { slug, title }
        }),
      )
      return text(JSON.stringify(items, null, 2))
    } catch (err) {
      return fail(`Failed to list articles: ${(err as Error).message}`)
    }
  },
)

server.registerTool(
  'read_article',
  {
    title: 'Read an article',
    description: 'Return the raw MDX source for one article, by slug.',
    inputSchema: { slug: z.string().describe('Article slug, e.g. "what-is-riichi"') },
  },
  async ({ slug }) => {
    if (!/^[a-z0-9-]+$/.test(slug)) return fail(`Invalid slug: ${slug}`)
    try {
      const body = await readFile(join(CONTENT_DIR, `${slug}.mdx`), 'utf8')
      return text(body)
    } catch {
      return fail(`No article found for slug "${slug}".`)
    }
  },
)

server.registerTool(
  'calculate_score',
  {
    title: 'Calculate riichi score',
    description:
      'Compute riichi payouts for a hand from its han and fu, using the same scoring module as the app. ' +
      'Returns dealer/non-dealer ron and tsumo values.',
    inputSchema: {
      han: z.number().int().min(1).max(13).describe('Han (1–13)'),
      fu: z.number().int().min(20).max(110).describe('Fu (ignored at 5+ han)'),
    },
  },
  async ({ han, fu }) => text(JSON.stringify(scoreHand(han, fu), null, 2)),
)

const transport = new StdioServerTransport()
await server.connect(transport)
// stderr is safe for logs; stdout is reserved for the JSON-RPC protocol.
console.error(`yakupalace-mcp ready (site: ${SITE_URL})`)
