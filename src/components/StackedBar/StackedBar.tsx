import { formatKc } from '@/lib/format'
import styles from './StackedBar.module.scss'

type StackedBarProps = {
  // Whole crowns left after fees and tax
  remaining: number
  // Whole crowns paid in fees and tax
  cost: number
  remainingLabel: string
  costLabel: string
}

const WIDTH = 100
const HEIGHT = 14
// A small cost stays visible as a sliver instead of vanishing.
const MIN_COST_SHARE = 0.015

// One horizontal bar split into "po poplatcích" and "zaplaceno na poplatcích",
// scaled to the visitor's own numbers. The legend below carries the exact amounts.
export function StackedBar({
  remaining,
  cost,
  remainingLabel,
  costLabel,
}: StackedBarProps) {
  const left = Math.max(remaining, 0)
  const paid = Math.max(cost, 0)
  const total = left + paid
  const rawShare = total === 0 ? 0 : paid / total
  const costShare = paid > 0 ? Math.max(rawShare, MIN_COST_SHARE) : 0
  const costWidth = costShare * WIDTH
  const remainingWidth = total === 0 ? 0 : WIDTH - costWidth

  const summary = `${remainingLabel}: ${formatKc(left)}. ${costLabel}: ${formatKc(paid)}.`

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.bar}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={summary}
      >
        <rect className={styles.track} width={WIDTH} height={HEIGHT} />
        <rect
          className={styles.remaining}
          data-segment="remaining"
          width={remainingWidth}
          height={HEIGHT}
        />
        <rect
          className={styles.cost}
          data-segment="cost"
          x={remainingWidth}
          width={costWidth}
          height={HEIGHT}
        />
      </svg>
      <figcaption className={styles.legend}>
        <span className={styles.item}>
          <span
            className={`${styles.swatch} ${styles.remaining}`}
            aria-hidden="true"
          />
          {remainingLabel}
          <strong className={styles.amount}>{formatKc(left)}</strong>
        </span>
        <span className={styles.item}>
          <span
            className={`${styles.swatch} ${styles.cost}`}
            aria-hidden="true"
          />
          {costLabel}
          <strong className={styles.amount}>{formatKc(paid)}</strong>
        </span>
      </figcaption>
    </figure>
  )
}
