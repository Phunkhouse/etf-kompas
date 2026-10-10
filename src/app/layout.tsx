import type { Metadata } from 'next'
import './reset.css'
import './variables.scss'
import './globals.css'

export const metadata: Metadata = {
  title: 'ETF Kompas',
  description: 'Srovnání ETF s poplatky v korunách.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
