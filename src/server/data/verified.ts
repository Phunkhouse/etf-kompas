import { TODO_VERIFY } from './todo'

// A value may be shown or used only with a source and evidence (SPEC §18).
// Freshness is the data validator's job, not checked here.
export function isSet(text: string | null | undefined): boolean {
  return typeof text === 'string' && text.trim() !== '' && text !== TODO_VERIFY
}

export function hasSource(record: {
  sourceUrl: string | null
  evidence: string | null
}): boolean {
  return isSet(record.sourceUrl) && isSet(record.evidence)
}
