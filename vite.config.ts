import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import tailwindcss from '@tailwindcss/vite'

// MDX must be registered before the React plugin (enforce: 'pre') so that
// .mdx files are transformed to JSX before React's Fast Refresh runs.
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      // providerImportSource lets <MDXProvider> inject element overrides (e.g.
      // routing-aware links) into compiled MDX — see src/components/MdxLink.tsx.
      ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: '@mdx-js/react' }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
})
