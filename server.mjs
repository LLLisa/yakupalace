import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), 'dist')
const PORT = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

// Canonicalize host/scheme with a 301: www -> apex, and http -> https,
// preserving path + query. Behind Heroku's router the original scheme is in
// x-forwarded-proto; when that header is absent (local dev) the https upgrade is
// skipped so localhost keeps working.
app.use((req, res, next) => {
  const host = req.headers.host ?? ''
  const isWww = host.startsWith('www.')
  const isInsecure = req.headers['x-forwarded-proto'] === 'http'
  if (isWww || isInsecure) {
    const targetHost = isWww ? host.slice(4) : host
    return res.redirect(301, `https://${targetHost}${req.originalUrl}`)
  }
  next()
})

// Real files: hashed assets, images, favicon, sitemap.xml, robots.txt.
app.use(express.static(distDir, { index: false, redirect: false, maxAge: '1h' }))

// Clean-URL routes -> the prerendered nested index.html; unknown -> 404.html.
app.use((req, res) => {
  const rel =
    req.path === '/' ? 'index.html' : join(req.path.replace(/^\/+/, ''), 'index.html')
  const file = resolve(distDir, rel)
  if (file.startsWith(distDir) && existsSync(file)) {
    res.set('Cache-Control', 'no-cache')
    res.sendFile(file)
  } else {
    res.status(404).set('Cache-Control', 'no-cache').sendFile(resolve(distDir, '404.html'))
  }
})

app.listen(PORT, () => console.log(`Yaku Palace serving dist/ on :${PORT}`))
