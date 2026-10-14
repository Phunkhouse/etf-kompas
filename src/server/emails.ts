// The e-mails (SPEC §3.5, wireframe B "After submit and e-mail"): plain, one column,
// readable on a phone, with a text version. No images, so no tracking pixel, and no link
// to any host but ours. Pure: no imports from next or react.
import { emailCopy, shellCopy } from '@/content/copy'
import { site } from '@/config/site'
import { formatKc } from '@/lib/format'

export type EmailContent = {
  subject: string
  html: string
  text: string
  headers: Record<string, string>
}

type Footer = {
  unsubscribeUrl: string
  privacyUrl: string
  controller: string
}

const text = emailCopy

const INK = '#16150f'
const PAPER = '#f6f3ec'
const MUTED = '#6b665a'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function button(href: string, label: string, filled: boolean): string {
  const style = filled
    ? `background:${INK};color:#ffffff;border:2px solid ${INK}`
    : `background:#ffffff;color:${INK};border:2px solid ${INK}`
  return `<a href="${escapeHtml(href)}" style="display:block;padding:16px 20px;border-radius:8px;font-weight:700;font-size:17px;text-align:center;text-decoration:none;${style}">${escapeHtml(label)}</a>`
}

function page(
  title: string,
  intro: string,
  blocks: string,
  note: string,
  footer: Footer,
): string {
  return `<!doctype html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:${INK}">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#ffffff;border-radius:10px;padding:28px 24px">
<p style="margin:0 0 20px;font-size:20px;font-weight:700;font-family:Georgia,serif">${escapeHtml(site.name)}</p>
<h1 style="margin:0 0 12px;font-size:26px;line-height:1.2">${escapeHtml(title)}</h1>
<p style="margin:0 0 20px;font-size:17px;line-height:1.5">${escapeHtml(intro)}</p>
${blocks}
<p style="margin:20px 0 0;font-size:15px;line-height:1.5;color:${MUTED}">${escapeHtml(note)}</p>
</div>
<div style="padding:18px 8px;font-size:13px;line-height:1.5;color:${MUTED}">
<p style="margin:0 0 6px">${escapeHtml(text.footer.controller(footer.controller))} ${escapeHtml(shellCopy.footer.testNotice)}</p>
<p style="margin:0"><a href="${escapeHtml(footer.privacyUrl)}" style="color:${MUTED}">${escapeHtml(text.footer.privacy)}</a> · <a href="${escapeHtml(footer.unsubscribeUrl)}" style="color:${MUTED}">${escapeHtml(text.footer.unsubscribe)}</a></p>
</div>
</div>
</body>
</html>`
}

function footerText(footer: Footer): string {
  return [
    text.footer.controller(footer.controller),
    shellCopy.footer.testNotice,
    `${text.footer.privacy}: ${footer.privacyUrl}`,
    `${text.footer.unsubscribe}: ${footer.unsubscribeUrl}`,
  ].join('\n')
}

const headers = (unsubscribeUrl: string) => ({
  'List-Unsubscribe': `<${unsubscribeUrl}>`,
})

export function kompasEmail(
  input: Footer & {
    monthly: number
    years: number
    resultsUrl: string
    pdfUrl: string
  },
): EmailContent {
  const copy = text.kompas
  const intro = copy.intro(formatKc(input.monthly), input.years)
  return {
    subject: copy.subject,
    html: page(
      copy.heading,
      intro,
      `<div style="margin:0 0 12px">${button(input.resultsUrl, copy.open, true)}</div><div>${button(input.pdfUrl, copy.pdf, false)}</div>`,
      copy.validity,
      input,
    ),
    text: [
      copy.heading,
      '',
      intro,
      '',
      `${copy.open}: ${input.resultsUrl}`,
      `${copy.pdf}: ${input.pdfUrl}`,
      '',
      copy.validity,
      '',
      footerText(input),
    ].join('\n'),
    headers: headers(input.unsubscribeUrl),
  }
}

export function optInEmail(
  input: Footer & { confirmUrl: string },
): EmailContent {
  const copy = text.optIn
  return {
    subject: copy.subject,
    html: page(
      copy.heading,
      copy.intro,
      button(input.confirmUrl, copy.button, true),
      copy.note,
      input,
    ),
    text: [
      copy.heading,
      '',
      copy.intro,
      '',
      `${copy.button}: ${input.confirmUrl}`,
      '',
      copy.note,
      '',
      footerText(input),
    ].join('\n'),
    headers: headers(input.unsubscribeUrl),
  }
}
