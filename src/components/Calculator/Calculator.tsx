'use client'

import { useState } from 'react'
import { Button, ButtonLink } from '@/components/Button'
import { Chip } from '@/components/Chip'
import { NumberDisplay } from '@/components/NumberDisplay'
import { Slider } from '@/components/Slider'
import { Tag } from '@/components/Tag'
import { copy } from '@/content/copy'
import { formatKc, formatPercent } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import { priceBrokers } from '@/server/broker-pricing'
import type { CalculatorData } from '@/server/calculator-data'
import { fundFeeKc } from '@/server/cost'
import styles from './Calculator.module.scss'

const HORIZONS = [5, 10, 20]
const MONTHLY_MIN = 500
const MONTHLY_MAX = 20000
const MONTHLY_STEP = 500
// The same for every fund, so only the costs differ (SPEC §17.3).
const GROSS_RETURN = 6

type CalculatorProps = {
  // null when the numbers are not available: the calculator then shows no amount.
  data: CalculatorData | null
  onRetry?: () => void
  // Heading level and id, so the page can name the section after it.
  headingAs?: 'h2' | 'h3'
  headingId?: string
  // The heading stays in the page for screen readers, but is not shown (hero a).
  headingHidden?: boolean
  // A link under the inputs, on phones only, for example "Ukázat, kolik mě to
  // bude stát" to the result (hero a), with a muted line under it.
  action?: { label: string; href: string; note: string }
}

// The cost calculator (SPEC §4, §21, docs/METHODOLOGY-V2.md). Prices in the
// browser with the same pure functions the server uses to recompute.
export function Calculator({
  data,
  onRetry = () => window.location.reload(),
  headingAs = 'h3',
  headingId,
  headingHidden = false,
  action,
}: CalculatorProps) {
  const [monthly, setMonthly] = useState(3000)
  const [years, setYears] = useState(10)
  const text = copy.calculator

  const heading = (
    <div className={headingHidden ? styles.srOnly : undefined}>
      <Tag as={headingAs} id={headingId}>
        {nbsp(text.heading)}
      </Tag>
    </div>
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
        {action ? (
          <div className={styles.action}>
            <ButtonLink href={action.href} fullWidth>
              {nbsp(action.label)}
            </ButtonLink>
            <p className={styles.actionNote}>{nbsp(action.note)}</p>
          </div>
        ) : null}
      </div>

      <div id="vysledek" className={styles.result}>
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
              {nbsp(text.saving.text(formatKc(prices.spreadKc)))}
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
