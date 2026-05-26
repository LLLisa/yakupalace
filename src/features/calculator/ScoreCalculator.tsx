import { useState } from 'react'
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
        <div className="-my-3 flex items-center gap-3 text-ink">
          <span className="h-px flex-1 bg-header" />
          <span className="text-2xl font-bold">{LIMIT_LABELS[score.limit]}</span>
          <span className="h-px flex-1 bg-header" />
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
