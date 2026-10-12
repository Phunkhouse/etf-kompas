import { sendLead } from '@/app/lead-action'
import { Calculator } from '@/components/Calculator'
import { LeadForm } from '@/components/LeadForm'
import { Section } from '@/components/Section'
import type { CalculatorData } from '@/server/calculator-data'
import styles from './CalculatorSection.module.scss'

type CalculatorSectionProps = {
  // null shows the failure state (no amount).
  data: CalculatorData | null
}

// The dark band with the calculator and the e-mail form. `#spocitat` is where the
// hero button jumps to.
export function CalculatorSection({ data }: CalculatorSectionProps) {
  return (
    <Section tone="dark" id="spocitat" labelledBy="calculator-heading">
      <div className={styles.layout}>
        <div className={styles.calculator}>
          <Calculator
            data={data}
            headingAs="h2"
            headingId="calculator-heading"
          />
        </div>
        <div className={styles.form}>
          <LeadForm action={sendLead} />
        </div>
      </div>
    </Section>
  )
}
