import type { ComponentPropsWithoutRef } from 'react'
import styles from './Chip.module.scss'

type ChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
  selected?: boolean
}

// A toggle button in pill shape, for example the 5 / 10 / 20 year choice.
// `selected` is announced through aria-pressed. A group of mutually exclusive
// chips should be wrapped by the caller in role="group" with a label.
export function Chip({
  selected = false,
  type = 'button',
  ...rest
}: ChipProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-pressed={selected}
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
    />
  )
}
