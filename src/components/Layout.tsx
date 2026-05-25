import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <NavBar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Yaku Palace — a frontend-only riichi toolkit.
      </footer>
    </div>
  )
}
