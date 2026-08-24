import { createHash } from 'node:crypto'
import { lstat, mkdir, mkdtemp, readdir, readFile, realpath, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const WIKI_API = 'https://riskofrain2.wiki.gg/api.php'
const USER_AGENT = 'RoR2BuildGuideAssetFetcher/1.0 (local attributed assets; contact via repository maintainers)'
const RETRY_DELAYS_MS = [500, 1_000, 2_000]
const REQUEST_TIMEOUT_MS = 15_000
const MAX_RETRY_AFTER_MS = 10_000
const MAX_PNG_BYTES = 5 * 1024 * 1024 // Game icons are tiny; 5 MiB bounds corrupt or hostile responses.
const API_BATCH_SIZE = 40
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '..')
const publicRoot = resolve(repositoryRoot, 'public')

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))
}

async function cancelResponseBody(response) {
  try {
    await response?.body?.cancel?.()
  } catch {
    // Cancellation is best-effort after a response has already failed validation.
  }
}

function isTransientFailure(error) {
  return error instanceof TypeError || error?.name === 'AbortError' || error?.name === 'TimeoutError'
}

function retryAfterMilliseconds(response, fallback, now = Date.now()) {
  const header = response.headers?.get?.('retry-after')
  if (!header) return fallback
  const seconds = Number(header)
  const parsed = Number.isFinite(seconds)
    ? seconds * 1_000
    : Date.parse(header) - now
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return Math.min(parsed, MAX_RETRY_AFTER_MS)
}

export async function fetchWithRetry(url, label, options = {}) {
  const fetchImplementation = options.fetchImplementation ?? fetch
  const wait = options.wait ?? delay
  const consume = options.consume ?? (async (response) => response)
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS
  const setTimeoutImplementation = options.setTimeoutImplementation ?? setTimeout
  const clearTimeoutImplementation = options.clearTimeoutImplementation ?? clearTimeout
  const now = options.now ?? Date.now

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController()
    const timeoutError = new DOMException(`${label} timed out after ${timeoutMs}ms`, 'TimeoutError')
    const timeout = setTimeoutImplementation(() => controller.abort(timeoutError), timeoutMs)
    let response
    let retryDelay
    try {
      response = await fetchImplementation(url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal,
      })
      if (!response.ok) {
        await cancelResponseBody(response)
        const transientHttpFailure = response.status === 429 || response.status >= 500
        const error = new Error(`${label} returned HTTP ${response.status}`)
        if (!transientHttpFailure || attempt === RETRY_DELAYS_MS.length) throw error
        retryDelay = response.status === 429 || response.headers?.get?.('retry-after')
          ? retryAfterMilliseconds(response, RETRY_DELAYS_MS[attempt], now())
          : RETRY_DELAYS_MS[attempt]
      } else {
        return await consume(response, controller.signal)
      }
    } catch (error) {
      await cancelResponseBody(response)
      if (!isTransientFailure(error) || attempt === RETRY_DELAYS_MS.length) throw error
      retryDelay = RETRY_DELAYS_MS[attempt]
    } finally {
      clearTimeoutImplementation(timeout)
    }

    await wait(retryDelay)
  }

  throw new Error(`${label} exhausted retries`)
}

