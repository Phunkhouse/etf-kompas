import { sendLead } from '@/app/lead-action'
import { Calculator } from '@/components/Calculator'
import { LeadForm } from '@/components/LeadForm'
import { Section } from '@/components/Section'
import { copy } from '@/content/copy'
import type { CalculatorData } from '@/server/calculator-data'
import styles from './CalculatorSection.module.scss'

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
      <div className={styles.layout}>
        <div className={styles.calculator}>
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
        </div>
        <div className={styles.form}>
          <LeadForm action={sendLead} />
        </div>
      </div>
    </Section>
  )
}
