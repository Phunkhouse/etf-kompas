import { test, expect } from '@playwright/test'
import {
  allow,
  linkIn,
  mailsTo,
  randomEmail,
  randomIp,
  testState,
} from './lead-helpers'

// Phase 4, PR 4: e-mails, double opt-in, unsubscribe and "send the link again"
// (SPEC §22, §26). Written first. The server runs on the in-memory store with a
// recording mailer in sandbox mode: only addresses put on the allowlist by `allow()`
// are "sent" to. Each test is its own visitor.
test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }

async function submit(
  page: import('@playwright/test').Page,
  email: string,
  tips = false,
) {
  await page.goto('/?v=b')
  await page.getByRole('textbox', field).fill(email)
  if (tips)
    await page.getByRole('checkbox', { name: /tip k investování/ }).check()
  await page.getByRole('button', send).click()
}

test.describe('the success state tells the truth about the e-mail', () => {
  test('an allowlisted address: "Odkaz jsme poslali i na …" and a mail with the links', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email)
    await expect(
      page.getByText(`Odkaz jsme poslali i na ${email}.`),
    ).toBeVisible()
    const [mail] = await mailsTo(request, email)
    expect(mail.subject).toBe('Vaše srovnání je připravené')
    await page.goto(linkIn(mail, '/srovnani/'))
    await expect(
      page.getByRole('heading', { level: 1, name: 'Srovnání 5 fondů' }),
    ).toBeVisible()
  })

  test('any other address (sandbox): links are shown, nothing is said about an e-mail, nothing is sent', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await submit(page, email)
    await expect(page.getByText('Hotovo.')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Otevřít srovnání' }),
    ).toBeVisible()
    await expect(page.getByText(/poslali|odeslali/i)).toHaveCount(0)
    expect(await mailsTo(request, email)).toHaveLength(0)
    const lead = (await testState(request)).leads.find((l) => l.email === email)
    expect(lead?.emailStatus).toBe('queued')
  })
})

test.describe('double opt-in for the tips', () => {
  test('opening the link does not confirm; the button does', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email, true)
    const optin = (await mailsTo(request, email)).find(
      (m) => m.subject === 'Potvrďte odběr tipů k investování',
    )!
    const link = linkIn(optin, '/potvrdit/')

    await page.goto(link)
    await expect(
      page.getByRole('button', { name: 'Ano, posílejte mi tipy' }),
    ).toBeVisible()
    let lead = (await testState(request)).leads.find((l) => l.email === email)!
    expect(lead.consentConfirmedAt).toBeNull()

    await page.getByRole('button', { name: 'Ano, posílejte mi tipy' }).click()
    await expect(
      page.getByRole('heading', { name: 'Odběr tipů potvrzen' }),
    ).toBeVisible()
    lead = (await testState(request)).leads.find((l) => l.email === email)!
    expect(lead.consentConfirmedAt).not.toBeNull()

    // "Zpět na srovnání" leads to a comparison that opens
    await page.getByRole('link', { name: 'Zpět na srovnání' }).click()
    await expect(
      page.getByRole('heading', { level: 1, name: 'Srovnání 5 fondů' }),
    ).toBeVisible()
  })

  test('the link opened again shows the confirmed page, and the date does not move', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email, true)
    const optin = (await mailsTo(request, email)).find((m) =>
      /Potvrďte/.test(m.subject),
    )!
    const link = linkIn(optin, '/potvrdit/')
    await page.goto(link)
    await page.getByRole('button', { name: 'Ano, posílejte mi tipy' }).click()
    const first = (await testState(request)).leads.find(
      (l) => l.email === email,
    )!.consentConfirmedAt
    await page.goto(link)
    await expect(
      page.getByRole('heading', { name: 'Odběr tipů potvrzen' }),
    ).toBeVisible()
    const second = (await testState(request)).leads.find(
      (l) => l.email === email,
    )!.consentConfirmedAt
    expect(second).toBe(first)
  })

  test('an altered link says "Tento odkaz už nefunguje" with a way back', async ({
    page,
  }) => {
    await page.goto('/potvrdit/abc.def')
    await expect(
      page.getByRole('heading', { name: 'Tento odkaz už nefunguje' }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Zpět na úvod' }).click()
    await expect(page).toHaveURL('/')
  })

  test('no opt-in e-mail without the tips box', async ({ page, request }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email, false)
    const subjects = (await mailsTo(request, email)).map((m) => m.subject)
    expect(subjects).toEqual(['Vaše srovnání je připravené'])
  })
})

