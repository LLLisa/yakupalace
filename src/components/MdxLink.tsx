import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { YAKU_DEFINITIONS } from '../features/memorization/yakuDefinitions'
import { GlossaryLink } from '../features/memorization/GlossaryLink'

// Matches a deep link into the yaku glossary, capturing the entry's anchor id.
const GLOSSARY_HASH = /^\/learn\/yaku-glossary#(.+)$/

/**
 * Replacement for the `<a>` element inside MDX articles (wired up via
 * <MDXProvider> in ArticlePage). Internal path links — those starting with
 * "/", optionally with a #hash — route client-side through React Router, so
 * jumping to a glossary entry is instant and doesn't reload the page. Links
 * into the yaku glossary additionally get a hover tooltip with a brief
 * definition when the anchor id has one. Hash-only links (in-page anchors) and
 * external/protocol links fall back to a plain anchor with the original
 * behavior.
 */
export function MdxLink({
  href = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const glossaryMatch = href.match(GLOSSARY_HASH)
  if (glossaryMatch) {
    const definition = YAKU_DEFINITIONS[decodeURIComponent(glossaryMatch[1])]
    if (definition) {
      return <GlossaryLink href={href} definition={definition} {...props} />
    }
  }
  if (href.startsWith('/')) {
    return <Link to={href} {...props} />
  }
  return <a href={href} {...props} />
}
