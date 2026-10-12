import { ButtonLink } from '@/components/Button'
import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './EmailPreview.module.scss'

const text = copy.emailPreview

// "Co dostanete e-mailem": the heading, one line of what to expect, the button
// again, and two drawn previews of the PDF pages. The previews are abstract art
// (grey bars and coloured cells, no numbers), hidden from screen readers; they
// are replaced by real blurred pages when the PDF exists.
export function EmailPreview() {
  return (
    <Section labelledBy="email-preview-heading">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <Tag as="p">{nbsp(text.label)}</Tag>
          <h2 id="email-preview-heading" className={styles.heading}>
            {nbsp(text.heading)}
          </h2>
          <p className={styles.text}>{nbsp(text.text)}</p>
          <div>
            <ButtonLink href="#formular">{nbsp(text.cta)}</ButtonLink>
          </div>
        </div>
        <div className={styles.pages}>
          <figure className={styles.page}>
            <div className={styles.art} aria-hidden="true">
              <span className={styles.title} />
              <span className={styles.bar} />
              <span className={styles.cells}>
                <i className={styles.good} />
                <i className={styles.bad} />
                <i className={styles.good} />
                <i className={styles.good} />
                <i className={styles.bad} />
                <i className={styles.good} />
              </span>
              <span className={styles.bar} />
              <span className={styles.bar} />
            </div>
            <figcaption className={styles.caption}>
              {nbsp(text.pages.comparison)}
            </figcaption>
          </figure>
          <figure className={styles.page}>
            <div className={styles.art} aria-hidden="true">
              <span className={styles.title} />
              <span className={styles.bar} />
              <span className={styles.box} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </div>
            <figcaption className={styles.caption}>
              {nbsp(text.pages.tax)}
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  )
}
