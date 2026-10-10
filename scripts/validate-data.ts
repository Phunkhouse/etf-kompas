import { loadData } from '@/server/data/load'
import { validateData } from '@/server/data/validate'

async function main() {
  const mode = process.argv.includes('--draft') ? 'draft' : 'strict'
  const today = new Date().toISOString().slice(0, 10)

  const result = validateData(await loadData(), { today, mode })

  for (const issue of result.issues) {
    const label = issue.severity === 'error' ? 'ERROR' : 'warn '
    console.log(
      `${label} ${issue.code.padEnd(14)} ${issue.path}  ${issue.message}`,
    )
  }

  const errors = result.issues.filter((i) => i.severity === 'error').length
  const warnings = result.issues.length - errors
  console.log(
    `\ndata:validate (${mode}): ${errors} errors, ${warnings} warnings`,
  )
  process.exit(result.ok ? 0 : 1)
}

main()
