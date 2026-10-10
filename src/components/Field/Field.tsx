import { useId, type ComponentPropsWithoutRef } from 'react'
import styles from './Field.module.scss'

type FieldProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'className' | 'id' | 'aria-describedby' | 'aria-invalid'
> & {
  label: string
  // Short help under the field
  hint?: string
  // Error text. When set the field is marked invalid and the text is announced.
  error?: string
}

// Text field with a visible label, optional hint and error. For light surfaces.
export function Field({
  label,
  hint,
  error,
  type = 'text',
  ...rest
}: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') ||
    undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        {...rest}
        id={id}
        type={type}
        className={styles.input}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      />
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
