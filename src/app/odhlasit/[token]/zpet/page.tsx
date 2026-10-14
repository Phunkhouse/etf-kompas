import type { Metadata } from 'next'
import { connection } from 'next/server'
import { subscriptionDeps } from '@/app/lead-service'
import { ButtonLink } from '@/components/Button'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { StatusCard } from '@/components/StatusCard'
import { subscribeCopy } from '@/content/copy'
import { checkLink } from '@/server/subscriptions'

export const metadata: Metadata = {
  title: `${subscribeCopy.resubscribed.title} · ETF Kompas`,
  robots: { index: false, follow: false },
}

export const instant = false

// After "Přihlásit zpět". Only looks: opening this page again unsubscribes nobody.
export default async function ResubscribedPage({
  params,
}: PageProps<'/odhlasit/[token]/zpet'>) {
  await connection()
  const { token } = await params
  const state = await checkLink(token, 'unsubscribe', subscriptionDeps())
  const copy = subscribeCopy
  const ok = state.status !== 'invalid'
  return (
    <>
      <SiteHeader base="/" />
      <main>
        <StatusCard
          label={ok ? copy.unsubscribe.label : copy.gone.label}
          title={ok ? copy.resubscribed.title : copy.gone.title}
          text={ok ? copy.resubscribed.text : copy.gone.text}
        >
          <ButtonLink href="/" fullWidth>
            {ok ? copy.resubscribed.back : copy.gone.back}
          </ButtonLink>
        </StatusCard>
      </main>
      <SiteFooter />
    </>
  )
}
