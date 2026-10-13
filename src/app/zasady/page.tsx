import type { Metadata } from 'next'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { legalCopy } from '@/content/copy'

export const metadata: Metadata = {
  title: `${legalCopy.privacy.title} · ETF Kompas`,
}

// The privacy policy: the wireframe's own text with "[doplnit]" gaps, not reviewed
// by a qualified person. Not indexed (the whole site is noindex until launch).
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader base="/" />
      <main>
        <PrivacyPolicy />
      </main>
      <SiteFooter />
    </>
  )
}
