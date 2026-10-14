import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { CookieConsent } from '@/components/CookieConsent'
import { siteCopy } from '@/content/copy'
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

// The address chats and social feeds need to turn the share image into a full link.
// Set SITE_URL in the build environment (Vercel); the local default is only for dev.
const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000'

// The whole site is out of search engines until the launch gate (SPEC §19.5): this tag
// and the X-Robots-Tag header in next.config.ts say the same thing twice.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteCopy.title,
  description: siteCopy.description,
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: siteCopy.name,
    title: siteCopy.title,
    description: siteCopy.description,
    images: [
      {
        url: '/share-image.png',
        width: 1200,
        height: 630,
        alt: siteCopy.imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteCopy.title,
    description: siteCopy.description,
    images: ['/share-image.png'],
  },
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
