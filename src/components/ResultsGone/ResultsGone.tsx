import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { resultsGoneCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './ResultsGone.module.scss'

// A results link that does not work (never issued, expired, mistyped): one text for
// all of them. The "send the link again" form comes with the e-mails (PR 4).
export function ResultsGone() {
  return (
    <Container>
      <div className={styles.card}>
        <Tag as="p">{resultsGoneCopy.label}</Tag>
        <h1 className={styles.title}>{nbsp(resultsGoneCopy.title)}</h1>
        <p className={styles.text}>{nbsp(resultsGoneCopy.text)}</p>
        <div className={styles.actions}>
          <ButtonLink href="/" fullWidth>
            {nbsp(resultsGoneCopy.back)}
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