test.describe('unsubscribe', () => {
  test('the link in the e-mail unsubscribes on opening, and "Přihlásit zpět" undoes it', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email)
    const [mail] = await mailsTo(request, email)
    await page.goto(linkIn(mail, '/odhlasit/'))
    await expect(page.getByRole('heading', { name: 'Odhlášeno' })).toBeVisible()
    let lead = (await testState(request)).leads.find((l) => l.email === email)!
    expect(lead.unsubscribedAt).not.toBeNull()

    await page.getByRole('button', { name: 'Přihlásit zpět' }).click()
    await expect(
      page.getByRole('heading', { name: 'Přihlášeno zpět' }),
    ).toBeVisible()
    lead = (await testState(request)).leads.find((l) => l.email === email)!
    expect(lead.unsubscribedAt).toBeNull()
  })

  test('an altered link changes nothing and says the link does not work', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email)
    const [mail] = await mailsTo(request, email)
    await page.goto(`${linkIn(mail, '/odhlasit/')}x`)
    await expect(
      page.getByRole('heading', { name: 'Tento odkaz už nefunguje' }),
    ).toBeVisible()
    const lead = (await testState(request)).leads.find(
      (l) => l.email === email,
    )!
    expect(lead.unsubscribedAt).toBeNull()
  })

  test('the unsubscribe page is out of search engines and caches', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email)
    const [mail] = await mailsTo(request, email)
    const response = await page.goto(linkIn(mail, '/odhlasit/'))
    expect(response!.headers()['x-robots-tag']).toContain('noindex')
    expect(response!.headers()['cache-control']).toContain('private')
  })
})

test.describe('send the link again', () => {
  test('the card on the results page sends a new link to the lead’s own address', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await allow(request, email)
    await submit(page, email)
    const [first] = await mailsTo(request, email)
    await page.goto(linkIn(first, '/srovnani/'))
    await page
      .getByRole('button', { name: 'Poslat odkaz na můj e-mail' })
      .click()
    await expect(page.getByText('Poslali jsme vám nový odkaz.')).toBeVisible()
    const mails = await mailsTo(request, email)
    expect(mails).toHaveLength(2)
    expect(linkIn(mails[1], '/srovnani/')).not.toBe(
      linkIn(mails[0], '/srovnani/'),
    )
  })

  test('in sandbox, for an address that is not allowed, it says it did not send', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await submit(page, email)
    await page.getByRole('link', { name: 'Otevřít srovnání' }).click()
    await page
      .getByRole('button', { name: 'Poslat odkaz na můj e-mail' })
      .click()
    await expect(page.getByText('E-mail jsme neodeslali')).toBeVisible()
    await expect(page.getByText(/Poslali jsme vám/)).toHaveCount(0)
    expect(await mailsTo(request, email)).toHaveLength(0)
  })

  test('a link that does not work has a form, and the answer is the same for an address we know and one we do not', async ({
    page,
    request,
  }) => {
    const known = randomEmail()
    await allow(request, known)
    await submit(page, known)
    const generic =
      'Pokud tento e-mail u nás máme, poslali jsme na něj nový odkaz.'

    await page.goto(`/srovnani/${'A'.repeat(43)}`)
    await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(known)
    await page.getByRole('button', { name: 'Poslat nový odkaz' }).click()
    await expect(page.getByText(generic)).toBeVisible()
    expect(await mailsTo(request, known)).toHaveLength(2)

    const stranger = randomEmail()
    await page.goto(`/srovnani/${'B'.repeat(43)}`)
    await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(stranger)
    await page.getByRole('button', { name: 'Poslat nový odkaz' }).click()
    await expect(page.getByText(generic)).toBeVisible()
    expect(await mailsTo(request, stranger)).toHaveLength(0)
  })

  test('a wrong address on that form is told so', async ({ page }) => {
    await page.goto(`/srovnani/${'A'.repeat(43)}`)
    await page.getByRole('textbox', { name: 'Váš e-mail' }).fill('chyba')
    await page.getByRole('button', { name: 'Poslat nový odkaz' }).click()
    await expect(
      page.getByText('Zadejte e-mail ve tvaru jmeno@domena.cz.'),
    ).toBeVisible()
  })
})
