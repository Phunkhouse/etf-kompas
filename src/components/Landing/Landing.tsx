import { CalculatorSection } from '@/components/CalculatorSection'
import { HeroB } from '@/components/HeroB'
import { Section } from '@/components/Section'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SourceBar } from '@/components/SourceBar'
import { copy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import type { HeroRow } from '@/server/availability'
import type { CalculatorData } from '@/server/calculator-data'
import styles from './Landing.module.scss'

export type Variant = 'a' | 'b'

type LandingProps = {
  // a = calculator-first hero (ad A), b = table-first hero (ad B)
  variant: Variant
  dataAsOf: string | null
  // The rows of the hero b table; hero a does not use them.
  rows?: HeroRow[]
  // The calculator band: left out when undefined, the failure state when null.
  calculator?: CalculatorData | null
}

// The landing page: frame plus the hero of the chosen variant. Hero a below is
// a placeholder (headline only); the hero a PR replaces it.
export function Landing({
  variant,
  dataAsOf,
  rows = [],
  calculator,
}: LandingProps) {
  return (
    <>
      <SourceBar dataAsOf={dataAsOf} />
      <SiteHeader />
      <main>
        {variant === 'b' ? (
          <HeroB rows={rows} dataAsOf={dataAsOf} />
        ) : (
          <Section labelledBy="hero-headline">
            <h1 id="hero-headline" className={styles.headline}>
              {nbsp(copy.hero.a.headline)}
            </h1>
          </Section>
        )}
        {calculator !== undefined ? (
          <CalculatorSection data={calculator} />
        ) : null}
      </main>
      <SiteFooter />
    </>
  )
}
