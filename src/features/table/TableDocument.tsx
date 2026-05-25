import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

export interface TableData {
  title: string
  headers: string[]
  rows: string[][]
}

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 18, marginBottom: 16, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row' },
  headerCell: {
    flex: 1,
    padding: 6,
    backgroundColor: '#0f766e',
    color: '#ffffff',
    border: '1px solid #0f766e',
    fontFamily: 'Helvetica-Bold',
  },
  cell: {
    flex: 1,
    padding: 6,
    border: '1px solid #cbd5e1',
  },
})

/** Renders the user's table as a clean, text-based PDF. */
export function TableDocument({ title, headers, rows }: TableData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View>
          <View style={styles.row}>
            {headers.map((h, i) => (
              <Text key={i} style={styles.headerCell}>
                {h}
              </Text>
            ))}
          </View>
          {rows.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c) => (
                <Text key={c} style={styles.cell}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
