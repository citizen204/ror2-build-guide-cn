import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, test, vi } from 'vitest'
import * as assetFetcher from './fetch-assets.mjs'

const { fetchWithRetry } = assetFetcher

function response(status: number, value = '') {
  return {
    ok: status >= 200 && status < 300,
    status,
    value,
    headers: { get: () => null },
    body: { cancel: vi.fn(async () => undefined) },
  }
}

const pngBytes = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(201, 1),
])

function pinnedAsset(localPath = 'assets/items/example.png') {
  return {
    localPath,
    wikiFile: 'Example.png',
    sourcePage: 'https://riskofrain2.wiki.gg/wiki/File:Example.png',
    kind: 'item',
    byteLength: pngBytes.length,
    sha256: createHash('sha256').update(pngBytes).digest('hex'),
  }
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

  test('uses a fresh timeout signal for every attempt through body consumption', async () => {
    const signals: AbortSignal[] = []
    const fetchImplementation = vi.fn(async (_url: string, init: { signal?: AbortSignal }) => {
      if (!init.signal) throw new Error('missing timeout signal')
      signals.push(init.signal)
      return response(200, 'unused')
    })
    const consume = vi.fn(async (_current: ReturnType<typeof response>, signal?: AbortSignal) => {
      if (!signal) throw new Error('missing body timeout signal')
      if (signal.aborted) throw signal.reason
      await new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }))
    })
    const wait = vi.fn(async () => undefined)
    const setTimeoutImplementation = vi.fn((callback: () => void) => {
      queueMicrotask(callback)
      return 1
    })

    const error = await fetchWithRetry('https://example.invalid/hanging.png', 'hanging asset', {
      fetchImplementation,
      consume,
      wait,
      timeoutMs: 5,
      setTimeoutImplementation,
      clearTimeoutImplementation: vi.fn(),
    }).catch((caught) => caught as Error)

    expect(error.name).toBe('TimeoutError')
    expect(fetchImplementation).toHaveBeenCalledTimes(4)
    expect(new Set(signals).size).toBe(4)
    expect(consume).toHaveBeenCalledTimes(4)
  })

  test('honors capped Retry-After on 429 and cancels failed bodies', async () => {
    const tooManyRequests = response(429)
    tooManyRequests.headers.get = (name: string) => name.toLowerCase() === 'retry-after' ? '30' : null
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(tooManyRequests)
      .mockResolvedValueOnce(response(200, 'ok'))
    const wait = vi.fn(async () => undefined)

    await fetchWithRetry('https://example.invalid/rate-limited.png', 'rate limited', {
      fetchImplementation,
      wait,
      consume: async (current: ReturnType<typeof response>) => current.value,
    })

    expect(wait).toHaveBeenCalledExactlyOnceWith(10_000)
    expect(tooManyRequests.body.cancel).toHaveBeenCalledOnce()
  })

  test('honors capped Retry-After on a retried 503 response', async () => {
    const unavailable = response(503)
    unavailable.headers.get = (name: string) => name.toLowerCase() === 'retry-after' ? '30' : null
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(unavailable)
      .mockResolvedValueOnce(response(200, 'ok'))
    const wait = vi.fn(async () => undefined)

    await fetchWithRetry('https://example.invalid/unavailable.png', 'unavailable', {
      fetchImplementation,
      wait,
      consume: async (current: ReturnType<typeof response>) => current.value,
    })

    expect(wait).toHaveBeenCalledExactlyOnceWith(10_000)
  })
})

