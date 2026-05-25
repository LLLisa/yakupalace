import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/calculator',
    title: 'Scoring calculator',
    body: 'Work out the points for a finished hand.',
  },
  {
    to: '/articles',
    title: 'Articles',
    body: 'Short reads about the game and these tools.',
  },
  {
    to: '/table',
    title: 'Table builder',
    body: 'Fill in your own table and export it as a PDF.',
  },
]

export function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Yaku Palace</h1>
        <p className="mt-2 text-slate-600 max-w-prose">
          A lightweight, frontend-only riichi toolkit. Everything runs in your
          browser — no account, no server.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-brand hover:shadow-sm transition"
          >
            <h2 className="font-semibold text-lg">{card.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
