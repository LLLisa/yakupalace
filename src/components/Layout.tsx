import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <NavBar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
        <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>
      {/* Extra bottom space on mobile so content clears the fixed tab bar. */}
    </div>
  )
}
