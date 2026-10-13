import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'
import { trustBlockCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './TrustBlock.module.scss'

const text = trustBlockCopy

// "Proč nám věřit": three short items. Each has the id the header link points to.
// Static content, no client JavaScript.
export function TrustBlock() {
  return (
    <Section labelledBy="trust-heading">
      <Tag as="h2" id="trust-heading">
        {nbsp(text.heading)}
      </Tag>
      <div className={styles.items}>
        {text.items.map((item) => (
          <div key={item.id} id={item.id} className={styles.item}>
            <h3 className={styles.title}>{nbsp(item.title)}</h3>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.text}>
                {nbsp(paragraph)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}
