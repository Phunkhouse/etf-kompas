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
