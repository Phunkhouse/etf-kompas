import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { CookieConsent } from '@/components/CookieConsent'
import './reset.css'
import './variables.scss'
import './globals.css'

// Czech needs the latin-ext subset (ě š č ř ž ý á í é ů ú ň ť ď).
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-plex-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: '500',
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ETF Kompas',
  description: 'Srovnání ETF s poplatky v korunách.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: the cookie script sets data-consent on <html>
    // before React hydrates (note 0062).
    <html
      lang="cs"
      className={`${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
