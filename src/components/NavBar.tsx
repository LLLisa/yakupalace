import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'

type IconProps = SVGProps<SVGSVGElement>

interface NavItem {
  to: string
  label: string
  end?: boolean
  Icon: ComponentType<IconProps>
}

const items: NavItem[] = [
  { to: '/', label: 'Home', end: true, Icon: HomeIcon },
  { to: '/blog', label: 'Blog', Icon: PenIcon },
  { to: '/learn', label: 'Learn', Icon: BookIcon },
  { to: '/calculator', label: 'Score', Icon: CalcIcon },
]

/** Top app bar: brand always; inline links on desktop. */
export function TopBar() {
  return (
    <header className="bg-header text-header-fg">
      <div className="w-full max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg tracking-tight">
          雀 Yaku Palace
        </NavLink>
        <ul className="hidden md:flex gap-2 text-sm">
          {items.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-header-fg/15' : 'hover:bg-header-fg/10'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}

/**
 * Bottom tab bar (mobile only). Rendered as the last row of the app-shell
 * flex column — not `position: fixed` — so its height stays stable while the
 * main area scrolls. The safe-area padding clears the iOS home indicator,
 * but is capped at 0.75rem — Firefox for Android reports a large
 * safe-area-inset-bottom (for its own toolbar), which otherwise left a big
 * dead gap that Chrome doesn't have.
 */
export function BottomTabs() {
  return (
    <nav
      className="md:hidden border-t border-border bg-card pb-[min(env(safe-area-inset-bottom),0.75rem)]"
      aria-label="Primary"
    >
      <ul className="flex">
        {items.map(({ to, label, end, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2 text-xs min-h-14 transition-colors ${
                  isActive ? 'text-brand' : 'text-muted'
                }`
              }
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* Inline icons — 24px stroke icons, currentColor so they inherit tab state. */

function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function CalcIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h0M12 11h0M16 11h0M8 15h0M12 15h0M16 15v4" />
    </svg>
  )
}

function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19h14" />
    </svg>
  )
}

function PenIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}