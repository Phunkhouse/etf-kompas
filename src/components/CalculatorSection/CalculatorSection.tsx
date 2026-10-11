import { Calculator } from '@/components/Calculator'
import { Section } from '@/components/Section'
import { copy } from '@/content/copy'
import type { Buyability } from '@/server/availability'
import type { CalculatorInputs } from '@/server/calculator-inputs'

type CalculatorSectionProps = {
  inputs: CalculatorInputs
  // Whether the featured (American) fund can be bought from Czechia.
  featuredBuyability: Buyability
}

// The note under the result, said only as far as the data goes.
function cheaperNote({ state, verifiedNoCount, total }: Buyability) {
  const note = copy.calculator.cheaperNote
  if (state === 'yes') return undefined
  if (state === 'no') return note.nowhere(total)
  return verifiedNoCount > 0
    ? note.unverified(verifiedNoCount, total)
    : note.unchecked
}

// The dark band with the calculator. `#spocitat` is where the hero button jumps to.
export function CalculatorSection({
  inputs,
  featuredBuyability,
}: CalculatorSectionProps) {
  return (
    <Section tone="dark" id="spocitat" labelledBy="calculator-heading">
      <Calculator
        featured={inputs.featured}
        alternative={inputs.alternative}
        fxFeePct={inputs.fxFeePct}
        headingAs="h2"
        headingId="calculator-heading"
        cheaperNote={cheaperNote(featuredBuyability)}
      />
    </Section>
  )
}