export async function readPngResponse(response, label, options = {}) {
  const maxBytes = options.maxBytes ?? MAX_PNG_BYTES
  const minBytes = options.minBytes ?? 200
  const contentType = response.headers?.get?.('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('image/png')) {
    await cancelResponseBody(response)
    throw new Error(`${label} returned unexpected content type: ${contentType}`)
  }

  const declaredLengthHeader = response.headers?.get?.('content-length')
  const declaredLength = declaredLengthHeader === null || declaredLengthHeader === undefined
    ? undefined
    : Number(declaredLengthHeader)
  if (declaredLength !== undefined && (!Number.isSafeInteger(declaredLength) || declaredLength < 0)) {
    await cancelResponseBody(response)
    throw new Error(`${label} returned invalid Content-Length: ${declaredLengthHeader}`)
  }
  if (declaredLength !== undefined && declaredLength > maxBytes) {
    await cancelResponseBody(response)
    throw new Error(`${label} declared Content-Length ${declaredLength} exceeds ${maxBytes} bytes`)
  }
  if (!response.body?.getReader) throw new Error(`${label} returned no readable body`)

  const reader = response.body.getReader()
  const chunks = []
  let totalBytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = Buffer.from(value)
    totalBytes += chunk.length
    if (totalBytes > maxBytes) {
      await reader.cancel()
      throw new Error(`${label} streamed body exceeds ${maxBytes} bytes`)
    }
    chunks.push(chunk)
  }
  if (declaredLength !== undefined && totalBytes !== declaredLength) {
    throw new Error(`${label} body length ${totalBytes} does not match Content-Length ${declaredLength}`)
  }

  const bytes = Buffer.concat(chunks, totalBytes)
  if (bytes.length <= minBytes) throw new Error(`${label} is unexpectedly small (${bytes.length} bytes)`)
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${label} did not return real PNG bytes`)
  }
  return bytes
}

export function resolveContainedAssetPath(root, localPath) {
  const safeAssetPath = /^assets\/(?:items|survivors)\/[a-z0-9]+(?:-[a-z0-9]+)*\.png$/
    .test(localPath)
    || /^assets\/skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.png$/
      .test(localPath)
  if (!safeAssetPath || localPath.includes('\\')) throw new Error(`Unsafe local asset path: ${localPath}`)

  const resolvedRoot = resolve(root)
  const candidate = resolve(resolvedRoot, localPath)
  const relativePath = relative(resolvedRoot, candidate)
  if (!relativePath || relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error(`Unsafe local asset path: ${localPath}`)
  }
  return candidate
}

export async function assertRealPathContained(root, candidate, options = {}) {
  const realpathImplementation = options.realpathImplementation ?? realpath
  const [realRoot, realCandidate] = await Promise.all([
    realpathImplementation(resolve(root)),
    realpathImplementation(resolve(candidate)),
  ])
  const relativePath = relative(realRoot, realCandidate)
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error(`${candidate} escapes real root through a symlink`)
  }
  return realCandidate
}

function validateManifest(manifest, options = {}) {
  const publicDirectory = options.publicDirectory ?? publicRoot
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('Asset manifest must be a non-empty array')
  }

  const localPaths = new Set()
  const sourceIdentities = new Set()
  for (const asset of manifest) {
    if (!asset || typeof asset !== 'object') throw new Error('Asset manifest contains a non-object record')
    if (!['survivor', 'skill', 'item'].includes(asset.kind)) throw new Error(`Invalid asset kind for ${asset.localPath}`)
    if (typeof asset.wikiFile !== 'string' || !asset.wikiFile.trim()) throw new Error(`Missing wikiFile for ${asset.localPath}`)
    if (!Number.isSafeInteger(asset.byteLength) || asset.byteLength <= 200) throw new Error(`Invalid byteLength for ${asset.localPath}`)
    if (typeof asset.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(asset.sha256)) throw new Error(`Invalid sha256 for ${asset.localPath}`)

    const sourceUrl = new URL(asset.sourcePage)
    if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'riskofrain2.wiki.gg') {
      throw new Error(`Invalid sourcePage for ${asset.localPath}`)
    }
    if (typeof asset.localPath !== 'string') throw new Error(`Invalid localPath: ${asset.localPath}`)
    resolveContainedAssetPath(publicDirectory, asset.localPath)
    if (localPaths.has(asset.localPath)) throw new Error(`Duplicate localPath: ${asset.localPath}`)

    const sourceIdentity = asset.wikiFile.trim().toLocaleLowerCase('en-US')
    if (sourceIdentities.has(sourceIdentity)) throw new Error(`Duplicate wikiFile source identity: ${asset.wikiFile}`)
    localPaths.add(asset.localPath)
    sourceIdentities.add(sourceIdentity)
  }
}

async function listPhysicalFiles(directory, root = directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listPhysicalFiles(entryPath, root))
    else files.push(relative(root, entryPath).split(sep).join('/'))
  }
  return files
}

export async function verifyPinnedAssetSet(manifest, options = {}) {
  const publicDirectory = resolve(options.publicDirectory ?? publicRoot)
  validateManifest(manifest, { publicDirectory })
  const expectedPaths = manifest.map((asset) => asset.localPath).sort()
  const actualPaths = (await listPhysicalFiles(resolve(publicDirectory, 'assets'), publicDirectory)).sort()
  const expectedSet = new Set(expectedPaths)
  const actualSet = new Set(actualPaths)
  const extras = actualPaths.filter((localPath) => !expectedSet.has(localPath))
  const missing = expectedPaths.filter((localPath) => !actualSet.has(localPath))
  if (extras.length > 0) throw new Error(`Unpinned files on disk: ${extras.join(', ')}`)
  if (missing.length > 0) throw new Error(`Missing pinned files: ${missing.join(', ')}`)

  let totalBytes = 0
  for (const asset of manifest) {
    const filePath = resolveContainedAssetPath(publicDirectory, asset.localPath)
    await assertRealPathContained(publicDirectory, filePath)
    const bytes = await readFile(filePath)
    if (bytes.length !== asset.byteLength) throw new Error(`${asset.localPath} does not match pinned byteLength`)
    if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) throw new Error(`${asset.localPath} is not a real PNG`)
    const sha256 = createHash('sha256').update(bytes).digest('hex')
    if (sha256 !== asset.sha256) throw new Error(`${asset.localPath} does not match pinned SHA-256`)
    totalBytes += bytes.length
  }
  return totalBytes
}

export function mapResolvedWikiAssets(assets, result) {
  const requestedTitles = assets.map((asset) => `File:${asset.wikiFile}`)
  const titleChanges = new Map(
    [...(result.query?.normalized ?? []), ...(result.query?.redirects ?? [])]
      .map((change) => [change.from, change.to]),
  )
  const pages = new Map(Object.values(result.query?.pages ?? {}).map((page) => [page.title, page]))

  return assets.map((asset, index) => {
    let resolvedTitle = requestedTitles[index]
    const seenTitles = new Set()
    while (titleChanges.has(resolvedTitle)) {
      if (seenTitles.has(resolvedTitle)) throw new Error(`MediaWiki redirect cycle for ${asset.wikiFile}`)
      seenTitles.add(resolvedTitle)
      resolvedTitle = titleChanges.get(resolvedTitle)
    }
    const page = pages.get(resolvedTitle)
    const image = page?.imageinfo?.[0]
    if (!page || 'missing' in page || !image) throw new Error(`Missing declared wiki file: ${asset.wikiFile}`)
    if (resolvedTitle !== `File:${asset.wikiFile}`) {
      throw new Error(`Manifest wikiFile is not canonical: ${asset.wikiFile} resolves to ${resolvedTitle.slice(5)}`)
    }
    if (image.mime !== 'image/png') throw new Error(`${asset.wikiFile} is ${image.mime ?? 'an unknown format'}, not image/png`)
    if (image.descriptionurl !== asset.sourcePage) {
      throw new Error(`Outdated sourcePage for ${asset.wikiFile}: expected ${image.descriptionurl}`)
    }
    if (!image.url?.startsWith('https://')) throw new Error(`Missing HTTPS original URL for ${asset.wikiFile}`)
    return { ...asset, downloadUrl: image.url }
  })
}

async function resolveWikiBatch(assets) {
  const requestedTitles = assets.map((asset) => `File:${asset.wikiFile}`)
  const parameters = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    redirects: '1',
    titles: requestedTitles.join('|'),
    origin: '*',
  })
  const result = await fetchWithRetry(`${WIKI_API}?${parameters}`, 'wiki.gg API', {
    consume: async (response) => {
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('json')) throw new Error(`wiki.gg API returned unexpected content type: ${contentType}`)
      return response.json()
    },
  })
  if (result.error) throw new Error(`wiki.gg API error: ${result.error.info ?? result.error.code}`)

  return mapResolvedWikiAssets(assets, result)
}

export async function resolveAllWikiAssets(manifest) {
  const resolvedAssets = []
  for (let offset = 0; offset < manifest.length; offset += API_BATCH_SIZE) {
    resolvedAssets.push(...await resolveWikiBatch(manifest.slice(offset, offset + API_BATCH_SIZE)))
  }
  return resolvedAssets
}

export async function verifyOrWriteAsset(asset, canonicalBytes, options = {}) {
  const checkOnly = options.checkOnly ?? false
  const publicDirectory = options.publicDirectory ?? publicRoot
  const readFileImplementation = options.readFileImplementation ?? readFile
  const mkdirImplementation = options.mkdirImplementation ?? mkdir
  const writeFileImplementation = options.writeFileImplementation ?? writeFile
  const outputPath = resolveContainedAssetPath(publicDirectory, asset.localPath)

  if (checkOnly) {
    let localBytes
    try {
      await assertRealPathContained(publicDirectory, outputPath, {
        realpathImplementation: options.realpathImplementation,
      })
      localBytes = await readFileImplementation(outputPath)
    } catch (error) {
      throw new Error(`Missing local asset for ${asset.wikiFile}`, { cause: error })
    }
    if (!Buffer.from(localBytes).equals(canonicalBytes)) {
      throw new Error(`${asset.localPath} differs from the current wiki original`)
    }
    return canonicalBytes.length
  }

  await mkdirImplementation(dirname(outputPath), { recursive: true })
  await assertRealPathContained(publicDirectory, dirname(outputPath), {
    realpathImplementation: options.realpathImplementation,
  })
  await writeFileImplementation(outputPath, canonicalBytes)
  return canonicalBytes.length
}

function pinAssetBytes(asset, bytes) {
  return {
    ...asset,
    byteLength: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  }
}

function verifyBytesAgainstPin(asset, bytes) {
  if (bytes.length !== asset.byteLength) throw new Error(`${asset.localPath} does not match pinned byteLength`)
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  if (sha256 !== asset.sha256) throw new Error(`${asset.localPath} does not match pinned SHA-256`)
}

async function pathExists(path, lstatImplementation = lstat) {
  try {
    await lstatImplementation(path)
    return true
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

async function commitStagedTransaction(stageRoot, options) {
  const repositoryDirectory = resolve(options.repositoryDirectory)
  const updateManifest = options.updateManifest ?? false
  const renameImplementation = options.renameImplementation ?? rename
  const rmImplementation = options.rmImplementation ?? rm
  const mkdirImplementation = options.mkdirImplementation ?? mkdir
  const lstatImplementation = options.lstatImplementation ?? lstat
  const finalAssets = resolve(repositoryDirectory, 'public/assets')
  const finalManifest = resolve(repositoryDirectory, 'src/content/assets.json')
  const stagedAssets = resolve(stageRoot, 'public/assets')
  const stagedManifest = resolve(stageRoot, 'src/content/assets.json')
  const backupAssets = resolve(stageRoot, 'backup/assets')
  const backupManifest = resolve(stageRoot, 'backup/assets.json')
  let oldAssetsMoved = false
  let newAssetsInstalled = false
  let oldManifestMoved = false
  let newManifestInstalled = false

  await mkdirImplementation(resolve(stageRoot, 'backup'), { recursive: true })
  await mkdirImplementation(dirname(finalAssets), { recursive: true })
  try {
    if (await pathExists(finalAssets, lstatImplementation)) {
      await renameImplementation(finalAssets, backupAssets)
      oldAssetsMoved = true
    }
    await renameImplementation(stagedAssets, finalAssets)
    newAssetsInstalled = true

    if (updateManifest) {
      await mkdirImplementation(dirname(finalManifest), { recursive: true })
      if (await pathExists(finalManifest, lstatImplementation)) {
        await renameImplementation(finalManifest, backupManifest)
        oldManifestMoved = true
      }
      await renameImplementation(stagedManifest, finalManifest)
      newManifestInstalled = true
    }
  } catch (error) {
    const rollbackErrors = []
    const attemptRollback = async (operation) => {
      try {
        await operation()
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError)
      }
    }

    if (newManifestInstalled) await attemptRollback(() => rmImplementation(finalManifest, { force: true }))
    if (oldManifestMoved) await attemptRollback(() => renameImplementation(backupManifest, finalManifest))
    if (newAssetsInstalled) await attemptRollback(() => rmImplementation(finalAssets, { recursive: true, force: true }))
    if (oldAssetsMoved) await attemptRollback(() => renameImplementation(backupAssets, finalAssets))

    if (rollbackErrors.length > 0) {
      const aggregate = new AggregateError([error, ...rollbackErrors], 'Asset swap failed and rollback was incomplete')
      aggregate.preserveStage = true
      throw aggregate
    }
    throw error
  }
}

export async function runAssetTransaction(manifest, options) {
  const repositoryDirectory = resolve(options.repositoryDirectory ?? repositoryRoot)
  const updateManifest = options.updateManifest ?? false
  const produceAsset = options.produceAsset
  const mkdtempImplementation = options.mkdtempImplementation ?? mkdtemp
  const rmImplementation = options.rmImplementation ?? rm
  if (typeof produceAsset !== 'function') throw new Error('runAssetTransaction requires produceAsset')
  validateManifest(manifest, { publicDirectory: resolve(repositoryDirectory, 'public') })

  const stageRoot = await mkdtempImplementation(resolve(repositoryDirectory, '.asset-stage-'))
  const stagePublic = resolve(stageRoot, 'public')
  let preserveStage = false
  try {
    await mkdir(resolve(stagePublic, 'assets'), { recursive: true })
    const stagedManifest = []
    let totalBytes = 0
    for (let index = 0; index < manifest.length; index += 1) {
      const asset = manifest[index]
      const bytes = Buffer.from(await produceAsset(asset, index))
      if (bytes.length <= 200 || !bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
        throw new Error(`${asset.localPath} producer returned invalid PNG bytes`)
      }
      const stagedAsset = updateManifest ? pinAssetBytes(asset, bytes) : asset
      if (!updateManifest) verifyBytesAgainstPin(asset, bytes)
      await verifyOrWriteAsset(stagedAsset, bytes, { publicDirectory: stagePublic })
      stagedManifest.push(stagedAsset)
      totalBytes += bytes.length
    }

    if (updateManifest) {
      const stagedManifestPath = resolve(stageRoot, 'src/content/assets.json')
      await mkdir(dirname(stagedManifestPath), { recursive: true })
      await writeFile(stagedManifestPath, `${JSON.stringify(stagedManifest, null, 2)}\n`)
    }

    await commitStagedTransaction(stageRoot, {
      ...options,
      repositoryDirectory,
      updateManifest,
    })
    return { assets: stagedManifest, totalBytes }
  } catch (error) {
    preserveStage = error?.preserveStage === true
    throw error
  } finally {
    if (!preserveStage) await rmImplementation(stageRoot, { recursive: true, force: true })
  }
}

export async function downloadAssetBytes(asset) {
  return fetchWithRetry(asset.downloadUrl, asset.wikiFile, {
    consume: (response) => readPngResponse(response, asset.wikiFile),
  })
}

export async function runAssetCli(args = process.argv.slice(2), options = {}) {
  const supportedArguments = new Set(['--check', '--freshness', '--update'])
  if (args.length > 1 || args.some((argument) => !supportedArguments.has(argument))) {
    throw new Error(`Unsupported arguments: ${args.join(' ')}`)
  }

  const repositoryDirectory = resolve(options.repositoryDirectory ?? repositoryRoot)
  const manifestFile = options.manifestFile ?? resolve(repositoryDirectory, 'src/content/assets.json')
  const readFileImplementation = options.readFileImplementation ?? readFile
  const verifyPinnedAssetSetImplementation = options.verifyPinnedAssetSetImplementation ?? verifyPinnedAssetSet
  const resolveAllWikiAssetsImplementation = options.resolveAllWikiAssetsImplementation ?? resolveAllWikiAssets
  const downloadAssetBytesImplementation = options.downloadAssetBytesImplementation ?? downloadAssetBytes
  const runAssetTransactionImplementation = options.runAssetTransactionImplementation ?? runAssetTransaction
  const log = options.log ?? console.log
  const manifest = JSON.parse(await readFileImplementation(manifestFile, 'utf8'))
  validateManifest(manifest, { publicDirectory: resolve(repositoryDirectory, 'public') })
  const mode = args[0] ?? '--fetch'

  if (mode === '--check') {
    const totalBytes = await verifyPinnedAssetSetImplementation(manifest, {
      publicDirectory: resolve(repositoryDirectory, 'public'),
    })
    log(`Verified ${manifest.length} pinned PNG assets offline (${totalBytes} bytes).`)
    return
  }

  const resolvedAssets = await resolveAllWikiAssetsImplementation(manifest)
  if (mode === '--freshness') {
    const driftedPaths = []
    for (const asset of resolvedAssets) {
      const bytes = await downloadAssetBytesImplementation(asset)
      try {
        verifyBytesAgainstPin(asset, bytes)
      } catch {
        driftedPaths.push(asset.localPath)
      }
    }
    if (driftedPaths.length > 0) throw new Error(`Upstream drift detected for ${driftedPaths.join(', ')}`)
    log(`No upstream drift for ${resolvedAssets.length} pinned PNG assets.`)
    return
  }

  const resolvedByPath = new Map(resolvedAssets.map((asset) => [asset.localPath, asset]))
  const updateManifest = mode === '--update'
  const result = await runAssetTransactionImplementation(manifest, {
    repositoryDirectory,
    updateManifest,
    produceAsset: async (asset) => {
      const resolvedAsset = resolvedByPath.get(asset.localPath)
      if (!resolvedAsset) throw new Error(`No resolved wiki asset for ${asset.localPath}`)
      return downloadAssetBytesImplementation(resolvedAsset)
    },
  })
  log(`${updateManifest ? 'Updated' : 'Fetched'} ${result.assets.length} attributed PNG assets atomically (${result.totalBytes} bytes).`)
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (import.meta.url === invokedPath) await runAssetCli()
