import { describe, expect, test } from 'vitest'
import { siteMetadata } from './siteMetadata'
import { sources } from './sources'

describe('research source registry', () => {
  test('uses unique source IDs and direct URLs', () => {
    const ids = sources.map((source) => source.id)
    const urls = sources.map((source) => source.url)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(urls).size).toBe(urls.length)
  })

  test('uses direct HTTPS source URLs', () => {
    expect(
      sources.every((source) => {
        const url = new URL(source.url)
        return url.protocol === 'https:' && url.search === '' && !url.hostname.includes('google.')
      }),
    ).toBe(true)
  })

  test('records verification dates as YYYY-MM-DD', () => {
    expect(sources.every((source) => /^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn))).toBe(true)
    expect(sources.every((source) => source.verifiedOn === siteMetadata.verifiedOn)).toBe(true)
  })
})
