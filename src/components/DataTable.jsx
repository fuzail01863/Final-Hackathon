import EmptyState from './EmptyState'

export default function DataTable({ columns, rows = [], emptyTitle, emptyDescription }) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle || 'No records to show'} description={emptyDescription || 'Records will appear here after backend integration.'} />
  }
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((column) => <td key={column}>{row[column] ?? '—'}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
