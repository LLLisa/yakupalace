import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { TableDocument } from './TableDocument'

const INITIAL_HEADERS = ['Column A', 'Column B']
const INITIAL_ROWS = [
  ['', ''],
  ['', ''],
]

export function EditableTable() {
  const [title, setTitle] = useState('My table')
  const [headers, setHeaders] = useState<string[]>(INITIAL_HEADERS)
  const [rows, setRows] = useState<string[][]>(INITIAL_ROWS)

  const setHeader = (col: number, value: string) =>
    setHeaders((prev) => prev.map((h, i) => (i === col ? value : h)))

  const setCell = (row: number, col: number, value: string) =>
    setRows((prev) =>
      prev.map((r, ri) =>
        ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r,
      ),
    )

  const addRow = () => setRows((prev) => [...prev, headers.map(() => '')])

  const addColumn = () => {
    setHeaders((prev) => [...prev, `Column ${String.fromCharCode(65 + prev.length)}`])
    setRows((prev) => prev.map((r) => [...r, '']))
  }

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Table title"
        className="text-xl font-semibold w-full rounded border border-slate-300 px-3 py-2"
      />

      {/* Edge-to-edge horizontal scroll on mobile for wide tables. */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="border-collapse">
          <thead>
            <tr>
              {headers.map((h, c) => (
                <th key={c} className="border border-slate-300 p-0">
                  <input
                    value={h}
                    onChange={(e) => setHeader(c, e.target.value)}
                    className="bg-slate-100 font-semibold px-3 py-2.5 w-40 text-base"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border border-slate-300 p-0">
                    <input
                      value={cell}
                      onChange={(e) => setCell(r, c, e.target.value)}
                      className="px-3 py-2.5 w-40 text-base"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={addRow}
          className="rounded border border-slate-300 bg-white px-4 min-h-11 text-sm hover:bg-slate-50 w-full sm:w-auto"
        >
          + Add row
        </button>
        <button
          type="button"
          onClick={addColumn}
          className="rounded border border-slate-300 bg-white px-4 min-h-11 text-sm hover:bg-slate-50 w-full sm:w-auto"
        >
          + Add column
        </button>
        <PDFDownloadLink
          document={<TableDocument title={title} headers={headers} rows={rows} />}
          fileName={`${title || 'table'}.pdf`}
          className="rounded bg-brand text-brand-fg px-4 min-h-11 flex items-center justify-center text-sm font-medium w-full sm:w-auto sm:ml-auto"
        >
          {({ loading }) => (loading ? 'Preparing…' : 'Download PDF')}
        </PDFDownloadLink>
      </div>
    </div>
  )
}
