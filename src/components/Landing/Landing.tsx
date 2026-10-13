import { CalculatorSection } from '@/components/CalculatorSection'
import { EmailPreview } from '@/components/EmailPreview'
import { HeroB } from '@/components/HeroB'
import { Faq } from '@/components/Faq'
import { HiddenCosts } from '@/components/HiddenCosts'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SourceBar } from '@/components/SourceBar'
import { StickyBar } from '@/components/StickyBar'
import { TrustBlock } from '@/components/TrustBlock'
import type { HeroNote, HeroTwin, OriginalsFacts } from '@/server/hero'
import type { CalculatorData } from '@/server/calculator-data'

export type Variant = 'a' | 'b'

type LandingProps = {
  // The A/B variant shown: one layout, only the h1 differs (note 0041). It is
  // written on <main> as data-variant, for the tracking that comes later.
  variant: Variant
  dataAsOf: string | null
  // The hero table and its muted line.
  twins?: HeroTwin[]
  note?: HeroNote
  // What the FAQ answer about the American funds is chosen from.
  faqFacts?: OriginalsFacts
  // The amount the b headline names; without it the page shows variant a.
  savingKc?: number | null
  // The calculator band: left out when undefined, the failure state when null.
  calculator?: CalculatorData | null
}

// The landing page: the frame, the table-first hero, the calculator band with the
// form, and the explainers. Both A/B variants share this layout.
export function Landing({
  variant,
  dataAsOf,
  twins = [],
  note,
  faqFacts,
  savingKc = null,
  calculator,
}: LandingProps) {
  // The variant the page really shows: b only with an amount to name.
  const shown: Variant =
    variant === 'b' && savingKc !== null && savingKc > 0 ? 'b' : 'a'
  return (
    <>
      <SourceBar dataAsOf={dataAsOf} />
      <SiteHeader />
      <main data-variant={shown}>
        <HeroB
          twins={twins}
          note={note}
          dataAsOf={dataAsOf}
          variant={shown}
          savingKc={savingKc}
        />
        {calculator !== undefined ? (
          <CalculatorSection data={calculator} variant={shown} />
        ) : null}
        <HiddenCosts />
        <EmailPreview />
        <TrustBlock />
        <Faq facts={faqFacts} />
      </main>
      <SiteFooter />
      <StickyBar />
    </>
  )
}
