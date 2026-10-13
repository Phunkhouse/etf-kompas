import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'
import { hiddenCostsCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './HiddenCosts.module.scss'

const text = hiddenCostsCopy

// "Za co platíte, aniž to vidíte": the three costs, one plain sentence each. Static
// content (no client JavaScript). The numbers on the cards are a CSS counter, so
// the text itself carries no figures.
export function HiddenCosts() {
  return (
    <Section labelledBy="hidden-costs-heading">
      <Tag as="h2" id="hidden-costs-heading">
        {nbsp(text.heading)}
      </Tag>
      <ol className={styles.list}>
        {text.cards.map((card) => (
          <li key={card.title} className={styles.card}>
            <h3 className={styles.title}>{nbsp(card.title)}</h3>
            <p className={styles.text}>{nbsp(card.text)}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
