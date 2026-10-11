import { Pill } from '@/components/Pill'
import {
  Table,
  TableLabel,
  type TableColumn,
  type TableRowData,
} from '@/components/Table'
import { copy } from '@/content/copy'
import { formatMonthYear, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import type { HeroRow } from '@/server/availability'
import styles from './HeroTable.module.scss'

type HeroTableProps = {
  rows: HeroRow[]
  // Oldest asOf among the numbers on the page (ISO date), or null.
  dataAsOf: string | null
}

const text = copy.hero.b.table
type RowCopyKey = keyof typeof text.rows

const columns: TableColumn[] = [
  { id: 'what', header: text.columns.what, width: '54%' },
  { id: 'fee', header: text.columns.fee, numeric: true, width: '22%' },
  { id: 'buyable', header: text.columns.buyable, width: '24%' },
]

function BuyableCell({ row }: { row: HeroRow }) {
  const { state, verifiedNoCount, total } = row.buyability
  if (state === 'yes') return <Pill tone="positive">{text.pill.yes}</Pill>
  if (state === 'no') return <Pill tone="negative">{text.pill.no}</Pill>
  return (
    <>
      <Pill tone="unverified">{text.pill.unverified}</Pill>
      {verifiedNoCount > 0 ? (
        <span className={styles.note}>
          {nbsp(text.verifiedNo(verifiedNoCount, total))}
        </span>
      ) : null}
    </>
  )
}

// The three-row table of the table-first hero: fee and "can you buy it from
// Czechia". The numbers come from the data, the wording from copy.ts.
export function HeroTable({ rows, dataAsOf }: HeroTableProps) {
  const tableRows: TableRowData[] = rows.map((row) => {
    const label = text.rows[row.fundId as RowCopyKey]
    return {
      id: row.fundId,
      highlight: row.highlight,
      cells: {
        what: (
          <TableLabel
            title={nbsp(label.plainName)}
            detail={nbsp(label.detail)}
          />
        ),
        fee: row.ter === null ? text.feeUnknown : formatPercent(row.ter),
        buyable: <BuyableCell row={row} />,
      },
    }
  })

  return (
    <div className={styles.block}>
      <Table
        caption={text.caption}
        columns={columns}
        rows={tableRows}
        card
        intro
        compact
      />
      {dataAsOf ? (
        <p className={styles.source}>
          {nbsp(text.source(formatMonthYear(dataAsOf)))}
        </p>
      ) : null}
    </div>
  )
}
