// Whether a broker sells a fund, as far as the data can say (note 0029, SPEC §18):
// a true or false counts only with a source and evidence, never from a missing value.
import type { Broker } from '@/server/data/schema'
import { hasSource } from '@/server/data/verified'

type AvailabilityRecord = Broker['availability'][string]

// A true or false counts only when it has a source and evidence.
export function verifiedValue(
  record: AvailabilityRecord | undefined,
): boolean | null {
  if (!record || typeof record.value !== 'boolean') return null
  return hasSource(record) ? record.value : null
}
