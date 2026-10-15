const NBSP = ' '

const number = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })

// 12480 -> "12 480 Kč" with non-breaking spaces (SPEC §21). Rounds to whole Kč.
export function formatKc(amount: number): string {
  return `${number.format(amount).replace(/\s/g, NBSP)}${NBSP}Kč`
}

// 0.07 -> "0,07 %" (decimal comma, non-breaking space before the sign).
export function formatPercent(value: number, fractionDigits = 2): string {
  const text = new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
  return `${text.replace(/\s/g, NBSP)}${NBSP}%`
}

// "2026-06-30" -> "6. 2026" (month and year, no leading zero, non-breaking space).
export function formatMonthYear(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(isoDate)
  if (!match) throw new Error(`Not an ISO date: ${isoDate}`)
  return `${Number(match[2])}.${NBSP}${match[1]}`
}

// "2026-10-06" -> "6. 10. 2026", keeping the date together on one line.
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) throw new Error(`Not an ISO date: ${isoDate}`)
  return `${Number(match[3])}.${NBSP}${Number(match[2])}.${NBSP}${match[1]}`
}
