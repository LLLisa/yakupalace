import { Link } from 'react-router-dom'
import { POSTS } from '../features/blog/posts'

export function BlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Blog</h1>
      <ul className="space-y-3">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className="block rounded-lg border-2 border-header bg-card p-4 hover:border-brand transition"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-semibold">{post.title}</h2>
                <time className="text-xs text-faint" dateTime={post.date}>
                  {post.date}
                </time>
              </div>
              <p className="mt-1 text-sm text-muted">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
