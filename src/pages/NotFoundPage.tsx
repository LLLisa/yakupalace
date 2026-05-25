import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-16 space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-600">This page isn't part of the palace.</p>
      <Link to="/" className="text-brand underline">
        Go home
      </Link>
    </div>
  )
}
