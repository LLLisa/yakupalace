# yakupalace-mcp

A small [MCP](https://modelcontextprotocol.io) server (stdio transport) that
exposes tools over the deployed site and the local project data.

## Tools

| Tool              | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `fetch_page`      | GET a path on `yakupalace.com` and return the response text.        |
| `list_articles`   | List articles (slug + title) from the local MDX content.            |
| `read_article`    | Return the raw MDX source for one article, by slug.                 |
| `calculate_score` | Riichi payouts from han/fu, reusing the app's `scoring.ts` module.  |

> **Note:** `yakupalace.com` is a client-rendered SPA, so `fetch_page` returns
> the app shell HTML, not rendered article text. Use `list_articles` /
> `read_article` for article content.

## Run

```bash
cd mcp
npm install
npm start          # launches the stdio server (waits for a client)
npm run dev        # same, with file-watch reload
```

It runs the TypeScript directly via `tsx` — no build step. The scoring tool
imports `../src/features/calculator/scoring.ts`, so there's a single source of
truth for the scoring rules.

`SITE_URL` overrides the target site (defaults to `https://yakupalace.com`),
e.g. `SITE_URL=http://localhost:3000 npm start` to point at a local build.

## Use from Claude Code

The repo's root `.mcp.json` already registers this server (project scope):

```json
{
  "mcpServers": {
    "yakupalace": {
      "command": "mcp/node_modules/.bin/tsx",
      "args": ["mcp/src/index.ts"],
      "env": { "SITE_URL": "https://yakupalace.com" }
    }
  }
}
```

Paths are relative to the project root (where Claude Code launches the server).
Verify with `claude mcp list` — it should report `yakupalace … ✓ Connected`.
