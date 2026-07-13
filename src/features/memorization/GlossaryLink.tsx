import {
  useCallback,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

interface TipPos {
  left: number
  top: number
  placement: 'above' | 'below'
}

interface GlossaryLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  definition: string
}

/**
 * An internal glossary link that reveals a brief definition on hover/focus.
 *
 * The tooltip is rendered through a portal to <body> and positioned with
 * `position: fixed` from the link's viewport rect, so it escapes the scrolling
 * <main> and its `overflow` clipping (a plain CSS/absolute tooltip would be cut
 * off or trigger a scrollbar inside the article column).
 */
export function GlossaryLink({
  href,
  definition,
  children,
  ...props
}: GlossaryLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState<TipPos | null>(null)
  const tipId = useId()

  const show = useCallback(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    // Clamp the horizontal center so a max-width (16rem = 256px) box, centered
    // via translateX(-50%), always stays within an 8px viewport margin.
    const half = Math.min(128, (vw - 16) / 2)
    const left = Math.min(Math.max(r.left + r.width / 2, 8 + half), vw - 8 - half)
    // Prefer above; flip below when the link sits near the top of the viewport.
    const placement: TipPos['placement'] = r.top < 140 ? 'below' : 'above'
    const top = placement === 'above' ? r.top - 8 : r.bottom + 8
    setPos({ left, top, placement })
  }, [])

  const hide = useCallback(() => setPos(null), [])

  return (
    <>
      <Link
        ref={ref}
        to={href}
        aria-describedby={pos ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        {children}
      </Link>
      {pos &&
        createPortal(
          <span
            id={tipId}
            role="tooltip"
            className="pointer-events-none fixed z-50 max-w-[min(16rem,calc(100vw-1rem))] rounded-lg border border-border bg-card px-3 py-2 text-sm leading-snug text-ink shadow-lg"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `translate(-50%, ${
                pos.placement === 'above' ? '-100%' : '0'
              })`,
            }}
          >
            {definition}
          </span>,
          document.body,
        )}
    </>
  )
}
