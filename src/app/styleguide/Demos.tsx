'use client'

import { Calculator } from '@/components/Calculator'
import { Field } from '@/components/Field'
import { Tag } from '@/components/Tag'
import type { CalcFund } from '@/server/calc'
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

// Invented numbers, not real fund data (all real data is still unverified).
const sampleUs: CalcFund = {
  id: 'sample-us',
  indexGroup: 'sample',
  ter: 0.3,
  dividendYieldPct: 1.5,
  withholdingRate: 30,
}
const sampleEu: CalcFund = {
  id: 'sample-eu',
  indexGroup: 'sample',
  ter: 0.07,
  dividendYieldPct: 1.5,
  withholdingRate: 15,
}

export function CalculatorDemo() {
  return (
    <div className={`${styles.stack} ${styles.fill}`}>
      <Tag as="h3">Calculator (sample numbers, not real fund data)</Tag>
      <div className={styles.fill}>
        <Calculator featured={sampleUs} alternative={sampleEu} fxFeePct={0.5} />
      </div>
      <Tag as="h3">Calculator without a conversion fee</Tag>
      <div className={styles.fill}>
        <Calculator featured={sampleUs} alternative={sampleEu} />
      </div>
    </div>
  )
}
