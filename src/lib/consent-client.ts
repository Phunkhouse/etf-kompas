// The cookie bar's behaviour, as plain browser code. It is NOT imported by the
// React tree: `CookieConsent` writes `consentClient.toString()` into an inline
// <script>, so no framework JavaScript is needed to ask for or store a choice
// (note 0062, the 150 KB budget). The function must stay self-contained: no
// imports, no outer variables, nothing a compiler would turn into a helper.
//
// It reads the choice cookie and sets `data-consent` on <html> before paint (the
// CSS hides the bar then), handles every `data-consent-action` click by event
// delegation, writes the cookie, and announces a choice with the window event
// `kompas:consent` ({ measurement, advertising }). The format is in `consent.ts`.
export function consentClient(
  cookieName: string,
  version: number,
  maxAge: number,
  settingsId: string,
) {
  const root = document.documentElement
  const pattern = new RegExp(
    '(?:^|;\\s*)' + cookieName + '=v(\\d+)-m([01])-a([01])-\\d+',
  )

  const read = () => {
    const match = pattern.exec(document.cookie)
    if (!match || Number(match[1]) !== version) return null
    return { measurement: match[2] === '1', advertising: match[3] === '1' }
  }

  const settings = () =>
    document.getElementById(settingsId) as HTMLDialogElement | null

  const box = (category: string) =>
    document.querySelector(
      '[data-consent-category="' + category + '"]',
    ) as HTMLInputElement | null

  const save = (measurement: boolean, advertising: boolean) => {
    document.cookie =
      cookieName +
      '=v' +
      version +
      '-m' +
      (measurement ? 1 : 0) +
      '-a' +
      (advertising ? 1 : 0) +
      '-' +
      Math.floor(Date.now() / 1000) +
      '; Max-Age=' +
      maxAge +
      '; Path=/; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '')
    root.setAttribute('data-consent', 'set')
    const dialog = settings()
    if (dialog && dialog.open) dialog.close()
    window.dispatchEvent(
      new CustomEvent('kompas:consent', {
        detail: { measurement, advertising },
      }),
    )
  }

  if (read()) root.setAttribute('data-consent', 'set')

  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest(
      '[data-consent-action]',
    )
    if (!target) return
    const action = target.getAttribute('data-consent-action')
    if (action === 'accept') {
      save(true, true)
    } else if (action === 'reject') {
      save(false, false)
    } else if (action === 'save') {
      const measurement = box('measurement')
      const advertising = box('advertising')
      save(
        !!measurement && measurement.checked,
        !!advertising && advertising.checked,
      )
    } else if (action === 'open') {
      event.preventDefault()
      const dialog = settings()
      if (!dialog) return
      const current = read()
      const measurement = box('measurement')
      const advertising = box('advertising')
      if (measurement) measurement.checked = !!current && current.measurement
      if (advertising) advertising.checked = !!current && current.advertising
      if (!dialog.open) dialog.showModal()
    } else if (action === 'close') {
      const dialog = settings()
      if (dialog && dialog.open) dialog.close()
    }
  })
}
