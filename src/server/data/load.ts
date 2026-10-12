import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

// Reads the raw JSON files from `data/`. Validation happens in validateData.
export async function loadData(dir = path.join(process.cwd(), 'data')) {
  const read = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(dir, file), 'utf8'))
  const [etfs, brokers, sources, rates] = await Promise.all([
    read('etfs.json'),
    read('brokers.json'),
    read('sources.json'),
    read('rates.json'),
  ])
  return { etfs, brokers, sources, rates }
}

// The fund tickers, for the copy checker (SPEC §25 rule d).
export async function loadTickers(dir?: string): Promise<string[]> {
  const { etfs } = await loadData(dir)
  return z
    .array(z.object({ ticker: z.string().min(1) }))
    .parse(etfs)
    .map((etf) => etf.ticker)
}
