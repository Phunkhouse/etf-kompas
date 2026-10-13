import { Container } from '@/components/Container'
import { shellCopy } from '@/content/copy'
import { formatMonthYear } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import styles from './SourceBar.module.scss'

type SourceBarProps = {
  // Oldest asOf among the numbers on the page (ISO date), or null without data.
  dataAsOf: string | null
}

// Dark strip above the header: where the numbers come from, and how old they are.
export function SourceBar({ dataAsOf }: SourceBarProps) {
  const text = dataAsOf
    ? shellCopy.sourceBar(formatMonthYear(dataAsOf))
    : shellCopy.sourceBarNoDate
  return (
    <div className={styles.bar}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.source}>{nbsp(text)}</p>
          <p className={styles.risk}>{nbsp(shellCopy.riskShort)}</p>
        </div>
      </Container>
    </div>
  )
}
