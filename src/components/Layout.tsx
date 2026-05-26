import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar, BottomTabs } from './NavBar'

export function Layout() {
  return (
    // App-shell: exactly the dynamic viewport height, and the page body itself
    // doesn't scroll — only <main> does. This keeps the mobile browser toolbar
    // (and the safe-area inset) stable, so the bottom tab bar can't jump.
    <div className="h-dvh flex flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <TopBar />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto px-4 pt-4 pb-6 md:pt-6 md:pb-8">
          <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <BottomTabs />
    </div>
  )
}
