import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  /** Omit on the current (last) crumb so it renders as plain text. */
  to?: string
}

/**
 * Visible breadcrumb trail for content pages. Mirrors the BreadcrumbList JSON-LD
 * emitted at prerender time (see structuredData.ts) and improves internal
 * linking back to the section indexes.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <Fragment key={i}>
            <li>
              {c.to ? (
                <Link to={c.to} className="text-brand hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-muted">
                  {c.label}
                </span>
              )}
            </li>
            {i < items.length - 1 && (
              <li aria-hidden="true" className="select-none">
                ›
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
