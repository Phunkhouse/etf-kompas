'use client'

import { useId, useRef, useState } from 'react'
import { ButtonLink } from '@/components/Button'
import { Wordmark } from '@/components/Wordmark'
import { menuCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './MobileMenu.module.scss'

// The phone menu: a "Menu" button and a full-height panel. The panel is the
// browser's own modal <dialog>, which traps focus, closes on Esc and makes the
// page behind inert; the JavaScript only opens and closes it.
export function MobileMenu({ base = '' }: { base?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const id = useId()

  const show = () => {
    const panel = dialog.current
    if (!panel) return
    // The panel starts where the header starts, so the bar above it stays visible
    // and the logo and the button do not move when it opens.
    const header = panel.closest('header')
    const top = Math.max(0, header?.getBoundingClientRect().top ?? 0)
    panel.style.setProperty('--menu-top', `${top}px`)
    panel.showModal()
    setOpen(true)
  }
  // close() fires the "close" event, which sets the state (so Esc works too)
  const hide = () => dialog.current?.close()

  return (
    <div className={styles.menu}>
      <button
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={show}
      >
        <span className={styles.bars} aria-hidden="true" />
        {menuCopy.button}
      </button>
      <dialog
        id={id}
        ref={dialog}
        aria-label={menuCopy.button}
        className={styles.panel}
        onClose={() => setOpen(false)}
      >
        {/* The close button comes first, so the browser focuses it, not the logo.
            The row is reversed in CSS: the logo stays on the left. */}
        <div className={styles.top}>
          <button type="button" className={styles.button} onClick={hide}>
            <span className={styles.cross} aria-hidden="true" />
            {menuCopy.close}
          </button>
          <Wordmark href="/" />
        </div>
        <nav aria-label={menuCopy.pagesLabel} className={styles.pages}>
          {menuCopy.pages.map((page) => (
            <a key={page.href} href={`${base}${page.href}`} onClick={hide}>
              {nbsp(page.label)}
            </a>
          ))}
        </nav>
        <nav aria-label={menuCopy.legalLabel} className={styles.legal}>
          {menuCopy.legal.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-consent-action={link.opensCookies ? 'open' : undefined}
              onClick={hide}
            >
              {nbsp(link.label)}
            </a>
          ))}
        </nav>
        <div className={styles.cta}>
          <ButtonLink
            href={`${base}${menuCopy.cta.href}`}
            fullWidth
            onClick={hide}
          >
            {nbsp(menuCopy.cta.label)}
          </ButtonLink>
        </div>
      </dialog>
    </div>
  )
}