describe('bounded PNG response consumption', () => {
  function streamedResponse(chunks: Buffer[], headers: Record<string, string> = {}) {
    let index = 0
    const cancel = vi.fn(async () => undefined)
    return {
      headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
      body: {
        cancel,
        getReader: () => ({
          read: vi.fn(async () => index < chunks.length
            ? { done: false, value: chunks[index++] }
            : { done: true, value: undefined }),
          cancel,
        }),
      },
    }
  }

  test('exports a bounded PNG reader', () => {
    expect(typeof assetFetcher.readPngResponse).toBe('function')
  })

  test('rejects a declared Content-Length above the byte ceiling before reading', async () => {
    if (typeof assetFetcher.readPngResponse !== 'function') return
    const current = streamedResponse([], { 'content-type': 'image/png', 'content-length': '11' })

    await expect(assetFetcher.readPngResponse(current, 'large.png', { maxBytes: 10 }))
      .rejects.toThrow('declared Content-Length 11 exceeds 10 bytes')
    expect(current.body.cancel).toHaveBeenCalledOnce()
  })

  test('rejects a streamed body that crosses the byte ceiling', async () => {
    if (typeof assetFetcher.readPngResponse !== 'function') return
    const current = streamedResponse([Buffer.alloc(6), Buffer.alloc(5)], { 'content-type': 'image/png' })

    await expect(assetFetcher.readPngResponse(current, 'large.png', { maxBytes: 10, minBytes: 0 }))
      .rejects.toThrow('streamed body exceeds 10 bytes')
    expect(current.body.cancel).toHaveBeenCalledOnce()
  })

  test('rejects HTML, undersized bodies, and invalid PNG signatures', async () => {
    if (typeof assetFetcher.readPngResponse !== 'function') return
    const html = streamedResponse([pngBytes], { 'content-type': 'text/html' })
    await expect(assetFetcher.readPngResponse(html, 'html.png')).rejects.toThrow('unexpected content type')

    const small = streamedResponse([pngBytes.subarray(0, 200)], { 'content-type': 'image/png' })
    await expect(assetFetcher.readPngResponse(small, 'small.png')).rejects.toThrow('unexpectedly small')

    const invalid = streamedResponse([Buffer.alloc(209)], { 'content-type': 'image/png' })
    await expect(assetFetcher.readPngResponse(invalid, 'invalid.png')).rejects.toThrow('did not return real PNG bytes')
  })

  test('returns an exact PNG within the bounds', async () => {
    if (typeof assetFetcher.readPngResponse !== 'function') return
    const current = streamedResponse([pngBytes.subarray(0, 100), pngBytes.subarray(100)], { 'content-type': 'image/png' })

    await expect(assetFetcher.readPngResponse(current, 'valid.png')).resolves.toEqual(pngBytes)
  })
})

describe('wiki redirect and filesystem containment boundaries', () => {
  test('exports redirect mapping and containment helpers', () => {
    expect(typeof assetFetcher.mapResolvedWikiAssets).toBe('function')
    expect(typeof assetFetcher.resolveContainedAssetPath).toBe('function')
    expect(typeof assetFetcher.assertRealPathContained).toBe('function')
  })

  test('rejects MediaWiki redirect cycles', () => {
    if (typeof assetFetcher.mapResolvedWikiAssets !== 'function') return
    const asset = pinnedAsset()
    const result = {
      query: {
        redirects: [
          { from: 'File:Example.png', to: 'File:Other.png' },
          { from: 'File:Other.png', to: 'File:Example.png' },
        ],
        pages: {},
      },
    }

    expect(() => assetFetcher.mapResolvedWikiAssets([asset], result)).toThrow('MediaWiki redirect cycle')
  })

  test.each([
    'assets/items/../../secret.png',
    'assets/items\\..\\..\\secret.png',
    '../assets/items/secret.png',
  ])('rejects unsafe local path %s', (localPath) => {
    if (typeof assetFetcher.resolveContainedAssetPath !== 'function') return
    expect(() => assetFetcher.resolveContainedAssetPath('C:/public', localPath)).toThrow('Unsafe local asset path')
  })

  test('rejects a symlink-resolved path outside the real root', async () => {
    if (typeof assetFetcher.assertRealPathContained !== 'function') return
    const realpathImplementation = vi.fn(async (path: string) => path.endsWith('public')
      ? 'C:/repository/public'
      : 'C:/outside/escaped.png')

    await expect(assetFetcher.assertRealPathContained(
      'C:/repository/public',
      'C:/repository/public/assets/items/example.png',
      { realpathImplementation },
    )).rejects.toThrow('escapes real root through a symlink')
  })
})

