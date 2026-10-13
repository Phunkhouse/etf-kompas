import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMemoryLeadStore } from './memory-store'

afterEach(() => vi.unstubAllEnvs())

describe('createMemoryLeadStore', () => {
  it('is refused on Vercel, so it cannot hold real leads', () => {
    vi.stubEnv('VERCEL', '1')
    expect(() => createMemoryLeadStore()).toThrow(/Vercel/)
  })

  it('works elsewhere', () => {
    vi.stubEnv('VERCEL', '')
    expect(() => createMemoryLeadStore()).not.toThrow()
  })
})
