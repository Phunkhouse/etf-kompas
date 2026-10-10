import { colors } from '@/styles/colors'
import type { ContrastPair } from '@/styles/contrast-pairs'

function channel(value: number): number {
  const v = value / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

// WCAG 2.x relative luminance of a #RRGGBB colour.
export function luminance(hex: string): number {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) throw new Error(`Invalid colour: ${hex}`)
  const [r, g, b] = [1, 3, 5].map((i) =>
    channel(parseInt(hex.slice(i, i + 2), 16)),
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export type ContrastResult = ContrastPair & { ratio: number; ok: boolean }

export function checkPairs(pairs: ContrastPair[]): ContrastResult[] {
  return pairs.map((pair) => {
    const ratio = contrastRatio(colors[pair.fg], colors[pair.bg])
    return { ...pair, ratio, ok: ratio >= pair.min }
  })
}