describe('failure-atomic asset transactions', () => {
  function secondPinnedAsset() {
    return {
      ...pinnedAsset('assets/items/second.png'),
      wikiFile: 'Second.png',
      sourcePage: 'https://riskofrain2.wiki.gg/wiki/File:Second.png',
    }
  }

  async function seedRepository() {
    const repositoryDirectory = await mkdtemp(join(tmpdir(), 'ror2-asset-transaction-'))
    const manifest = [pinnedAsset(), secondPinnedAsset()]
    const manifestFile = join(repositoryDirectory, 'src/content/assets.json')
    const originalManifest = `${JSON.stringify(manifest, null, 2)}\n`
    const originalFile = join(repositoryDirectory, 'public/assets/items/original.png')
    await mkdir(dirname(manifestFile), { recursive: true })
    await mkdir(dirname(originalFile), { recursive: true })
    await writeFile(manifestFile, originalManifest)
    await writeFile(originalFile, Buffer.from('original final bytes'))
    return { repositoryDirectory, manifest, manifestFile, originalManifest, originalFile }
  }

  test('exports a staging transaction helper', () => {
    expect(typeof assetFetcher.runAssetTransaction).toBe('function')
  })

  test('a later download failure leaves final assets and manifest unchanged', async () => {
    if (typeof assetFetcher.runAssetTransaction !== 'function') return
    const seeded = await seedRepository()
    try {
      const produceAsset = vi.fn(async (_asset: ReturnType<typeof pinnedAsset>, index: number) => {
        if (index === 1) throw new Error('later download failed')
        return pngBytes
      })

      await expect(assetFetcher.runAssetTransaction(seeded.manifest, {
        repositoryDirectory: seeded.repositoryDirectory,
        produceAsset,
        updateManifest: true,
      })).rejects.toThrow('later download failed')

      await expect(readFile(seeded.originalFile, 'utf8')).resolves.toBe('original final bytes')
      await expect(readFile(seeded.manifestFile, 'utf8')).resolves.toBe(seeded.originalManifest)
      expect((await readdir(seeded.repositoryDirectory)).filter((name) => name.startsWith('.asset-stage-'))).toEqual([])
    } finally {
      await rm(seeded.repositoryDirectory, { recursive: true, force: true })
    }
  })

  test('a swap failure rolls back final assets and manifest', async () => {
    if (typeof assetFetcher.runAssetTransaction !== 'function') return
    const seeded = await seedRepository()
    try {
      const finalAssets = join(seeded.repositoryDirectory, 'public/assets')
      let failedSwap = false
      const renameImplementation = vi.fn(async (source: string, destination: string) => {
        if (!failedSwap && destination === finalAssets && source.includes('.asset-stage-')) {
          failedSwap = true
          throw new Error('swap failed')
        }
        await rename(source, destination)
      })

      await expect(assetFetcher.runAssetTransaction(seeded.manifest, {
        repositoryDirectory: seeded.repositoryDirectory,
        produceAsset: async () => pngBytes,
        updateManifest: true,
        renameImplementation,
      })).rejects.toThrow('swap failed')

      await expect(readFile(seeded.originalFile, 'utf8')).resolves.toBe('original final bytes')
      await expect(readFile(seeded.manifestFile, 'utf8')).resolves.toBe(seeded.originalManifest)
      expect((await readdir(seeded.repositoryDirectory)).filter((name) => name.startsWith('.asset-stage-'))).toEqual([])
    } finally {
      await rm(seeded.repositoryDirectory, { recursive: true, force: true })
    }
  })

  test('a manifest swap failure rolls back newly installed assets', async () => {
    if (typeof assetFetcher.runAssetTransaction !== 'function') return
    const seeded = await seedRepository()
    try {
      let failedManifestSwap = false
      const renameImplementation = vi.fn(async (source: string, destination: string) => {
        if (!failedManifestSwap && destination === seeded.manifestFile && source.includes('.asset-stage-')) {
          failedManifestSwap = true
          throw new Error('manifest swap failed')
        }
        await rename(source, destination)
      })

      await expect(assetFetcher.runAssetTransaction(seeded.manifest, {
        repositoryDirectory: seeded.repositoryDirectory,
        produceAsset: async () => pngBytes,
        updateManifest: true,
        renameImplementation,
      })).rejects.toThrow('manifest swap failed')

      await expect(readFile(seeded.originalFile, 'utf8')).resolves.toBe('original final bytes')
      await expect(readFile(seeded.manifestFile, 'utf8')).resolves.toBe(seeded.originalManifest)
      expect((await readdir(seeded.repositoryDirectory)).filter((name) => name.startsWith('.asset-stage-'))).toEqual([])
    } finally {
      await rm(seeded.repositoryDirectory, { recursive: true, force: true })
    }
  })

  test('normal fetch rejects unpinned bytes before touching final files', async () => {
    if (typeof assetFetcher.runAssetTransaction !== 'function') return
    const seeded = await seedRepository()
    try {
      const driftedBytes = Buffer.concat([pngBytes.subarray(0, -1), Buffer.from([2])])
      await expect(assetFetcher.runAssetTransaction(seeded.manifest, {
        repositoryDirectory: seeded.repositoryDirectory,
        produceAsset: async () => driftedBytes,
      })).rejects.toThrow('does not match pinned SHA-256')

      await expect(readFile(seeded.originalFile, 'utf8')).resolves.toBe('original final bytes')
      await expect(readFile(seeded.manifestFile, 'utf8')).resolves.toBe(seeded.originalManifest)
    } finally {
      await rm(seeded.repositoryDirectory, { recursive: true, force: true })
    }
  })
})

