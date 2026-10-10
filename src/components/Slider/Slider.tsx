'use client'

import { useId, type CSSProperties } from 'react'
import styles from './Slider.module.scss'

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  // Text for the current value, shown on the right and read out by screen readers, for example "3 000 Kč"
  formatValue: (value: number) => string
  name?: string
}

// A native range input, so keyboard (arrows, Home, End, Page Up/Down) and screen readers work for free.
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  name,
}: SliderProps) {
  const id = useId()
  const fill = ((value - min) / (max - min)) * 100
  const text = formatValue(value)

  return (
    <div className={styles.slider}>
      <div className={styles.head}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {/* The input announces the value itself; this copy is only for the eyes. */}
        <span className={styles.value} aria-hidden="true">
          {text}
        </span>
      </div>
      <input
        id={id}
        name={name}
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
