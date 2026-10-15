import { ButtonLink } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Container } from '@/components/Container'
import { HeroTable } from '@/components/HeroTable'
import { heroCopy } from '@/content/copy'
import { DEFAULT_MONTHLY, DEFAULT_YEARS } from '@/lib/calculator-defaults'
import { formatKc, formatMonthYear } from '@/lib/format'
import { nbsp } from '@/lib/typography'
import type { HeroNote, HeroTwin } from '@/server/hero'
import styles from './HeroB.module.scss'

type HeroBProps = {
  twins: HeroTwin[]
  // left out when the data has no note
  note?: HeroNote
  dataVerifiedOn: string | null
  // The A/B headline (note 0041). b needs `savingKc`.
  variant?: 'a' | 'b'
  savingKc?: number | null
}

const text = heroCopy

// The short line under the table: how many known brokers sell the first twin and when
// that was verified. Chosen from the data, so it never says more than the data shows
// (SPEC §18, note 0029).
function shortLine(note: HeroNote, dataVerifiedOn: string | null): string {
  const lines = text.note
  if (note.sellers.length === 0) return lines.noSellers(note.ticker)
  const known = lines.known(note.ticker, note.sellers.length)
  return dataVerifiedOn
    ? `${known} · ${lines.verifiedOn(formatMonthYear(dataVerifiedOn))}`
    : known
}

// Hero b (ad B): the table first, then the call to action. On a phone the order
// is headline, lead, table, button, muted line, then the ETF explanation.
export function HeroB({
  twins,
  note,
  dataVerifiedOn,
  variant = 'a',
  savingKc = null,
}: HeroBProps) {
  // Variant b needs an amount to name; without one the page says variant a.
  const showB = variant === 'b' && savingKc !== null && savingKc > 0
  // Said only when the data shows it: a majority of brokers verified as not
  // selling the originals, and at least one verified seller of the twin.
  // Variant b: which setting the amount in the headline is for.
  const setting = showB
    ? text.note.headlineSetting(formatKc(DEFAULT_MONTHLY), DEFAULT_YEARS)
    : null
  const calloutOriginals =
    note && note.originals.mostlyNo && note.sellers.length > 0
      ? text.callout.originals(note.originals.tickers.join(', '))
      : null
  return (
    <section aria-labelledby="hero-headline" className={styles.hero}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <h1 id="hero-headline" className={styles.headline}>
              {showB ? (
                <>
                  {nbsp(text.headline.b.before)}
                  <span className={styles.amount}>{formatKc(savingKc)}</span>
                  {nbsp(text.headline.b.after)}
                </>
              ) : (
                nbsp(text.headline.a)
              )}
            </h1>
            <p className={styles.lead}>{nbsp(text.lead)}</p>
          </div>
          <div className={styles.table}>
            <HeroTable twins={twins} dataVerifiedOn={dataVerifiedOn} />
          </div>
          <div id="hero-cta" className={styles.cta}>
            <ButtonLink href="#spocitat" fullWidth>
              {nbsp(text.cta)}
            </ButtonLink>
            <p className={styles.ctaNote}>{nbsp(text.ctaNote)}</p>
          </div>
          {note ? (
            <p className={styles.footnote} data-testid="hero-note">
              {nbsp(shortLine(note, dataVerifiedOn))}
              {note.sellers.length > 0 ? (
                <span className={styles.wide}>
                  {' · '}
                  {nbsp(text.note.priceOnlyShort)}
                </span>
              ) : null}
              {setting ? (
                <span className={styles.wideBlock}>{nbsp(setting)}</span>
              ) : null}
            </p>
          ) : null}
          <div className={styles.callout}>
            <Callout>
              <strong>{text.callout.term}</strong>
              {nbsp(text.callout.text)}
              {calloutOriginals ? nbsp(calloutOriginals) : null}
            </Callout>
          </div>
          {note && note.sellers.length > 0 ? (
            <p className={styles.detail} data-testid="hero-detail">
              {nbsp(
                [
                  text.note.names(note.sellers.join(', ')),
                  text.note.priceOnly,
                  setting,
                ]
                  .filter(Boolean)
                  .join(' '),
              )}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
