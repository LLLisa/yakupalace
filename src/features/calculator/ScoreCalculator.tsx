import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FU_OPTIONS,
  HAN_OPTIONS,
  LIMIT_LABELS,
  scoreHand,
} from './scoring'

export function ScoreCalculator() {
  const [han, setHan] = useState(1)
  const [fu, setFu] = useState(30)

  // Derived on every render — scores update live as the selects change.
  const score = scoreHand(han, fu)

  // Fire the yakuman tile burst once each time the hand crosses into yakuman.
  // burstId both gates rendering and keys the burst so it remounts (replays).
  const [burstId, setBurstId] = useState(0)
  const wasYakuman = useRef(false)
  useEffect(() => {
    const isYakuman = score.limit === 'yakuman'
    if (isYakuman && !wasYakuman.current) setBurstId((n) => n + 1)
    wasYakuman.current = isYakuman
  }, [score.limit])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Han">
          <select
            value={han}
            onChange={(e) => setHan(Number(e.target.value))}
            className={selectClass}
          >
            {HAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Fu">
          {/* Grey out (never disable) fu that don't affect the score, so the
              user can still select anything: all fu at 5+ han, 70+ fu at 3
              han, 40+ fu at 4 han. */}
          <select
            value={fu}
            onChange={(e) => setFu(Number(e.target.value))}
            className={`${selectClass} transition-opacity ${
              fuGreyed(han, fu) ? 'opacity-40' : ''
            }`}
          >
            {FU_OPTIONS.map((opt) => (
              <option
                key={opt}
                value={opt}
                style={fuGreyed(han, opt) ? { color: '#94a3b8' } : undefined}
              >
                {opt} fu
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* At 5+ han fu is ignored; the limit name shows beneath the inputs. */}
      {score.limit && (
        <div className="relative -my-3 flex items-center gap-3 text-ink">
          <span className="h-px flex-1 bg-header" />
          <span
            className={`text-2xl font-bold ${
              score.limit === 'yakuman' ? 'rainbow-text' : ''
            }`}
          >
            {LIMIT_LABELS[score.limit]}
          </span>
          <span className="h-px flex-1 bg-header" />
          {score.limit === 'yakuman' && burstId > 0 && (
            <YakumanBurst key={burstId} seed={burstId} />
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultCard title="Non-dealer (ko)">
          <Row label="Ron" value={score.nonDealerRon.toLocaleString()} />
          <Row
            label="Tsumo"
            value={`${score.nonDealerTsumo.fromEachNonDealer.toLocaleString()} / ${score.nonDealerTsumo.fromDealer.toLocaleString()}`}
            note={`${score.nonDealerTsumo.total.toLocaleString()} total · dealer pays the larger`}
          />
        </ResultCard>

        <ResultCard title="Dealer (oya)">
          <Row label="Ron" value={score.dealerRon.toLocaleString()} />
          <Row
            label="Tsumo"
            value={`${score.dealerTsumo.fromEach.toLocaleString()} all`}
            note={`${score.dealerTsumo.total.toLocaleString()} total`}
          />
        </ResultCard>
      </div>
    </div>
  )
}

// A colorful spread of tiles (reds, greens, honors, and a mix of suits) for
// the yakuman burst, drawn from the vendored set in /public/tiles.
const BURST_TILES = [
  '1man', '9man', '5man', '2man', '8man',
  '1pin', '9pin', '6pin', '3pin', '7pin',
  '1sou', '9sou', '5sou', '3sou', '8sou',
  'chun', 'hatsu', 'haku', 'tan', 'nan',
]

interface BurstTile {
  name: string
  tx: number
  ty: number
  rot: number
  delay: number
  duration: number
}

/** Small deterministic PRNG so the burst can be built purely during render
 *  (Math.random() isn't allowed there) while still varying per burst. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildBurstTiles(seed: number): BurstTile[] {
  const rng = mulberry32(seed)
  return Array.from({ length: 28 }, () => {
    // Fan mostly upward; the keyframe then drops them under "gravity".
    const angle = -Math.PI / 2 + (rng() - 0.5) * Math.PI * 1.4
    const dist = 110 + rng() * 170
    return {
      name: BURST_TILES[Math.floor(rng() * BURST_TILES.length)],
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      rot: (rng() * 2 - 1) * 600,
      delay: rng() * 450,
      duration: 2200 + rng() * 1000,
    }
  })
}

/**
 * One-shot tile shower for a yakuman. Mounted (and re-keyed via `seed`) by the
 * parent so it replays on each entry into yakuman; particles fade out and the
 * component unmounts when the hand leaves yakuman. The tiles are hidden under
 * prefers-reduced-motion (see index.css).
 */
function YakumanBurst({ seed }: { seed: number }) {
  const tiles = useMemo(() => buildBurstTiles(seed), [seed])

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {tiles.map((t, i) => (
        <img
          key={i}
          src={`/tiles/${t.name}.svg`}
          alt=""
          className="yakuman-tile"
          style={
            {
              '--tx': `${t.tx}px`,
              '--ty': `${t.ty}px`,
              '--rot': `${t.rot}deg`,
              animationDelay: `${t.delay}ms`,
              animationDuration: `${t.duration}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

const selectClass =
  'w-full rounded border-2 border-header px-3 min-h-11 text-base bg-card'

// Fu that don't change the score — shown greyed, but still selectable.
function fuGreyed(han: number, fu: number) {
  return han >= 5 || (han === 4 && fu >= 40) || (han === 3 && fu >= 70)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1">{label}</span>
      {children}
    </label>
  )
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-2 border-header bg-card p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <dl className="mt-3 space-y-3">{children}</dl>
    </div>
  )
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">
        <span className="text-xl font-semibold tabular-nums">{value}</span>
        {note && <span className="block text-xs text-faint">{note}</span>}
      </dd>
    </div>
  )
}
