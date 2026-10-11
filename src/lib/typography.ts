const NBSP = ' '

// Czech typography (SPEC §25): a non-breaking space after one-letter
// prepositions and conjunctions (k, s, v, z, o, u, a, i), and between a number
// and its unit. Applied at render time to copy strings.
export function nbsp(text: string): string {
  return text
    .replace(/(?<=(?:^|\s)[ksvzouaiKSVZOUAI]) +(?=\S)/g, NBSP)
    .replace(/(?<=\d) +(?=Kč|%|let\b)/g, NBSP)
}
