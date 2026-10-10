import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Reads the raw JSON files from `data/`. Validation happens in validateData.
export async function loadData(dir = path.join(process.cwd(), 'data')) {
  const read = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(dir, file), 'utf8'))
  const [etfs, brokers, sources] = await Promise.all([
    read('etfs.json'),
    read('brokers.json'),
    read('sources.json'),
  ])
  return { etfs, brokers, sources }
}
