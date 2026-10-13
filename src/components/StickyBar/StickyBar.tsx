'use client'

import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/Button'
import { stickyBarCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './StickyBar.module.scss'

// The bar at the bottom of a phone. It appears once the hero button has scrolled
// out of view, and goes away while the form is in view, because its button would
// point at what is already on screen. It starts hidden, so it cannot cover the
// hero button on a 375 x 667 screen. Where IntersectionObserver is missing it
// simply never shows.
export function StickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const hero = document.getElementById('hero-cta')
    const form = document.getElementById('formular')
    if (!hero || !form) return

    const on = { hero: true, form: false }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) on.hero = entry.isIntersecting
        if (entry.target === form) on.form = entry.isIntersecting
      }
      setVisible(!on.hero && !on.form)
    })
    observer.observe(hero)
    observer.observe(form)
    return () => observer.disconnect()
  }, [])

  return (
    <div data-sticky-bar className={styles.bar} hidden={!visible}>
      <ButtonLink href="#formular" fullWidth>
        {nbsp(stickyBarCopy.cta)}
      </ButtonLink>
    </div>
  )
}
