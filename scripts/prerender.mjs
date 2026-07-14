// Post-build prerender: injects statically rendered HTML + per-route <head>
// into the client build's index.html template, one file per route. Runs after
// `vite build` (client) and `vite build --ssr` (server); see package.json.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const serverDir = resolve(distDir, 'server')

// Same default + override as the sitemap generator (vite.config.ts), so
// canonical/OG URLs match the sitemap. No trailing slash.
const SITE_URL = (
  process.env.SITE_URL ?? 'https://yakupalace-b4e6516422db.herokuapp.com'
).replace(/\/$/, '')

const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8')

const { render, getRoutePaths } = await import(
  pathToFileURL(resolve(serverDir, 'entry-server.js')).href
)

const paths = getRoutePaths()
for (const path of paths) {
  const { html, head } = await render(path, SITE_URL)
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)

  // "/" -> dist/index.html ; "/learn/foo" -> dist/learn/foo/index.html
  const outFile =
    path === '/'
      ? resolve(distDir, 'index.html')
      : resolve(distDir, path.replace(/^\//, ''), 'index.html')

  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, page)
  console.log('  prerendered', path)
}

// 404 page for unknown URLs. `serve` returns dist/404.html (with a 404 status)
// when no file matches; rendering the catch-all route gives it the real styled
// NotFound page, which then hydrates into the SPA.
const notFound = await render('/404', SITE_URL)
writeFileSync(
  resolve(distDir, '404.html'),
  template
    .replace('<!--app-head-->', notFound.head)
    .replace('<!--app-html-->', notFound.html),
)
console.log('  prerendered 404.html')

// The server bundle is a build artifact, not something to ship.
rmSync(serverDir, { recursive: true, force: true })

console.log(`\n✓ prerendered ${paths.length} routes + 404 to dist/`)
