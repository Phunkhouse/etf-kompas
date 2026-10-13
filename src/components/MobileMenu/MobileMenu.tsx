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
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const id = useId()

  const show = () => {
    dialog.current?.showModal()
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
        <div className={styles.top}>
          <Wordmark href="/" />
          <button type="button" className={styles.button} onClick={hide}>
            <span className={styles.cross} aria-hidden="true" />
            {menuCopy.close}
          </button>
        </div>
        <nav aria-label={menuCopy.pagesLabel} className={styles.pages}>
          {menuCopy.pages.map((page) => (
            <a key={page.href} href={page.href} onClick={hide}>
              {nbsp(page.label)}
            </a>
          ))}
        </nav>
        <nav aria-label={menuCopy.legalLabel} className={styles.legal}>
          {menuCopy.legal.map((link) => (
            <a key={link.href} href={link.href} onClick={hide}>
              {nbsp(link.label)}
            </a>
          ))}
        </nav>
        <div className={styles.cta}>
          <ButtonLink href={menuCopy.cta.href} fullWidth onClick={hide}>
            {nbsp(menuCopy.cta.label)}
          </ButtonLink>
        </div>
      </dialog>
    </div>
  )
}
