import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getArticleComponent,
  getArticleMeta,
} from '../features/memorization/memorization'

export function ArticlePage() {
  const { slug = '' } = useParams()
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
        <Suspense fallback={<p className="text-faint">Loading…</p>}>
          {/* Article is a stable module-level lazy() component looked up by
              slug (see articles.ts), not created during render. */}
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Article />
        </Suspense>
      </div>
    </article>
  )
}