describe('asset CLI mode boundaries', () => {
  function cliOptions(asset = pinnedAsset()) {
    return {
      repositoryDirectory: 'C:/repository',
      manifestFile: 'C:/repository/src/content/assets.json',
      readFileImplementation: vi.fn(async () => JSON.stringify([asset])),
      verifyPinnedAssetSetImplementation: vi.fn(async () => asset.byteLength),
      resolveAllWikiAssetsImplementation: vi.fn(async () => [{ ...asset, downloadUrl: 'https://example.invalid/example.png' }]),
      downloadAssetBytesImplementation: vi.fn(async () => pngBytes),
      runAssetTransactionImplementation: vi.fn(async () => ({ assets: [asset], totalBytes: asset.byteLength })),
      log: vi.fn(),
    }
  }

  test('exports a testable CLI dispatcher', () => {
    expect(typeof assetFetcher.runAssetCli).toBe('function')
  })

  test('ordinary check mode is offline', async () => {
    if (typeof assetFetcher.runAssetCli !== 'function') return
    const options = cliOptions()

    await assetFetcher.runAssetCli(['--check'], options)

    expect(options.verifyPinnedAssetSetImplementation).toHaveBeenCalledOnce()
    expect(options.resolveAllWikiAssetsImplementation).not.toHaveBeenCalled()
    expect(options.downloadAssetBytesImplementation).not.toHaveBeenCalled()
  })

  test('freshness mode reports upstream drift without starting a transaction', async () => {
    if (typeof assetFetcher.runAssetCli !== 'function') return
    const options = cliOptions()
    options.downloadAssetBytesImplementation.mockResolvedValue(
      Buffer.concat([pngBytes.subarray(0, -1), Buffer.from([2])]),
    )

    await expect(assetFetcher.runAssetCli(['--freshness'], options))
      .rejects.toThrow('Upstream drift detected for assets/items/example.png')
    expect(options.runAssetTransactionImplementation).not.toHaveBeenCalled()
  })

  test.each([
    { args: [], updateManifest: false },
    { args: ['--update'], updateManifest: true },
  ])('dispatches $args through the atomic transaction', async ({ args, updateManifest }) => {
    if (typeof assetFetcher.runAssetCli !== 'function') return
    const options = cliOptions()

    await assetFetcher.runAssetCli(args, options)

    expect(options.runAssetTransactionImplementation).toHaveBeenCalledOnce()
    expect(options.runAssetTransactionImplementation.mock.calls[0]?.[1]).toMatchObject({ updateManifest })
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
      realpathImplementation: vi.fn(async (path: string) => path),
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
      realpathImplementation: vi.fn(async (path: string) => path),
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
      realpathImplementation: vi.fn(async (path: string) => path),
    })

    expect(size).toBe(canonicalBytes.length)
    expect(mkdirImplementation).toHaveBeenCalledOnce()
    expect(writeFileImplementation).toHaveBeenCalledOnce()
    expect(writeFileImplementation.mock.calls[0]?.[1]).toEqual(canonicalBytes)
  })
})

describe('offline pinned asset verification', () => {
  test('exports an offline exact-set verifier', () => {
    expect(typeof assetFetcher.verifyPinnedAssetSet).toBe('function')
  })

  test('accepts the exact pinned file set without network access', async () => {
    if (typeof assetFetcher.verifyPinnedAssetSet !== 'function') return
    const directory = await mkdtemp(join(tmpdir(), 'ror2-assets-check-'))
    try {
      const asset = pinnedAsset()
      const filePath = join(directory, asset.localPath)
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, pngBytes)

      await expect(assetFetcher.verifyPinnedAssetSet([asset], { publicDirectory: directory }))
        .resolves.toBe(pngBytes.length)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  test('rejects unpinned files on disk', async () => {
    if (typeof assetFetcher.verifyPinnedAssetSet !== 'function') return
    const directory = await mkdtemp(join(tmpdir(), 'ror2-assets-check-'))
    try {
      const asset = pinnedAsset()
      const filePath = join(directory, asset.localPath)
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, pngBytes)
      await writeFile(join(dirname(filePath), 'extra.png'), pngBytes)

      await expect(assetFetcher.verifyPinnedAssetSet([asset], { publicDirectory: directory }))
        .rejects.toThrow('Unpinned files on disk: assets/items/extra.png')
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  test('rejects bytes that do not match the pinned hash', async () => {
    if (typeof assetFetcher.verifyPinnedAssetSet !== 'function') return
    const directory = await mkdtemp(join(tmpdir(), 'ror2-assets-check-'))
    try {
      const asset = pinnedAsset()
      const filePath = join(directory, asset.localPath)
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, Buffer.concat([pngBytes.subarray(0, -1), Buffer.from([2])]))

      await expect(assetFetcher.verifyPinnedAssetSet([asset], { publicDirectory: directory }))
        .rejects.toThrow('does not match pinned SHA-256')
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })
})
