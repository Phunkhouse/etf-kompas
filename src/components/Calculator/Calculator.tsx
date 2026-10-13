'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { NumberDisplay } from '@/components/NumberDisplay'
import { Slider } from '@/components/Slider'
import { Tag } from '@/components/Tag'
import { calculatorCopy } from '@/content/copy'
import { formatKc, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import {
  DEFAULT_MONTHLY,
  DEFAULT_YEARS,
  GROSS_RETURN,
} from '@/lib/calculator-defaults'
import { priceBrokers } from '@/server/broker-pricing'
import type { CalculatorData } from '@/server/calculator-data'
import { fundFeeKc } from '@/server/cost'
import styles from './Calculator.module.scss'

const HORIZONS = [5, 10, 20]
const MONTHLY_MIN = 500
const MONTHLY_MAX = 20000
const MONTHLY_STEP = 500

type CalculatorProps = {
  // null when the numbers are not available: the calculator then shows no amount.
  data: CalculatorData | null
  onRetry?: () => void
  // Heading level and id, so the page can name the section after it.
  headingAs?: 'h2' | 'h3'
  headingId?: string
}

// The cost calculator (SPEC §4, §21, docs/METHODOLOGY-V2.md). Prices in the
// browser with the same pure functions the server uses to recompute.
export function Calculator({
  data,
  onRetry = () => window.location.reload(),
  headingAs = 'h3',
  headingId,
}: CalculatorProps) {
  const [monthly, setMonthly] = useState(DEFAULT_MONTHLY)
  const [years, setYears] = useState(DEFAULT_YEARS)
  const text = calculatorCopy

  const heading = (
    <Tag as={headingAs} id={headingId}>
      {nbsp(text.heading)}
    </Tag>
  )

  if (data === null) {
    return (
      <div className={styles.calculator}>
        <div className={styles.inputs}>
          {heading}
          <p>{nbsp(text.failure.text)}</p>
          <div>
            <Button variant="secondary" onClick={onRetry}>
              {text.failure.retry}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const input = { monthly, years, grossReturn: GROSS_RETURN }
  const prices = priceBrokers(
    data.pricing,
    data.fundId,
    data.ter,
    data.rates,
    input,
  )
  const headline = prices.headline?.result ?? null
  const fundFee = fundFeeKc(input, data.ter)
  const rate = formatPercent(GROSS_RETURN, 0)

  const lines = headline
    ? [
        { id: 'fund', label: text.parts.fund, amount: headline.parts.fund },
        { id: 'fx', label: text.parts.fx, amount: headline.parts.fx },
        {
          id: 'broker',
          label: text.parts.broker,
          amount: headline.parts.broker,
        },
      ]
    : [{ id: 'fund', label: text.parts.fund, amount: fundFee }]

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        {heading}
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
        <NumberDisplay value={headline ? headline.totalKc : fundFee} />
        <p className={styles.total}>
          {nbsp(
            headline
              ? text.total(years, data.ticker, formatKc(headline.totalKc))
              : text.fundOnly(years, data.ticker, formatKc(fundFee)),
          )}
        </p>
        <ul className={styles.lines}>
          {lines.map((line) => (
            <li key={line.id} className={styles.line}>
              <span>{nbsp(line.label)}</span>
              <span className={styles.amount}>{formatKc(line.amount)}</span>
            </li>
          ))}
        </ul>
        {headline ? (
          <p className={styles.note}>
            {nbsp(
              text.illustrative(
                years,
                formatKc(headline.valueKc),
                formatKc(headline.totalKc),
                rate,
              ),
            )}
          </p>
        ) : (
          <p className={styles.note}>{nbsp(text.fundOnlyNote)}</p>
        )}
        <p className={styles.note}>{nbsp(text.assumption(rate))}</p>
        {prices.spreadKc !== null ? (
          <div className={styles.saving}>
            <p className={styles.savingLead}>{nbsp(text.saving.lead)}</p>
            <p className={styles.savingText}>
              {nbsp(text.saving.textBefore)}
              <strong className={styles.savingAmount}>
                {formatKc(prices.spreadKc)}
              </strong>
            </p>
            <p className={styles.savingNote}>{nbsp(text.saving.note)}</p>
            <a href="#formular" className={styles.savingButton}>
              {nbsp(text.saving.button)}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
