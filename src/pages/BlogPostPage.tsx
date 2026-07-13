import { Suspense } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Link, useParams } from 'react-router-dom'
import { getPostComponent, getPostMeta } from '../features/blog/posts'
import { MdxLink } from '../components/MdxLink'

// Element overrides injected into every MDX post. Defined at module scope so
// the object identity is stable across renders.
const mdxComponents = { a: MdxLink }

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const Post = getPostComponent(slug)
  const meta = getPostMeta(slug)

  if (!Post) {
    return (
      <div className="space-y-4">
        <p className="text-muted">That post doesn't exist.</p>
        <Link to="/blog" className="text-brand underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <article className="space-y-6">
      <Link to="/blog" className="text-sm text-brand underline">
        ← Blog
      </Link>
      {meta && (
        <time className="block text-xs text-faint" dateTime={meta.date}>
          {meta.date}
        </time>
      )}
      <div className="prose-article max-w-prose">
        <MDXProvider components={mdxComponents}>
          <Suspense fallback={<p className="text-faint">Loading…</p>}>
            {/* Post is a stable module-level lazy() component looked up by
                slug (see posts.ts), not created during render. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Post />
          </Suspense>
        </MDXProvider>
      </div>
    </article>
  )
}
