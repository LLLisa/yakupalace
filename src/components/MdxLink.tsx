import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

/**
 * Replacement for the `<a>` element inside MDX articles (wired up via
 * <MDXProvider> in ArticlePage). Internal path links — those starting with
 * "/", optionally with a #hash — route client-side through React Router, so
 * jumping to a glossary entry is instant and doesn't reload the page. Hash-only
 * links (in-page anchors) and external/protocol links fall back to a plain
 * anchor with the original behavior.
 */
export function MdxLink({
  href = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) {
    return <Link to={href} {...props} />
  }
  return <a href={href} {...props} />
}
