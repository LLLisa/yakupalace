import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/blog',
    title: 'Blog',
    body: 'News and notes from the Palace.',
  },
  {
    to: '/learn',
    title: 'Learn Riichi Scoring',
    body: 'Short reads about the game and these tools.',
  },
  {
    to: '/calculator',
    title: 'Scoring calculator',
    body: 'Work out the points for a finished hand.',
  },
]

export function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold">Yaku Palace</h1>
        <p className="mt-2 text-muted max-w-prose mx-auto">
          A system for memorizing riichi mahjong yaku and scoring
        </p>
      </section>

      <div className="grid gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="block rounded-lg border-2 border-header bg-card p-5 hover:border-brand hover:shadow-sm transition"
          >
            <h2 className="font-semibold text-lg">{card.title}</h2>
            <p className="mt-1 text-sm text-muted">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
