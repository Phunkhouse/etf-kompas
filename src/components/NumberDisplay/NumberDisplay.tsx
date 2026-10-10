'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { formatKc } from '@/lib/format'
import styles from './NumberDisplay.module.scss'

// Under the 300 ms limit in SPEC §4 (--duration-count).
const COUNT_UP_MS = 280

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}

type NumberDisplayProps = {
  // Whole crowns
  value: number
  size?: 'lg' | 'md'
}

// The big Kč result. Changes count up to the new value in under 300 ms,
// not at all with reduced motion. Screen readers only get the final value.
export function NumberDisplay({ value, size = 'lg' }: NumberDisplayProps) {
  const reduceMotion = usePrefersReducedMotion()
  const [shown, setShown] = useState(value)
  const shownRef = useRef(value)

  useEffect(() => {
    if (reduceMotion) return
    const from = shownRef.current
    if (from === value) return

    // Time zero is the first frame, so progress never starts below 0.
    let start: number | undefined
    let frame = 0
    const tick = (now: number) => {
      start ??= now
      const progress = Math.min(Math.max((now - start) / COUNT_UP_MS, 0), 1)
      const eased = 1 - (1 - progress) ** 3
      shownRef.current = Math.round(from + (value - from) * eased)
      setShown(shownRef.current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reduceMotion])

  const display = reduceMotion ? value : shown

  return (
    <span className={`${styles.number} ${styles[size]}`}>
      <span aria-hidden="true">{formatKc(display)}</span>
      <span className={styles.srOnly} role="status">
        {formatKc(value)}
      </span>
    </span>
  )
}
