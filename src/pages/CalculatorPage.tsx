import { ScoreCalculator } from '../features/calculator/ScoreCalculator'

export function CalculatorPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-center">Scoring calculator</h1>
      <ScoreCalculator />
    </div>
  )
}
