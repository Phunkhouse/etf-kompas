'use client'

import { useState } from 'react'
import { Chip } from '@/components/Chip'
import { NumberDisplay } from '@/components/NumberDisplay'
import { Slider } from '@/components/Slider'
import { Tag } from '@/components/Tag'
import { copy } from '@/content/copy'
import { formatKc, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import { calcComparison, type CalcFund } from '@/server/calc'
import styles from './Calculator.module.scss'

const HORIZONS = [5, 10, 20]
const MONTHLY_MIN = 500
const MONTHLY_MAX = 20000
const MONTHLY_STEP = 500

type CalculatorProps = {
  // The US-listed fund the headline is about, and its European twin.
  featured: CalcFund
  alternative: CalcFund
  // Absent means the conversion fee is not counted (SPEC §21).
  fxFeePct?: number
  grossReturn?: number
}

// The fee and tax drag calculator (SPEC §4, §21). Calculates in the browser
// with the same pure function the server uses to recompute.
export function Calculator({
  featured,
  alternative,
  fxFeePct,
  grossReturn = 6,
}: CalculatorProps) {
  const [monthly, setMonthly] = useState(3000)
  const [years, setYears] = useState(10)
  const text = copy.calculator

  const [own, other] = calcComparison(
    { monthly, years, grossReturn, fxFeePct },
    [featured, alternative],
  )
  // The gap is shown from the point of view of the American fund.
  const gap =
    own.gapKc === null ? 0 : own.gapKc > 0 ? own.gapKc : (other.gapKc ?? 0)
  const tag =
    own.gapKc !== null && own.gapKc > 0
      ? text.resultMore(years)
      : gap > 0
        ? text.resultLess(years)
        : text.resultSame(years)

  const lines = [
    { id: 'ter', label: text.parts.ter, amount: own.parts.ter },
    ...(own.fxApplied
      ? [{ id: 'fx', label: text.parts.fx, amount: own.parts.fx }]
      : []),
    {
      id: 'withholding',
      label: text.parts.withholding,
      amount: own.parts.withholding,
    },
  ]

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        <Tag as="h3">{nbsp(text.heading)}</Tag>
        <Slider
          label={nbsp(text.monthlyLabel)}
          value={monthly}
          min={MONTHLY_MIN}
          max={MONTHLY_MAX}
          step={MONTHLY_STEP}
          onChange={setMonthly}
          formatValue={formatKc}
          name="monthly"
        />
        <div
          role="group"
          aria-label={text.horizonLabel}
          className={styles.group}
        >
          <span className={styles.groupLabel} aria-hidden="true">
            {nbsp(text.horizonLabel)}
          </span>
          <div className={styles.chips}>
            {HORIZONS.map((option) => (
              <Chip
                key={option}
                selected={option === years}
                onClick={() => setYears(option)}
              >
                {nbsp(text.years(option))}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.result}>
        <p className={styles.resultTag}>{nbsp(tag)}</p>
        <NumberDisplay value={gap} />
        <p className={styles.total}>
          {nbsp(text.total(formatKc(own.totalKc)))}
        </p>
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={line.id} className={styles.line}>
              <span>{nbsp(line.label)}</span>
              <span className={styles.amount}>{formatKc(line.amount)}</span>
            </li>
          ))}
        </ul>
        {!own.fxApplied && <p className={styles.note}>{nbsp(text.fxOff)}</p>}
        <p className={styles.note}>
          {nbsp(text.assumption(formatPercent(grossReturn, 0)))}
        </p>
      </div>
    </div>
  )
}
