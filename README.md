# Yaku Palace

A lightweight, **frontend-only** riichi mahjong toolkit. Everything runs in the
browser — no backend.

## Features

| Feature              | Status      | Where                                    |
| -------------------- | ----------- | ---------------------------------------- |
| Scoring calculator   | Placeholder | `src/pages/CalculatorPage.tsx`           |
| Memorization (MDX)   | Scaffolded  | `src/features/memorization/`             |
| Table builder → PDF  | Skeleton    | `src/features/table/`                    |

The calculator page is an intentional placeholder — drop your scoring UI and
logic into a `src/features/calculator/` module and render it on that page.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router** for client-side routing
- **MDX** for memorization pages (write `.mdx` in `src/features/memorization/content/`)
- **Tailwind CSS v4** for styling
- **@react-pdf/renderer** for PDF export

## Develop

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check and build for production
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

## Project layout

```
src/
  components/   shared layout + nav
  pages/        one component per route
  features/
    memorization/ MDX content + registry
    table/       editable table + PDF document
  router.tsx    route definitions
  index.css     Tailwind entry + theme tokens
```

## Adding an article

1. Create `src/features/memorization/content/<slug>.mdx`.
2. Add a matching entry to `ARTICLES` in `src/features/memorization/memorization.ts`.

The article then appears on the index and gets its own route automatically.

## Credits

Favicon: [Mahjong icons created by Kason Koo — Flaticon](https://www.flaticon.com/free-icons/mahjong)
(recolored to the site's teal and traced to SVG).

Tile artwork: [tile-art by WarL0ckNet](https://github.com/WarL0ckNet/tile-art),
licensed **GPL-3.0**. Vendored into `public/tiles/` — see
[`public/tiles/CREDITS.md`](public/tiles/CREDITS.md) for details.
