import type { Metadata } from 'next'
import { connection } from 'next/server'
import { confirmTipsAction } from '@/app/mail-actions'
import { subscriptionDeps } from '@/app/lead-service'
import { Button, ButtonLink } from '@/components/Button'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { StatusCard } from '@/components/StatusCard'
import { subscribeCopy } from '@/content/copy'
import { checkLink, confirmOptIn } from '@/server/subscriptions'

export const metadata: Metadata = {
  title: `${subscribeCopy.confirm.ask.title} · ETF Kompas`,
  robots: { index: false, follow: false },
}

export const instant = false

// The opt-in link of the e-mail (double opt-in for the tips). Opening it only shows a
// button: mail scanners open links, and a visitor must be the one who agrees. The button
// posts the confirmation; the page then says it is done, and keeps saying it.
export default async function ConfirmTipsPage({
  params,
}: PageProps<'/potvrdit/[token]'>) {
  await connection()
  const { token } = await params
  const deps = subscriptionDeps()
  const state = await checkLink(token, 'optin', deps)
  const copy = subscribeCopy

  let card
  if (state.status === 'valid') {
    card = (
      <StatusCard
        label={copy.confirm.label}
        title={copy.confirm.ask.title}
        text={copy.confirm.ask.text}
      >
        <form action={confirmTipsAction}>
          <input type="hidden" name="token" value={token} />
          <Button type="submit" fullWidth>
            {copy.confirm.ask.button}
          </Button>
        </form>
      </StatusCard>
    )
  } else if (state.status === 'confirmed') {
    // "Zpět na srovnání": only hashes of old links are kept, so a fresh link is made.
    const done = await confirmOptIn(token, deps)
    card = (
      <StatusCard
        label={copy.confirm.label}
        title={copy.confirm.done.title}
        text={copy.confirm.done.text}
      >
        <ButtonLink
          href={done.status === 'confirmed' ? done.resultsPath : '/'}
          fullWidth
        >
          {copy.confirm.done.back}
        </ButtonLink>
      </StatusCard>
    )
  } else {
    card = (
      <StatusCard
        label={copy.gone.label}
        title={copy.gone.title}
        text={copy.gone.text}
      >
        <ButtonLink href="/" fullWidth>
          {copy.gone.back}
        </ButtonLink>
      </StatusCard>
    )
  }

  return (
    <>
      <SiteHeader base="/" />
      <main>{card}</main>
      <SiteFooter />
    </>
  )
}
