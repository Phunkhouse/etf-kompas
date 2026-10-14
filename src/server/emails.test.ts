import { describe, expect, it } from 'vitest'
import { checkCopy } from '@/lib/copy-check'
import { kompasEmail, optInEmail } from './emails'

// Phase 4, PR 4: test cases E-4 and E-5 (the content) of docs/PHASE-4-PLAN.md.
// Written first.
const BASE = {
  resultsUrl: 'https://kompas.test/srovnani/TOKEN',
  pdfUrl: 'https://kompas.test/srovnani/TOKEN/pdf',
  unsubscribeUrl: 'https://kompas.test/odhlasit/SIGNED',
  privacyUrl: 'https://kompas.test/zasady',
  controller: '[SPRÁVCE] – [IČO], [adresa]',
}
const flat = (text: string) => text.replace(/\s/g, ' ')
const kompas = () => kompasEmail({ ...BASE, monthly: 3000, years: 10 })
const optin = () =>
  optInEmail({
    confirmUrl: 'https://kompas.test/potvrdit/SIGNED2',
    unsubscribeUrl: BASE.unsubscribeUrl,
    privacyUrl: BASE.privacyUrl,
    controller: BASE.controller,
  })

describe('the Kompas e-mail', () => {
  it('has a plain Czech subject', () => {
    expect(kompas().subject).toBe('Vaše srovnání je připravené')
  })

  it('has the comparison link, the PDF link, the controller, the test-project line and the unsubscribe link in the HTML and in the text', () => {
    const { html, text } = kompas()
    for (const part of [html, text]) {
      expect(part).toContain(BASE.resultsUrl)
      expect(part).toContain(BASE.pdfUrl)
      expect(part).toContain(BASE.unsubscribeUrl)
      expect(part).toContain(BASE.privacyUrl)
      expect(part).toContain(BASE.controller)
      expect(flat(part)).toContain('Zkušební projekt')
      expect(flat(part)).toContain('Odkaz platí 30 dní.')
    }
  })

  it('names the setup the comparison was made for', () => {
    expect(flat(kompas().text)).toContain('3 000 Kč měsíčně')
    expect(flat(kompas().text)).toContain('10 let')
  })

  it('has the List-Unsubscribe header with the unsubscribe link', () => {
    expect(kompas().headers['List-Unsubscribe']).toBe(
      `<${BASE.unsubscribeUrl}>`,
    )
  })

  it('has no tracking pixel and no image or link from another host', () => {
    const { html } = kompas()
    expect(html).not.toMatch(/<img/i)
    const hosts = [...html.matchAll(/https?:\/\/([^/"'\s<>)]+)/g)].map(
      (m) => m[1],
    )
    for (const host of hosts) expect(host).toBe('kompas.test')
  })

  it('has the same links in the text as in the HTML', () => {
    const urls = (s: string) =>
      [...new Set(s.match(/https:\/\/kompas\.test[^\s"'<>)]*/g))].sort()
    expect(urls(kompas().text)).toEqual(urls(kompas().html))
  })

  it('is plain and readable on a phone: one column, no table layout width over 600 px', () => {
    const { html } = kompas()
    expect(html).toMatch(/max-width:\s*(5\d\d|600)px/)
    expect(html).toContain('lang="cs"')
  })

  it('passes the same text rules as the page copy', () => {
    const { subject, text } = kompas()
    expect(checkCopy({ mail: { subject, text } }, { tickers: [] })).toEqual([])
  })
})

describe('the opt-in e-mail (as drawn)', () => {
  it('has the drawn subject, heading and button', () => {
    const { subject, html, text } = optin()
    expect(subject).toBe('Potvrďte odběr tipů k investování')
    expect(html).toContain('Potvrďte odběr tipů')
    expect(html).toContain('Ano, posílejte mi tipy')
    expect(text).toContain('https://kompas.test/potvrdit/SIGNED2')
    expect(html).toContain('https://kompas.test/potvrdit/SIGNED2')
  })

  it('says the comparison does not depend on it, and that ignoring it changes nothing', () => {
    const text = flat(optin().text)
    expect(text).toContain('Srovnání už máte')
    expect(text).toContain('e-mail ignorujte a nic se nestane')
  })

  it('has the controller, the privacy link and the unsubscribe link', () => {
    const { html, text, headers } = optin()
    for (const part of [html, text]) {
      expect(part).toContain(BASE.controller)
      expect(part).toContain(BASE.privacyUrl)
      expect(part).toContain(BASE.unsubscribeUrl)
    }
    expect(headers['List-Unsubscribe']).toBe(`<${BASE.unsubscribeUrl}>`)
  })

  it('has no tracking pixel', () => {
    expect(optin().html).not.toMatch(/<img/i)
  })
})
