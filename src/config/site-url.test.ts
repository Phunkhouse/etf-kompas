import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteUrl } from './site-url'

// A bad SITE_URL must never stop the build (found on the first Vercel deploy,
// 2026-10-14: a value that did not parse failed the whole build). Written first.
afterEach(() => vi.restoreAllMocks())

describe('siteUrl', () => {
  it('S-1 uses a good address as it is', () => {
    expect(
      siteUrl({ SITE_URL: 'https://etf-kompas-kappa.vercel.app' }).href,
    ).toBe('https://etf-kompas-kappa.vercel.app/')
  })

  it('S-2 ignores a trailing slash, spaces and a path', () => {
    expect(siteUrl({ SITE_URL: '  https://kompas.test/  ' }).origin).toBe(
      'https://kompas.test',
    )
    expect(siteUrl({ SITE_URL: 'https://kompas.test/a/b' }).origin).toBe(
      'https://kompas.test',
    )
  })

  it('S-3 adds https:// to an address written without it, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(siteUrl({ SITE_URL: 'etf-kompas-kappa.vercel.app' }).origin).toBe(
      'https://etf-kompas-kappa.vercel.app',
    )
    expect(warn).toHaveBeenCalledOnce()
  })

  it('S-4 falls back to localhost for nonsense, with a warning that names the variable and not the value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(siteUrl({ SITE_URL: 'https://' }).origin).toBe(
      'http://localhost:3000',
    )
    expect(siteUrl({ SITE_URL: 'a b c' }).origin).toBe('http://localhost:3000')
    for (const [message] of warn.mock.calls) {
      expect(String(message)).toContain('SITE_URL')
      expect(String(message)).not.toContain('a b c')
    }
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('S-5 an empty or missing value is the local default, without a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(siteUrl({}).origin).toBe('http://localhost:3000')
    expect(siteUrl({ SITE_URL: '' }).origin).toBe('http://localhost:3000')
    expect(warn).not.toHaveBeenCalled()
  })

  it('S-6 never throws', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    for (const value of [
      '',
      ' ',
      '://',
      'http://',
      '\u0000',
      'javascript:alert(1)',
      'ftp://x.y',
    ]) {
      expect(() => siteUrl({ SITE_URL: value })).not.toThrow()
    }
  })

  it('S-7 only http and https are accepted', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(siteUrl({ SITE_URL: 'javascript:alert(1)' }).origin).toBe(
      'http://localhost:3000',
    )
  })
})
