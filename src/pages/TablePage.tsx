import { EditableTable } from '../features/table/EditableTable'

export function TablePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Table builder</h1>
        <p className="mt-1 text-slate-600">
          Fill in your own values, then export the table as a PDF.
        </p>
      </div>
      <EditableTable />
    </div>
  )
}
