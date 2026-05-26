import { useState } from 'react'
import {
  FU_OPTIONS,
  HAN_OPTIONS,
  LIMIT_LABELS,
  scoreHand,
} from './scoring'

export function ScoreCalculator() {
  const [han, setHan] = useState(3)
  const [fu, setFu] = useState(30)

  // Derived on every render — scores update live as the selects change.
  const score = scoreHand(han, fu)

  return (
    <div className="space-y-6">
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

        {/* Fu is only meaningful below a limit. At 5+ han the limit name
            takes the same cell, but borderless and label-less so it reads as
            a result, not an input. The row height is fixed by the Han field,
            so swapping these does not shift the layout. */}
        {score.limit ? (
          // Blank label spacer + a min-h-11 box mirror the fu field exactly,
          // so the name lands where the fu number sits — no vertical offset.
          <Field label={' '}>
            <div className="min-h-11 flex items-center px-3 text-2xl font-bold text-brand">
              {LIMIT_LABELS[score.limit]}
            </div>
          </Field>
        ) : (
          <Field label="Fu">
            <select
              value={fu}
              onChange={(e) => setFu(Number(e.target.value))}
              className={selectClass}
            >
              {FU_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} fu
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

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

// Shared so the fu select and the limit-name box are pixel-identical boxes.
const selectClass =
  'w-full rounded border border-slate-300 px-3 min-h-11 text-base bg-white'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  )
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <dl className="mt-3 space-y-3">{children}</dl>
    </div>
  )
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-slate-600">{label}</dt>
      <dd className="text-right">
        <span className="text-xl font-semibold tabular-nums">{value}</span>
        {note && <span className="block text-xs text-slate-400">{note}</span>}
      </dd>
    </div>
  )
}
