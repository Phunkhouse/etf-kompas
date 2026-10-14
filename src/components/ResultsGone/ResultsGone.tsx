import { resendByEmailAction } from '@/app/mail-actions'
import { ButtonLink } from '@/components/Button'
import { ResendForm } from '@/components/ResendForm'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { resultsGoneCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './ResultsGone.module.scss'

// A results link that does not work (never issued, expired, mistyped): one text for
// all of them, and a form that sends a new link to an address (the same answer for every one).
export function ResultsGone() {
  return (
    <Container>
      <div className={styles.card}>
        <Tag as="p">{resultsGoneCopy.label}</Tag>
        <h1 className={styles.title}>{nbsp(resultsGoneCopy.title)}</h1>
        <p className={styles.text}>{nbsp(resultsGoneCopy.text)}</p>
        <ResendForm action={resendByEmailAction} />
        <div className={styles.actions}>
          <ButtonLink href="/" fullWidth>
            {nbsp(resultsGoneCopy.back)}
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
