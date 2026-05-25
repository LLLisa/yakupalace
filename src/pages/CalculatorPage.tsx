export function CalculatorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Scoring calculator</h1>
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        <p className="font-medium text-slate-700">Calculator goes here.</p>
        <p className="mt-1 text-sm">
          Build the scoring UI and logic in a{' '}
          <code className="rounded bg-slate-100 px-1">src/features/calculator/</code>{' '}
          module and render it on this page.
        </p>
      </div>
    </div>
  )
}
