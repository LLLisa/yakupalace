import { Suspense, useEffect } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  getArticleComponent,
  getArticleMeta,
} from '../features/memorization/articles'
import { MdxLink } from '../components/MdxLink'

// Element overrides injected into every MDX article. Defined at module scope so
// the object identity is stable across renders.
const mdxComponents = { a: MdxLink }

/**
 * Scrolls a `#hash` target into view once the (lazy-loaded) article has
 * mounted, then briefly flashes it so the eye lands on it. Rendered *inside*
 * the article's Suspense boundary so its effect runs only after the content —
 * and therefore the anchor element — exists. Plain `element.scrollIntoView` is
 * essential here: the app scrolls an inner <main>, not the window, so the
 * browser's native fragment scroll is a no-op.
 */
function ScrollToHash({ hash }: { hash: string }) {
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    // Defer to after paint so layout is settled before we measure.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Highlight the whole entry. closest('section') covers the combined
      // four-winds entry, whose #anchors are empty spans inside the section.
      const target = (el.closest('section') ?? el) as HTMLElement
      target.classList.remove('flash-highlight')
      void target.offsetWidth // reflow so the animation restarts on re-navigation
      target.classList.add('flash-highlight')
      target.addEventListener(
        'animationend',
        () => target.classList.remove('flash-highlight'),
        { once: true },
      )
    })
    return () => cancelAnimationFrame(raf)
  }, [hash])
  return null
}

export function ArticlePage() {
  const { slug = '' } = useParams()
  const { hash } = useLocation()
  const Article = getArticleComponent(slug)
  const meta = getArticleMeta(slug)

  if (!Article) {
    return (
      <div className="space-y-4">
        <p className="text-muted">That article doesn't exist.</p>
        <Link to="/learn" className="text-brand underline">
          ← Back to Learn Riichi Scoring
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6">
      <Link to="/learn" className="text-sm text-brand underline">
        ← Learn Riichi Scoring
      </Link>
      {meta && (
        <time className="block text-xs text-faint" dateTime={meta.date}>
          {meta.date}
        </time>
      )}
      <div className="prose-article max-w-prose">
        <MDXProvider components={mdxComponents}>
          <Suspense fallback={<p className="text-faint">Loading…</p>}>
            {/* Article is a stable module-level lazy() component looked up by
                slug (see articles.ts), not created during render. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Article />
            <ScrollToHash hash={hash} />
          </Suspense>
        </MDXProvider>
      </div>
    </article>
  )
}
