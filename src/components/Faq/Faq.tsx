import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'
import { faqCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import type { OriginalsFacts } from '@/server/hero'
import styles from './Faq.module.scss'

const text = faqCopy

type FaqProps = {
  // What the data says about the American funds; the answer is chosen from it.
  facts?: OriginalsFacts
}

// The answer about the American funds says only what the data shows: how many
// brokers are verified as not selling them, never more.
function americanFundsAnswer(facts: OriginalsFacts | undefined): string {
  const answers = text.answers.us
  if (!facts) return answers.noFacts
  const tickers = facts.tickers.join(' a ')
  if (facts.verifiedNo === 0) return answers.none(tickers)

  const parts: string[] = []
  const everyone = facts.total > 0 && facts.verifiedNo >= facts.total
  parts.push(
    everyone
      ? answers.all(facts.total, tickers)
      : answers.some(facts.verifiedNo, facts.total, tickers),
  )
  if (facts.europeanSold) parts.push(answers.european)
  parts.push(answers.reason)
  return parts.join(' ')
}

// "Časté dotazy": four questions as native <details>, so they open and close
// without JavaScript. Static content.
export function Faq({ facts }: FaqProps) {
  const items = [
    {
      key: 'us',
      question: text.questions.us,
      answer: americanFundsAnswer(facts),
    },
    { key: 'free', question: text.questions.free, answer: text.answers.free },
    {
      key: 'email',
      question: text.questions.email,
      answer: text.answers.email,
    },
    {
      key: 'advice',
      question: text.questions.advice,
      answer: text.answers.advice,
    },
  ]
  return (
    <Section labelledBy="faq-heading">
      <div id="caste-dotazy" className={styles.faq}>
        <Tag as="h2" id="faq-heading">
          {nbsp(text.heading)}
        </Tag>
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.key} className={styles.item}>
              <summary className={styles.question}>
                {nbsp(item.question)}
              </summary>
              <p className={styles.answer}>{nbsp(item.answer)}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
