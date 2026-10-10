import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import styles from './Button.module.scss'

type Shared = {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'sm'
  fullWidth?: boolean
  children: ReactNode
}

function classNames({ variant = 'primary', size = 'md', fullWidth }: Shared) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonProps = Shared &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
    // Shows the busy state and blocks clicks. Put the busy text in children, for example "Počítám…".
    loading?: boolean
  }

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={classNames({ variant, size, fullWidth, children })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  )
}

type ButtonLinkProps = Shared &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children' | 'href'> & {
    href: string
  }

// A link that looks like a button, for anchors such as "#calc".
export function ButtonLink({
  variant,
  size,
  fullWidth,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a {...rest} className={classNames({ variant, size, fullWidth, children })}>
      {children}
    </a>
  )
}
