import { computeGaps, summarize } from '@/server/data/gaps'
import { loadData } from '@/server/data/load'
import { needs } from '@/server/data/needs'
import { dataSchema } from '@/server/data/schema'

// What the rev. 4 screens still need from data/*.json (see docs/DATA-NEEDS.md).
// Informational: the exit code is 0. `pnpm data:validate` is the deploy gate.
async function main() {
  const data = dataSchema.parse(await loadData())
  const gaps = computeGaps(data, needs)

  let screen = ''
  for (const gap of gaps) {
    if (gap.screen !== screen) {
      screen = gap.screen
      console.log(`\n${screen}`)
    }
    const mark =
      gap.verified === gap.total ? 'ok  ' : gap.inModel ? 'GAP ' : 'NEW '
    console.log(
      `  ${mark} ${String(gap.verified).padStart(2)}/${String(gap.total).padEnd(2)} ${gap.what}`,
    )
    if (gap.missing.length > 0) {
      const shown = gap.missing.slice(0, 12).join(', ')
      const more =
        gap.missing.length > 12 ? ` … +${gap.missing.length - 12}` : ''
      console.log(`           missing: ${shown}${more}`)
    }
  }

  const { total, verified, uniqueMissing, notInModel } = summarize(gaps)
  console.log(
    `\ndata:gaps: ${verified} of ${total} values verified (a value two screens need counts twice)`,
  )
  console.log(
    `To do: ${uniqueMissing} different missing values in the data model, and ${notInModel} values the model has no place for yet (NEW).`,
  )
}

main()
