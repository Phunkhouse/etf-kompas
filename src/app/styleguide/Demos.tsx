'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { NumberDisplay } from '@/components/NumberDisplay'
import { Slider } from '@/components/Slider'
import { StackedBar } from '@/components/StackedBar'
import { Tag } from '@/components/Tag'
import { formatKc } from '@/lib/format'
import styles from './Primitives.module.scss'

// Sample numbers only: a stand-in cost of 8 % of the saved total, not the real calculator.
function Calculator() {
  const [monthly, setMonthly] = useState(3000)
  const total = monthly * 12 * 10
  const cost = Math.round(total * 0.08)

  return (
    <div className={styles.stack}>
      <div className={styles.fill}>
        <Slider
          label="Kolik měsíčně uložíte"
          value={monthly}
          min={500}
          max={20000}
          step={500}
          onChange={setMonthly}
          formatValue={formatKc}
          name="monthly"
        />
      </div>
      <NumberDisplay value={cost} />
      <div className={styles.fill}>
        <StackedBar
          remaining={total - cost}
          cost={cost}
          remainingLabel="po poplatcích"
          costLabel="zaplaceno na poplatcích"
        />
      </div>
      <div className={styles.row}>
        <Button size="sm" variant="secondary" onClick={() => setMonthly(500)}>
          Minimum
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setMonthly(20000)}>
          Maximum
        </Button>
      </div>
    </div>
  )
}

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

export function CalculatorDemo() {
  return (
    <div className={`${styles.stack} ${styles.fill}`}>
      <Tag as="h3">Slider, NumberDisplay, StackedBar (sample numbers)</Tag>
      <Calculator />
    </div>
  )
}
