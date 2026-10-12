import { CalculatorSection } from '@/components/CalculatorSection'
import { EmailPreview } from '@/components/EmailPreview'
import { HeroB } from '@/components/HeroB'
import { HiddenCosts } from '@/components/HiddenCosts'
import { Section } from '@/components/Section'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SourceBar } from '@/components/SourceBar'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import type { HeroNote, HeroTwin } from '@/server/hero'
import type { CalculatorData } from '@/server/calculator-data'
import styles from './Landing.module.scss'

export type Variant = 'a' | 'b'

type LandingProps = {
  // a = calculator-first hero (ad A), b = table-first hero (ad B)
  variant: Variant
  dataAsOf: string | null
  // The hero b table and its muted line; hero a does not use them.
  twins?: HeroTwin[]
  note?: HeroNote
  // The calculator band: left out when undefined, the failure state when null.
  calculator?: CalculatorData | null
}

// The landing page: frame plus the hero of the chosen variant. In hero a the
// calculator band is the hero: its inputs come right after the headline.
export function Landing({
  variant,
  dataAsOf,
  twins = [],
  note,
  calculator,
}: LandingProps) {
  return (
    <>
      <SourceBar dataAsOf={dataAsOf} />
      <SiteHeader />
      <main>
        {variant === 'b' ? (
          <HeroB twins={twins} note={note} dataAsOf={dataAsOf} />
        ) : (
          <Section labelledBy="hero-headline">
            <h1 id="hero-headline" className={styles.headline}>
              {nbsp(copy.hero.a.headline)}
            </h1>
            <p className={styles.sub}>{nbsp(copy.hero.a.sub)}</p>
          </Section>
        )}
        {calculator !== undefined ? (
          <CalculatorSection data={calculator} hero={variant === 'a'} />
        ) : null}
        <HiddenCosts />
        <EmailPreview />
      </main>
      <SiteFooter />
    </>
  )
}
