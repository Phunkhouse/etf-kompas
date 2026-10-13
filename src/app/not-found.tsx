import { NotFound } from '@/components/NotFound'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

// Any URL that does not exist: a real 404 with a way back.
export default function NotFoundPage() {
  return (
    <>
      <SiteHeader base="/" />
      <main>
        <NotFound />
      </main>
      <SiteFooter />
    </>
  )
}
