# Yaku Palace

A riichi mahjong learning toolkit. It's a React single-page app that is
**prerendered to static HTML at build time** — every route ships real content in
its initial HTML, then hydrates into the usual client-side SPA. There's no
backend API or database; the production process just serves static files and
handles canonical redirects.

## Features

| Feature                  | Where                          |
| ------------------------ | ------------------------------ |
| Scoring calculator       | `src/features/calculator/`     |
| Memorization articles    | `src/features/memorization/`   |
| Blog                     | `src/features/blog/`           |
| Yaku glossary (MDX)      | `src/features/memorization/content/yaku-glossary.mdx` |
| Table builder → PDF      | `src/features/table/` (route currently disabled) |

Articles and blog posts are authored in **MDX** and registered in small data
modules; each one gets its own route and is prerendered automatically.

## Stack

- **Vite 6** + **React 19** + **TypeScript**
- **React Router 7** — data router on the client, static handler for prerender
- **MDX** for articles and posts
- **Tailwind CSS v4** for styling
- **@react-pdf/renderer** for PDF export (table builder)
- **Express** (`server.mjs`) for static serving + canonical redirects in prod

## Develop

```bash
npm install
npm run dev        # Vite dev server (client-only, no prerender)
npm run build      # full production build: client + server + prerender
npm run build:spa  # escape hatch: plain client SPA build, no prerender
npm start          # serve the built dist/ via server.mjs
npm run typecheck  # type-check only
npm run lint       # eslint
```

## How rendering works (build-time prerendering / SSG)

The app is **not** server-rendered at runtime. Instead, every route is rendered
to a static `index.html` once, at build time. `npm run build` runs three steps:

1. **`build:client`** (`vite build`) — bundles the app from `index.html` →
   `src/entry-client.tsx` into hashed JS/CSS, and leaves an `index.html`
   template containing `<!--app-head-->` and `<!--app-html-->` markers.
2. **`build:server`** (`vite build --ssr src/entry-server.tsx`) — bundles a
   Node-side `render(path, siteUrl)` that turns a route into an HTML string.
   It uses React Router 7's static handler
   (`createStaticHandler` → `createStaticRouter` → `StaticRouterProvider`
   with `renderToString`). *We roll our own instead of a prebuilt SSG plugin
   because `vite-react-ssg` imports `react-router-dom/server`, which RR7
   removed.*
3. **`prerender`** (`scripts/prerender.mjs`) — for every route (from
   `getRoutePaths()`), calls `render()`, injects the app HTML and the per-route
   `<head>` into the client template, and writes `dist/<route>/index.html`
   (plus `dist/404.html`). The intermediate server bundle is then deleted.

On the client, `src/entry-client.tsx` calls `hydrateRoot` with
`createBrowserRouter(routes)`, which picks up the hydration data the static
render embedded, so the prerendered markup lights up as a normal SPA.

Things to know when editing:

- **`src/routes.tsx`** is the single route tree, shared by the browser router
  (`router.tsx`) and the prerender's static handler — keep rendering logic
  route-driven so both produce identical markup.
- **MDX is imported eagerly** (`{ eager: true }`), not via `lazy()`, because
  `renderToString` doesn't await `<Suspense>`. `table-builder.mdx` is excluded
  from the article glob so its browser-only `@react-pdf/renderer` dependency
  never loads during the server render.
- Don't reach for `window`/`document` during render — only in effects. The
  prerender runs in Node with no DOM.

## SEO

- **Per-route `<head>`** — title, description, canonical, Open Graph / Twitter
  tags, and JSON-LD are built in `src/entry-server.tsx` from
  `src/features/seo/pageMeta.ts` (copy) and `src/features/seo/structuredData.ts`
  (schema.org: `Article`/`BlogPosting`, `BreadcrumbList`, `WebSite`,
  `DefinedTermSet` for the glossary).
- **`sitemap.xml`, `robots.txt`, `rss.xml`** are emitted at build by a small
  Vite plugin in `vite.config.ts`, driven by the same route list
  (`src/features/seo/routePaths.ts`) as the prerender, so they can't drift.
- **`SITE_URL`** (env var, no trailing slash) supplies the absolute origin for
  canonical/OG/sitemap URLs. It defaults to the Heroku app URL; set it to the
  canonical domain in production (`heroku config:set SITE_URL=https://…`).

## Serving & deploy

`npm start` runs **`server.mjs`**, a small Express server that:

- serves `dist/` with clean URLs (a request for `/learn/foo` resolves to
  `dist/learn/foo/index.html`) and returns `dist/404.html` for unknown paths;
- **301-redirects** `www.` → apex and `http` → `https` (the scheme comes from
  `x-forwarded-proto`, so localhost is unaffected).

Deployed on Heroku: `git push heroku main`. The Node buildpack runs
`npm run build` and then `npm start`.

## Project layout

```
src/
  components/     Layout, NavBar, Breadcrumbs, RouteMeta, MdxLink
  pages/          one component per route
  features/
    calculator/   score calculator + scoring logic
    memorization/ MDX articles + registry (articles.ts, articles.data.ts)
    blog/         MDX posts + registry (posts.ts, posts.data.ts)
    table/         editable table + PDF document
    seo/          pageMeta, structuredData, routePaths
  routes.tsx      shared route tree (browser router + prerender)
  router.tsx      createBrowserRouter(routes)
  entry-client.tsx  hydrateRoot (client entry)
  entry-server.tsx  render(path, siteUrl) (prerender entry)
  index.css       Tailwind entry + theme tokens
scripts/
  prerender.mjs   writes dist/<route>/index.html + 404.html
server.mjs        Express static server + canonical redirects
vite.config.ts    MDX/React/Tailwind plugins + sitemap/robots/rss emitter
```

## Adding an article or post

1. Create the MDX file:
   - article → `src/features/memorization/content/<slug>.mdx`
   - blog post → `src/features/blog/content/<slug>.mdx`
2. Add a matching entry to the registry data module
   (`articles.data.ts` or `posts.data.ts`) — `slug` must match the filename.
   Set `title`, `description` (short tagline for the list UI), `date`, and
   optionally `seoDescription` (longer ~140–160-char copy for `<meta>`/social).

That's it: the route, prerendered page, `<head>` meta, sitemap entry (and RSS
item, for posts) are all generated from the registry.

## Credits

Favicon: [Mahjong icons created by Kason Koo — Flaticon](https://www.flaticon.com/free-icons/mahjong)
(recolored to the site's teal and traced to SVG).

Tile artwork: [tile-art by WarL0ckNet](https://github.com/WarL0ckNet/tile-art),
licensed **GPL-3.0**. Vendored into `public/tiles/` — see
[`public/tiles/CREDITS.md`](public/tiles/CREDITS.md) for details.
