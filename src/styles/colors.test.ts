import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { colors } from './colors'

const scss = readFileSync(
  path.join(process.cwd(), 'src/app/variables.scss'),
  'utf8',
)

function scssColors(): Record<string, string> {
  const found: Record<string, string> = {}
  for (const [, name, value] of scss.matchAll(
    /--color-([a-z-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g,
  )) {
    found[name] = value.toUpperCase()
  }
  return found
}

describe('colour tokens', () => {
  it('colors.ts and variables.scss define the same colours', () => {
    const expected: Record<string, string> = {}
    for (const [name, hex] of Object.entries(colors)) expected[name] = hex
    // --color-focus is an alias, not a palette colour
    const actual = scssColors()
    expect(actual).toEqual(expected)
  })
})
