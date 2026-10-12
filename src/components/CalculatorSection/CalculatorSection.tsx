import { Calculator } from '@/components/Calculator'
import { Section } from '@/components/Section'
import type { CalculatorData } from '@/server/calculator-data'

type CalculatorSectionProps = {
  // null shows the failure state (no amount).
  data: CalculatorData | null
}

// The dark band with the calculator. `#spocitat` is where the hero button jumps to.
export function CalculatorSection({ data }: CalculatorSectionProps) {
  return (
    <Section tone="dark" id="spocitat" labelledBy="calculator-heading">
      <Calculator data={data} headingAs="h2" headingId="calculator-heading" />
    </Section>
  )
}
