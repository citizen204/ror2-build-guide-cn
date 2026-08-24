import { describe, expect, test, vi } from 'vitest'
import * as assetFetcher from './fetch-assets.mjs'

const { fetchWithRetry } = assetFetcher

function response(status: number, value = '') {
  return { ok: status >= 200 && status < 300, status, value }
}

describe('asset downloader retry policy', () => {
  test('fails a permanent 4xx response without retrying', async () => {
    const fetchImplementation = vi.fn(async () => response(404))
    const wait = vi.fn(async () => undefined)

    const error = await fetchWithRetry('https://example.invalid/missing.png', 'missing asset', {
      fetchImplementation,
      wait,
    }).catch((caught) => caught as Error)

    expect(error.message).toBe('missing asset returned HTTP 404')
    expect(fetchImplementation).toHaveBeenCalledTimes(1)
    expect(wait).not.toHaveBeenCalled()
  })

  test('retries transient HTTP failures with deterministic backoff', async () => {
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(response(503))
      .mockResolvedValueOnce(response(429))
      .mockResolvedValueOnce(response(200, 'downloaded'))
    const wait = vi.fn(async () => undefined)

    const result = await fetchWithRetry('https://example.invalid/icon.png', 'icon', {
      fetchImplementation,
      wait,
      consume: async (current: ReturnType<typeof response>) => current.value,
    })

    expect(result).toBe('downloaded')
    expect(fetchImplementation).toHaveBeenCalledTimes(3)
    expect(wait.mock.calls.map(([milliseconds]) => milliseconds)).toEqual([500, 1_000])
  })

  test('retries transient network failures', async () => {
    const fetchImplementation = vi.fn()
      .mockRejectedValueOnce(new TypeError('connection reset'))
      .mockResolvedValueOnce(response(200, 'recovered'))
    const wait = vi.fn(async () => undefined)

    const result = await fetchWithRetry('https://example.invalid/icon.png', 'icon', {
      fetchImplementation,
      wait,
      consume: async (current: ReturnType<typeof response>) => current.value,
    })

    expect(result).toBe('recovered')
    expect(fetchImplementation).toHaveBeenCalledTimes(2)
    expect(wait).toHaveBeenCalledExactlyOnceWith(500)
  })

  test('retries transient response body read failures inside the retry boundary', async () => {
    const fetchImplementation = vi.fn(async () => response(200, 'decoded'))
    const wait = vi.fn(async () => undefined)
    const consume = vi.fn()
      .mockRejectedValueOnce(new TypeError('truncated body'))
      .mockResolvedValueOnce('decoded')

    const result = await fetchWithRetry('https://example.invalid/icon.png', 'icon', {
      fetchImplementation,
      wait,
      consume,
    })

    expect(result).toBe('decoded')
    expect(fetchImplementation).toHaveBeenCalledTimes(2)
    expect(consume).toHaveBeenCalledTimes(2)
    expect(wait).toHaveBeenCalledExactlyOnceWith(500)
  })

  test('fails after exhausting retries for a persistent transient error', async () => {
    const fetchImplementation = vi.fn(async () => response(503))
    const wait = vi.fn(async () => undefined)

    const error = await fetchWithRetry('https://example.invalid/icon.png', 'icon', {
      fetchImplementation,
      wait,
    }).catch((caught) => caught as Error)

    expect(error.message).toBe('icon returned HTTP 503')
    expect(fetchImplementation).toHaveBeenCalledTimes(4)
    expect(wait.mock.calls.map(([milliseconds]) => milliseconds)).toEqual([500, 1_000, 2_000])
  })
})

describe('canonical asset persistence', () => {
  const asset = { localPath: 'assets/items/example.png', wikiFile: 'Example.png' }
  const canonicalBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4])

  test('exports a reusable verify-or-write helper', () => {
    expect(typeof assetFetcher.verifyOrWriteAsset).toBe('function')
  })

  test('check mode accepts identical canonical bytes without writing', async () => {
    if (typeof assetFetcher.verifyOrWriteAsset !== 'function') return
    const readFileImplementation = vi.fn(async () => canonicalBytes)
    const writeFileImplementation = vi.fn()

    const size = await assetFetcher.verifyOrWriteAsset(asset, canonicalBytes, {
      checkOnly: true,
      publicDirectory: 'C:/public',
      readFileImplementation,
      writeFileImplementation,
    })

    expect(size).toBe(canonicalBytes.length)
    expect(writeFileImplementation).not.toHaveBeenCalled()
  })

  test('check mode rejects local bytes that differ from the current canonical original', async () => {
    if (typeof assetFetcher.verifyOrWriteAsset !== 'function') return
    const readFileImplementation = vi.fn(async () => Buffer.from([...canonicalBytes, 5]))

    await expect(assetFetcher.verifyOrWriteAsset(asset, canonicalBytes, {
      checkOnly: true,
      publicDirectory: 'C:/public',
      readFileImplementation,
    })).rejects.toThrow('differs from the current wiki original')
  })

  test('fetch mode writes the exact verified bytes', async () => {
    if (typeof assetFetcher.verifyOrWriteAsset !== 'function') return
    const mkdirImplementation = vi.fn()
    const writeFileImplementation = vi.fn()

    const size = await assetFetcher.verifyOrWriteAsset(asset, canonicalBytes, {
      publicDirectory: 'C:/public',
      mkdirImplementation,
      writeFileImplementation,
    })

    expect(size).toBe(canonicalBytes.length)
    expect(mkdirImplementation).toHaveBeenCalledOnce()
    expect(writeFileImplementation).toHaveBeenCalledOnce()
    expect(writeFileImplementation.mock.calls[0]?.[1]).toEqual(canonicalBytes)
  })
})
