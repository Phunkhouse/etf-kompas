import { Container } from '@/components/Container'
import { shellCopy } from '@/content/copy'
import { formatDate } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import styles from './SourceBar.module.scss'

type SourceBarProps = {
  // Oldest verifiedOn among the numbers on the page (ISO date), or null without data.
  dataVerifiedOn: string | null
}

// Dark strip above the header: where the numbers come from, and how old they are.
export function SourceBar({ dataVerifiedOn }: SourceBarProps) {
  const text = dataVerifiedOn
    ? shellCopy.sourceBar(formatDate(dataVerifiedOn))
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
