'use client'

import { useState, type KeyboardEvent } from 'react'
import { Pill } from '@/components/Pill'
import { Table, type TableColumn } from '@/components/Table'
import { resultsCopy } from '@/content/copy'
import { formatKc, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import type { Comparison } from '@/server/comparison'
import styles from './BrokerPicker.module.scss'

type BrokerPickerProps = {
  comparison: Comparison
}

const text = resultsCopy.brokers

// "U kterého brokera?": a fund picker over the broker table (wireframe B, "Comparison
// page"). Without JavaScript the first fund is shown. Prices come from the server
// (the same pricing as the calculator); nothing is calculated here.
export function BrokerPicker({ comparison }: BrokerPickerProps) {
  const { funds, byFund, setup } = comparison
  const [selected, setSelected] = useState(comparison.headlineFundId)
  const current = byFund[selected]
  const years = setup.years

  const columns: TableColumn[] = [
    { id: 'broker', header: text.columns.broker, width: '28%' },
    { id: 'buy', header: text.columns.buy, width: '24%' },
    { id: 'fees', header: text.columns.fees, width: '24%', numeric: true },
    {
      id: 'total',
      header: text.columns.total(years),
      width: '24%',
      numeric: true,
    },
  ]

  const rows = current.brokers.map((cell) => ({
    id: cell.brokerId,
    cells: {
      broker: <strong>{cell.name}</strong>,
      buy:
        cell.available === true ? (
          <Pill tone="positive">{text.yes}</Pill>
        ) : cell.available === false ? (
          <Pill tone="negative">{text.no}</Pill>
        ) : (
          <Pill tone="unverified">{text.unverified}</Pill>
        ),
      fees: cell.priced ? (
        formatKc(cell.priced.feesKc)
      ) : cell.available === false ? (
        text.none
      ) : (
        <Pill tone="unverified">{text.unverified}</Pill>
      ),
      total: cell.priced ? formatKc(cell.priced.totalKc) : text.none,
    },
  }))

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return
    const index = funds.findIndex((fund) => fund.fundId === selected)
    const next = funds[(index + step + funds.length) % funds.length]
    setSelected(next.fundId)
    event.currentTarget
      .querySelector<HTMLElement>(`[data-fund="${next.fundId}"]`)
      ?.focus()
    event.preventDefault()
  }

  return (
    <div className={styles.picker}>
      <div className={styles.head}>
        <h2 className={styles.heading}>{nbsp(text.heading)}</h2>
        <span className={styles.hint}>{text.pick}</span>
      </div>
      <div
        role="tablist"
        aria-label={text.pick}
        className={styles.tabs}
        onKeyDown={onKeyDown}
      >
        {funds.map((fund) => (
          <button
            key={fund.fundId}
            type="button"
            role="tab"
            id={`tab-${fund.fundId}`}
            data-fund={fund.fundId}
            aria-selected={fund.fundId === selected}
            aria-controls="broker-panel"
            tabIndex={fund.fundId === selected ? 0 : -1}
            className={styles.tab}
            onClick={() => setSelected(fund.fundId)}
          >
            {fund.ticker}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="broker-panel"
        aria-labelledby={`tab-${selected}`}
        className={styles.panel}
      >
        <Table card caption={text.caption} columns={columns} rows={rows} />
      </div>
      <p className={styles.note}>
        {nbsp(
          text.assumption(
            formatKc(setup.monthly),
            years,
            formatPercent(setup.grossReturn, 0),
          ),
        )}
      </p>
      {current.spreadKc !== null && current.lowestKc !== null ? (
        <p className={styles.summary}>
          {nbsp(
            text.summary(
              formatKc(current.spreadKc),
              formatKc(current.lowestKc),
              years,
            ),
          )}
        </p>
      ) : null}
      <p className={styles.note}>{nbsp(text.estimate)}</p>
    </div>
  )
}
