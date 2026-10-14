import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Phase 6, PR 4: the strict data check (no TODO_VERIFY, every value sourced and fresh) is
// the deploy gate of SPEC §19.5 and §22. Written first. These tests only keep the two
// places that enforce it from being removed by accident; the check itself is tested in
// src/server/data/validate.test.ts.
const root = process.cwd()
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

describe('the strict data gate', () => {
  it('G-1 Vercel builds only after the strict data check passes', () => {
    const config = JSON.parse(read('vercel.json')) as { buildCommand?: string }
    expect(config.buildCommand).toBeDefined()
    const steps = config.buildCommand!.split('&&').map((step) => step.trim())
    expect(steps).toContain('pnpm data:validate')
    expect(steps.indexOf('pnpm data:validate')).toBeLessThan(
      steps.indexOf('pnpm build'),
    )
  })

  it('G-2 the strict check is not the draft one', () => {
    const config = JSON.parse(read('vercel.json')) as { buildCommand: string }
    expect(config.buildCommand).not.toContain('--draft')
    expect(config.buildCommand).not.toContain('data:validate:draft')
  })

  it('G-3 CI runs the strict check as its own job on every push to main', () => {
    const workflow = read('.github/workflows/ci.yml')
    const job = workflow.slice(workflow.indexOf('  data-gate:'))
    expect(job).toContain('- run: pnpm data:validate\n')
    expect(job).toMatch(/if:\s*github\.event_name == 'push'/)
  })

  it('G-4 the pull request job still uses the draft check, so data work in progress can be reviewed', () => {
    const workflow = read('.github/workflows/ci.yml')
    const check = workflow.slice(
      workflow.indexOf('  check:'),
      workflow.indexOf('  e2e:'),
    )
    expect(check).toContain('pnpm data:validate:draft')
    expect(check).not.toMatch(/pnpm data:validate\s*$/m)
  })

  it('G-5 the vercel.json crons are kept when the build command is added', () => {
    const config = JSON.parse(read('vercel.json')) as {
      crons: { path: string }[]
    }
    expect(config.crons.map((cron) => cron.path)).toContain('/api/purge')
  })
})
