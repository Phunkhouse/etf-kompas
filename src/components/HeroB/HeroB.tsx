import { ButtonLink } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Container } from '@/components/Container'
import { HeroTable } from '@/components/HeroTable'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import type { HeroRow } from '@/server/availability'
import styles from './HeroB.module.scss'

type HeroBProps = {
  rows: HeroRow[]
  dataAsOf: string | null
}

const text = copy.hero.b
type RowCopyKey = keyof typeof text.table.rows

// The footnote under the table says why the highlighted row is highlighted. It
// is chosen from the data, so it never claims something the table does not show.
function footnoteText(rows: HeroRow[]): string {
  const { footnote } = text
  if (!rows.some((row) => row.highlight)) return footnote.none

  const priced = rows.filter((row) => row.ter !== null)
  if (priced.length === 0) return footnote.highlighted
  const lowest = priced.reduce((best, row) =>
    (row.ter as number) < (best.ter as number) ? row : best,
  )
  if (lowest.highlight) return footnote.highlighted

  const name = text.table.rows[lowest.fundId as RowCopyKey].inSentence
  const { state, verifiedNoCount, total } = lowest.buyability
  if (state === 'no') return footnote.notCheapestNowhere(name, total)
  if (verifiedNoCount > 0) {
    return footnote.notCheapest(name, verifiedNoCount, total)
  }
  return footnote.notCheapestUnchecked(name)
}

// Hero b (ad B): the table first, then the call to action. On a phone the order
// is headline, lead, table, button, footnote, then the ETF explanation.
export function HeroB({ rows, dataAsOf }: HeroBProps) {
  return (
    <section aria-labelledby="hero-headline" className={styles.hero}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <h1 id="hero-headline" className={styles.headline}>
              {nbsp(text.headline)}
            </h1>
            <p className={styles.lead}>{nbsp(text.lead)}</p>
          </div>
          <div className={styles.table}>
            <HeroTable rows={rows} dataAsOf={dataAsOf} />
          </div>
          <div className={styles.cta}>
            <ButtonLink href="#spocitat" fullWidth>
              {nbsp(text.cta)}
            </ButtonLink>
          </div>
          <p className={styles.footnote}>{nbsp(footnoteText(rows))}</p>
          <div className={styles.callout}>
            <Callout>
              <strong>{text.callout.term}</strong>
              {nbsp(text.callout.text)}
            </Callout>
          </div>
        </div>
      </Container>
    </section>
  )
}
