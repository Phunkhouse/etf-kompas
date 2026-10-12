'use client'

import { Calculator } from '@/components/Calculator'
import { Field } from '@/components/Field'
import { Tag } from '@/components/Tag'
import { calculatorData, type CalculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import styles from './Primitives.module.scss'

export function FormDemos() {
  return (
    <div className={`${styles.stack} ${styles.fill}`}>
      <Tag as="h3">Field</Tag>
      <div className={styles.fill}>
        <Field
          label="Váš e-mail"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="jmeno@domena.cz"
        />
      </div>
      <div className={styles.fill}>
        <Field
          label="Váš e-mail"
          type="email"
          hint="Pošleme vám jen srovnání."
          defaultValue="jana@seznam.cz"
        />
      </div>
      <div className={styles.fill}>
        <Field
          label="Váš e-mail"
          type="email"
          defaultValue="jana@seznam"
          error="Zadejte prosím e-mail ve tvaru jmeno@domena.cz."
        />
      </div>
    </div>
  )
}

// Sample data: DEGIRO's real fees with invented exchange rates, and a copy of it
// with dearer orders so the saving box shows.
const rates = {
  EUR: { rate: 25, date: '2026-01-01', source: 'data' as const },
  USD: { rate: 23, date: '2026-01-01', source: 'data' as const },
}

function sample(twoBrokers: boolean): CalculatorData | null {
  const data = calculatorData(bundledData, rates, 'cspx')
  if (!data || !twoBrokers) return data
  const other = structuredClone(data.pricing[0])
  other.id = 'sample-other'
  for (const record of other.fees!.purchase) {
    if (typeof record.value !== 'string') {
      record.value = { ...record.value, fixed: record.value.fixed * 4 }
    }
  }
  return { ...data, pricing: [...data.pricing, other] }
}

export function CalculatorDemo() {
  return (
    <div className={`${styles.stack} ${styles.fill}`}>
      <Tag as="h3">Calculator: one priced broker (sample rates)</Tag>
      <div className={styles.fill}>
        <Calculator data={sample(false)} />
      </div>
      <Tag as="h3">Calculator: two priced brokers, with the saving box</Tag>
      <div className={styles.fill}>
        <Calculator data={sample(true)} />
      </div>
      <Tag as="h3">Calculator: no data (failure)</Tag>
      <div className={styles.fill}>
        <Calculator data={null} />
      </div>
    </div>
  )
}
