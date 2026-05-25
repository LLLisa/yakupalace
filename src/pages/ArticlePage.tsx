import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getArticleComponent,
  getArticleMeta,
} from '../features/articles/articles'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const Article = getArticleComponent(slug)
  const meta = getArticleMeta(slug)

  if (!Article) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">That article doesn't exist.</p>
        <Link to="/articles" className="text-brand underline">
          ← Back to articles
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6">
      <Link to="/articles" className="text-sm text-brand underline">
        ← All articles
      </Link>
      {meta && (
        <time className="block text-xs text-slate-400" dateTime={meta.date}>
          {meta.date}
        </time>
      )}
      <div className="prose-article max-w-prose">
        <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
          <Article />
        </Suspense>
      </div>
    </article>
  )
}
