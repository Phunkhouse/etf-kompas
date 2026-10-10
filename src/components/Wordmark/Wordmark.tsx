import Image from 'next/image'
import styles from './Wordmark.module.scss'

type WordmarkProps = {
  // dark = for dark backgrounds (light lettering)
  tone?: 'light' | 'dark'
  // when set, the logo is a link, for example to "/"
  href?: string
  // load eagerly: set it for the logo in the page header, which is above the fold
  priority?: boolean
}

const sources = {
  light: '/brand/etf-kompas-logo.svg',
  dark: '/brand/etf-kompas-logo-dark.svg',
} as const

// The final logo from public/brand/. Do not redraw or recolour it.
export function Wordmark({ tone = 'light', href, priority }: WordmarkProps) {
  const logo = (
    <Image
      className={styles.logo}
      src={sources[tone]}
      alt="ETF Kompas"
      width={188}
      height={48}
      unoptimized
      priority={priority}
    />
  )
  return href ? (
    <a href={href} className={styles.link}>
      {logo}
    </a>
  ) : (
    logo
  )
}
