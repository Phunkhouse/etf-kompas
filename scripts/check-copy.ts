import { checkCopy } from '@/lib/copy-check'
import { copy } from '@/content/copy'
import { loadTickers } from '@/server/data/load'

async function main() {
  const tickers = await loadTickers()
  const issues = checkCopy(copy, { tickers })

  for (const issue of issues) {
    console.log(`FAIL ${issue.rule.padEnd(11)} ${issue.path}  ${issue.message}`)
  }
  console.log(`\ncopy:check: ${issues.length} problem(s)`)
  process.exit(issues.length === 0 ? 0 : 1)
}

main()
