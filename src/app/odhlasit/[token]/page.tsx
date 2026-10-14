import type { Metadata } from 'next'
import { connection } from 'next/server'
import { resubscribeAction } from '@/app/mail-actions'
import { subscriptionDeps } from '@/app/lead-service'
import { Button, ButtonLink } from '@/components/Button'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { StatusCard } from '@/components/StatusCard'
import { subscribeCopy } from '@/content/copy'
import { unsubscribe } from '@/server/subscriptions'

export const metadata: Metadata = {
  title: `${subscribeCopy.unsubscribe.title} · ETF Kompas`,
  robots: { index: false, follow: false },
}

export const instant = false

// The unsubscribe link of every e-mail: opening it unsubscribes, as the drawing says
// ("Odhlášeno"), and "Přihlásit zpět" undoes it. The link never expires.
export default async function UnsubscribePage({
  params,
}: PageProps<'/odhlasit/[token]'>) {
  await connection()
  const { token } = await params
  const result = await unsubscribe(token, subscriptionDeps())
  if (result.status === 'error') throw new Error('unsubscribe failed')
  const copy = subscribeCopy

  return (
    <>
      <SiteHeader base="/" />
      <main>
        {result.status === 'unsubscribed' ? (
          <StatusCard
            label={copy.unsubscribe.label}
            title={copy.unsubscribe.title}
            text={copy.unsubscribe.text}
          >
            <form action={resubscribeAction}>
              <input type="hidden" name="token" value={token} />
              <Button type="submit" fullWidth>
                {copy.unsubscribe.button}
              </Button>
            </form>
          </StatusCard>
        ) : (
          <StatusCard
            label={copy.gone.label}
            title={copy.gone.title}
            text={copy.gone.text}
          >
            <ButtonLink href="/" fullWidth>
              {copy.gone.back}
            </ButtonLink>
          </StatusCard>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
