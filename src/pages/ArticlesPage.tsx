import { Link } from 'react-router-dom'
import { ARTICLES } from '../features/articles/articles'

export function ArticlesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Articles</h1>
      <ul className="space-y-3">
        {ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/articles/${article.slug}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-brand transition"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-semibold">{article.title}</h2>
                <time className="text-xs text-slate-400" dateTime={article.date}>
                  {article.date}
                </time>
              </div>
              <p className="mt-1 text-sm text-slate-600">{article.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
