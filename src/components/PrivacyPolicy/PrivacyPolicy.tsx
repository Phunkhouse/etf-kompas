import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { legalCopy } from '@/content/copy'
import { retentionConfig } from '@/config/retention'
import { controllerLabel } from '@/config/site'
import { nbsp } from '@/lib/typography'
import styles from './PrivacyPolicy.module.scss'

const text = legalCopy.privacy

// Shows each "[doplnit]" in a text as a marker, so a gap is never missed.
function withGaps(value: string) {
  return value.split('[doplnit]').flatMap((part, index, parts) => {
    const pieces: ReactNode[] = [nbsp(part)]
    if (index < parts.length - 1) {
      pieces.push(
        <span key={index} data-placeholder className={styles.gap}>
          [doplnit]
        </span>,
      )
    }
    return pieces
  })
}

// The privacy policy page (wireframe B, "Privacy policy"): the wireframe's own
// text with "[doplnit]" gaps. It has not been reviewed by a qualified person.
export function PrivacyPolicy() {
  return (
    <Container>
      <div className={styles.page}>
        <nav aria-label={text.contents} className={styles.contents}>
          <Tag as="p">{text.contents}</Tag>
          <ol className={styles.list}>
            {text.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{nbsp(section.title)}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className={styles.article}>
          <Tag as="p">{text.label}</Tag>
          <h1 className={styles.title}>{nbsp(text.title)}</h1>
          <p className={styles.valid}>
            {nbsp(`${text.validFrom} ${text.validFromDate}`)}
          </p>
          {text.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
            >
              <h2 className={styles.heading}>{nbsp(section.title)}</h2>
              <p className={styles.text}>
                {withGaps(
                  typeof section.text === 'function'
                    ? section.text(controllerLabel(), retentionConfig())
                    : section.text,
                )}
              </p>
            </section>
          ))}
        </article>
      </div>
    </Container>
  )
}
