// Sending e-mail (SPEC §17.15). `Mailer` is the port; `deliver` adds the sandbox rule
// (only the allowlist gets mail, and the answer says so); the Resend adapter uses plain
// `fetch`; the recording mailer is for tests and the e2e run. No imports from next or react.
export type MailMessage = {
  to: string
  subject: string
  html: string
  text: string
  headers?: Record<string, string>
}

export type Mailer = { send(message: MailMessage): Promise<'sent' | 'failed'> }

export type DeliveryMode = { mode: 'live' | 'sandbox'; allowlist: string[] }

export type Delivery = 'sent' | 'skipped' | 'failed'

const normal = (address: string) => address.trim().toLowerCase()

// In sandbox mode only the allowlist is sent to. Anyone else is `skipped`: the mailer
// is not called, so the UI can never claim an e-mail went to them.
export async function deliver(
  mailer: Mailer,
  config: DeliveryMode,
  message: MailMessage,
): Promise<Delivery> {
  if (
    config.mode === 'sandbox' &&
    !config.allowlist.some((entry) => normal(entry) === normal(message.to))
  ) {
    return 'skipped'
  }
  try {
    return await mailer.send(message)
  } catch {
    return 'failed'
  }
}

const SEND_TIMEOUT_MS = 5000

export function createResendMailer(options: {
  apiKey: string
  from: string
  replyTo?: string | null
}): Mailer {
  return {
    async send(message) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${options.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: options.from,
            to: [message.to],
            ...(options.replyTo ? { reply_to: options.replyTo } : {}),
            subject: message.subject,
            html: message.html,
            text: message.text,
            headers: message.headers,
          }),
          signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
          cache: 'no-store',
        })
        // The status only: the answer can echo the address.
        return response.ok ? 'sent' : 'failed'
      } catch {
        return 'failed'
      }
    },
  }
}

export type RecordingMailer = Mailer & {
  // When true, every send fails (tests of the failure path).
  failing: boolean
  sent(): MailMessage[]
}

export function createRecordingMailer(): RecordingMailer {
  const messages: MailMessage[] = []
  const mailer: RecordingMailer = {
    failing: false,
    async send(message) {
      if (mailer.failing) return 'failed'
      messages.push({ ...message })
      return 'sent'
    },
    sent: () => messages.map((message) => ({ ...message })),
  }
  return mailer
}
