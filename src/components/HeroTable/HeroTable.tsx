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
import type { HeroTwin } from '@/server/hero'
import styles from './HeroTable.module.scss'

type HeroTableProps = {
  twins: HeroTwin[]
  // Oldest asOf among the numbers on the page (ISO date), or null.
  dataAsOf: string | null
}

const text = copy.hero.table
type RowCopyKey = keyof typeof text.rows

const columns: TableColumn[] = [
  { id: 'what', header: text.columns.what, width: '56%' },
  { id: 'fee', header: text.columns.fee, numeric: true, width: '22%' },
  { id: 'type', header: text.columns.type, width: '22%' },
]

function TypeCell({ type }: { type: HeroTwin['type'] }) {
  if (type === null) {
    return <Pill tone="unverified">{text.type.unverified}</Pill>
  }
  return <Pill tone="neutral">{text.type[type]}</Pill>
}

// The table of the table-first hero: four European twins with their annual fee
// and type (Acc or Dist). The numbers come from the data, the wording from
// copy.ts.
export function HeroTable({ twins, dataAsOf }: HeroTableProps) {
  const tableRows: TableRowData[] = twins.map((twin) => {
    const label = text.rows[twin.fundId as RowCopyKey]
    return {
      id: twin.fundId,
      cells: {
        what: (
          <TableLabel
            title={nbsp(label.plainName)}
            detail={nbsp(label.detail)}
          />
        ),
        fee: twin.ter === null ? text.feeUnknown : formatPercent(twin.ter),
        type: <TypeCell type={twin.type} />,
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
