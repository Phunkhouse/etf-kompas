import { ButtonLink } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Container } from '@/components/Container'
import { HeroTable } from '@/components/HeroTable'
import { copy } from '@/content/copy'
import { formatMonthYear } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import type { HeroNote, HeroTwin } from '@/server/hero'
import styles from './HeroB.module.scss'

type HeroBProps = {
  twins: HeroTwin[]
  // left out when the data has no note
  note?: HeroNote
  dataAsOf: string | null
}

const text = copy.hero.b

// "VOO a QQQ" from the tickers in the data.
function joinTickers(tickers: string[]): string {
  return tickers.join(' a ')
}

// The muted line under the table. It is chosen from the data, so it never says
// more than the data shows (SPEC §18, note 0029).
function noteText(note: HeroNote, dataAsOf: string | null): string {
  const lines = text.note
  const parts: string[] = []
  if (note.sellers.length === 0) {
    parts.push(lines.noSellers(note.ticker))
  } else {
    const names = note.sellers.join(', ')
    parts.push(
      dataAsOf
        ? lines.sellers(note.ticker, names, formatMonthYear(dataAsOf))
        : lines.sellersNoDate(note.ticker, names),
    )
  }
  if (note.othersUnverified) parts.push(lines.others)
  const originals = joinTickers(note.originals.tickers)
  if (note.originals.tickers.length > 0) {
    parts.push(
      note.originals.mostlyNo
        ? lines.originalsMostlyNo(originals)
        : lines.originalsChecking(originals),
    )
  }
  return parts.join(' ')
}

// Hero b (ad B): the table first, then the call to action. On a phone the order
// is headline, lead, table, button, muted line, then the ETF explanation.
export function HeroB({ twins, note, dataAsOf }: HeroBProps) {
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
            {/* The date is in the muted line, so the table has no source line. */}
            <HeroTable twins={twins} dataAsOf={null} />
          </div>
          <div className={styles.cta}>
            <ButtonLink href="#spocitat" fullWidth>
              {nbsp(text.cta)}
            </ButtonLink>
          </div>
          {note ? (
            <p className={styles.footnote} data-testid="hero-note">
              {nbsp(noteText(note, dataAsOf))}
            </p>
          ) : null}
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
