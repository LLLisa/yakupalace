import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar, BottomTabs } from './NavBar'

export function Layout() {
  // Sync --app-height to the real visible viewport. CSS dvh would be simpler,
  // but Firefox for Android reports it short of the actual viewport, leaving a
  // gap below the bottom navbar. window.innerHeight is reported correctly.
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    setAppHeight()
    window.addEventListener('resize', setAppHeight)
    return () => window.removeEventListener('resize', setAppHeight)
  }, [])

  return (
    // App-shell: exactly the visible viewport height (see --app-height above),
    // and the page body itself doesn't scroll — only <main> does. This keeps the
    // mobile browser toolbar (and the safe-area inset) stable, so the bottom tab
    // bar can't jump.
    <div className="h-[var(--app-height)] flex flex-col overflow-hidden bg-surface text-ink font-sans">
      <TopBar />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto px-4 pt-4 pb-6 md:pt-6 md:pb-8">
          <Suspense fallback={<p className="text-faint">Loading…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <BottomTabs />
    </div>
  )
}
