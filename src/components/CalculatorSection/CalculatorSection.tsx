import { Calculator } from '@/components/Calculator'
import { Section } from '@/components/Section'
import { copy } from '@/content/copy'
import type { CalculatorData } from '@/server/calculator-data'

type CalculatorSectionProps = {
  // null shows the failure state (no amount).
  data: CalculatorData | null
  // The band is the hero (hero a): its heading is hidden and it has a start
  // button that takes phones to the result.
  hero?: boolean
}

// The dark band with the calculator. `#spocitat` is where the hero button jumps to.
export function CalculatorSection({
  data,
  hero = false,
}: CalculatorSectionProps) {
  return (
    <Section tone="dark" id="spocitat" labelledBy="calculator-heading">
      <Calculator
        data={data}
        headingAs="h2"
        headingId="calculator-heading"
        headingHidden={hero}
        action={
          hero
            ? {
                label: copy.hero.a.cta,
                href: '#vysledek',
                note: copy.hero.a.note,
              }
            : undefined
        }
      />
    </Section>
  )
}
