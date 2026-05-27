import type { ReactNode } from 'react'

/**
 * One glossary entry. The `id` is a stable anchor so other articles and
 * sections can deep-link to a yaku, e.g. `/learn/yaku-glossary#pinfu`.
 *
 *   <Yaku id="pinfu" name="Pinfu" en="All Sequences" jp="平和" han="— / 1">
 *     A valueless pair and a two-sided wait.
 *     <Tiles hand="234m 567m 234p 678s 99p" />
 *   </Yaku>
 *
 * `en` is a short English interpretation of the name, shown beside it.
 * `han` is written "open / closed" (an em dash means the yaku is closed-only).
 */
export interface YakuProps {
  id: string
  name: string
  en?: string
  jp?: string
  han: string
  children: ReactNode
}

export function Yaku({ id, name, en, jp, han, children }: YakuProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border pt-5 mt-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 id={`${id}-h`} className="!mt-0 !mb-0">
          <a href={`#${id}`} className="!text-ink !no-underline hover:!text-brand">
            {name}
          </a>
        </h3>
        {en && <span className="text-muted">{en}</span>}
        {jp && <span className="text-muted text-lg leading-none">{jp}</span>}
        <span className="text-xs text-ink border border-border rounded px-2 py-0.5 whitespace-nowrap">
          {han}
        </span>
      </div>
      {children}
    </section>
  )
}
