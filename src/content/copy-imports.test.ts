import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// App code imports the section of the copy it needs (`calculatorCopy`, not
// `copy`), so a client bundle takes only its own strings. The whole `copy` object
// is for the copy checker and its tests (note 0034, the JS budget).
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

describe('copy imports', () => {
  it('no app file imports the whole copy object', () => {
    const offenders = sourceFiles('src')
      .filter((file) => !/\.test\.tsx?$/.test(file))
      .filter((file) => !file.endsWith('content/copy.ts'))
      .filter((file) =>
        /import\s*\{[^}]*\bcopy\b[^}]*\}\s*from\s*'@\/content\/copy'/.test(
          readFileSync(file, 'utf8'),
        ),
      )
    expect(offenders).toEqual([])
  })
})
