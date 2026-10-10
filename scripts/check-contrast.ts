import { checkPairs } from '@/lib/contrast'
import { contrastPairs } from '@/styles/contrast-pairs'

const results = checkPairs(contrastPairs)

for (const r of results) {
  const label = r.ok ? 'ok  ' : 'FAIL'
  console.log(
    `${label} ${r.ratio.toFixed(2).padStart(5)} (min ${r.min})  ${r.fg} on ${r.bg}  ${r.use}`,
  )
}

const failing = results.filter((r) => !r.ok).length
console.log(
  `\ncontrast:check: ${results.length - failing} ok, ${failing} failing`,
)
process.exit(failing === 0 ? 0 : 1)
