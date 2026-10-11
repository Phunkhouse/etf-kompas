import type { CSSProperties, ReactNode } from 'react'
import styles from './Table.module.scss'

export type TableColumn = {
  id: string
  header: string
  // CSS width of the column, for example '55%'. Keeps the table at three columns on a phone.
  width?: string
  // Tabular figures for numbers and amounts
  numeric?: boolean
}

export type TableRowData = {
  id: string
  // Cell content by column id. The first column is the row header.
  cells: Record<string, ReactNode>
  // The cheapest or recommended row
  highlight?: boolean
}

type TableProps = {
  caption: string
  columns: TableColumn[]
  rows: TableRowData[]
  // A bordered card on a surface background (the hero table)
  card?: boolean
  // The hero table intro (note 0016): the card fades in, the rows follow one by
  // one, then the highlighted row turns green. Off for prefers-reduced-motion.
  intro?: boolean
  // Phone layout that saves height (note 0031): denser rows, and the visible
  // caption is hidden below md (screen readers still read it).
  compact?: boolean
}

export function Table({
  caption,
  columns,
  rows,
  card,
  intro,
  compact,
}: TableProps) {
  const wrapClass = [
    styles.wrap,
    card ? styles.card : '',
    intro ? styles.intro : '',
    compact ? styles.compact : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={wrapClass}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: column.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={styles.head}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={`${styles.row} ${row.highlight ? styles.highlight : ''}`}
              data-highlight={row.highlight || undefined}
              style={{ '--row-index': rowIndex } as CSSProperties}
            >
              {columns.map((column, index) =>
                index === 0 ? (
                  <th key={column.id} scope="row" className={styles.rowHead}>
                    {row.cells[column.id]}
                  </th>
                ) : (
                  <td
                    key={column.id}
                    className={column.numeric ? styles.numeric : undefined}
                  >
                    {row.cells[column.id]}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type TableLabelProps = {
  title: string
  // technical name or ticker, shown smaller and muted under the title
  detail?: string
}

// First-column content: a bold plain name with an optional technical detail.
export function TableLabel({ title, detail }: TableLabelProps) {
  return (
    <>
      <strong className={styles.title}>{title}</strong>
      {detail ? <span className={styles.detail}>{detail}</span> : null}
    </>
  )
}
