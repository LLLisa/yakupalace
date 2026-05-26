import { EditableTable } from '../features/table/EditableTable'

export function TablePage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Table builder</h1>
        <p className="mt-1 text-muted">
          Fill in your own values, then export the table as a PDF.
        </p>
      </div>
      <EditableTable />
    </div>
  )
}
