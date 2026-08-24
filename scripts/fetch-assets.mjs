import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const WIKI_API = 'https://riskofrain2.wiki.gg/api.php'
const USER_AGENT = 'RoR2BuildGuideAssetFetcher/1.0 (local attributed assets; contact via repository maintainers)'
const RETRY_DELAYS_MS = [500, 1_000, 2_000]
const API_BATCH_SIZE = 40
const DOWNLOAD_BATCH_SIZE = 6
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '..')
const publicRoot = resolve(repositoryRoot, 'public')
const manifestPath = resolve(repositoryRoot, 'src/content/assets.json')

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))
}

export async function fetchWithRetry(url, label, options = {}) {
  const fetchImplementation = options.fetchImplementation ?? fetch
  const wait = options.wait ?? delay
  const consume = options.consume ?? (async (response) => response)

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    let response
    try {
      response = await fetchImplementation(url, { headers: { 'User-Agent': USER_AGENT } })
    } catch (error) {
      const transientNetworkFailure = error instanceof TypeError
      if (!transientNetworkFailure || attempt === RETRY_DELAYS_MS.length) throw error
      await wait(RETRY_DELAYS_MS[attempt])
      continue
    }

    if (!response.ok) {
      const transientHttpFailure = response.status === 429 || response.status >= 500
      const error = new Error(`${label} returned HTTP ${response.status}`)
      if (!transientHttpFailure || attempt === RETRY_DELAYS_MS.length) throw error
      await wait(RETRY_DELAYS_MS[attempt])
      continue
    }

    try {
      return await consume(response)
    } catch (error) {
      const transientBodyFailure = error instanceof TypeError
      if (!transientBodyFailure || attempt === RETRY_DELAYS_MS.length) throw error
      await wait(RETRY_DELAYS_MS[attempt])
    }
  }

  throw new Error(`${label} exhausted retries`)
}

function validateManifest(manifest) {
  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('Asset manifest must be a non-empty array')
  }

  const localPaths = new Set()
  const sourceIdentities = new Set()
  for (const asset of manifest) {
    if (!asset || typeof asset !== 'object') throw new Error('Asset manifest contains a non-object record')
    if (!['survivor', 'skill', 'item'].includes(asset.kind)) throw new Error(`Invalid asset kind for ${asset.localPath}`)
    if (typeof asset.wikiFile !== 'string' || !asset.wikiFile.trim()) throw new Error(`Missing wikiFile for ${asset.localPath}`)

    const sourceUrl = new URL(asset.sourcePage)
    if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'riskofrain2.wiki.gg') {
      throw new Error(`Invalid sourcePage for ${asset.localPath}`)
    }
    if (typeof asset.localPath !== 'string' || !/^assets\/(?:survivors|skills|items)\/.+\.png$/.test(asset.localPath)) {
      throw new Error(`Invalid localPath: ${asset.localPath}`)
    }

    const outputPath = resolve(publicRoot, asset.localPath)
    if (!outputPath.startsWith(`${publicRoot}${sep}`)) throw new Error(`Asset path escapes public directory: ${asset.localPath}`)
    if (localPaths.has(asset.localPath)) throw new Error(`Duplicate localPath: ${asset.localPath}`)

    const sourceIdentity = asset.wikiFile.trim().toLocaleLowerCase('en-US')
    if (sourceIdentities.has(sourceIdentity)) throw new Error(`Duplicate wikiFile source identity: ${asset.wikiFile}`)
    localPaths.add(asset.localPath)
    sourceIdentities.add(sourceIdentity)
  }
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

  const titleChanges = new Map(
    [...(result.query?.normalized ?? []), ...(result.query?.redirects ?? [])]
      .map((change) => [change.from, change.to]),
  )
  const pages = new Map(Object.values(result.query?.pages ?? {}).map((page) => [page.title, page]))

  return assets.map((asset, index) => {
    let resolvedTitle = requestedTitles[index]
    while (titleChanges.has(resolvedTitle)) resolvedTitle = titleChanges.get(resolvedTitle)
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

export async function verifyOrWriteAsset(asset, canonicalBytes, options = {}) {
  const checkOnly = options.checkOnly ?? false
  const publicDirectory = options.publicDirectory ?? publicRoot
  const readFileImplementation = options.readFileImplementation ?? readFile
  const mkdirImplementation = options.mkdirImplementation ?? mkdir
  const writeFileImplementation = options.writeFileImplementation ?? writeFile
  const outputPath = resolve(publicDirectory, asset.localPath)

  if (checkOnly) {
    let localBytes
    try {
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
  await writeFileImplementation(outputPath, canonicalBytes)
  return canonicalBytes.length
}

async function downloadAsset(asset, checkOnly) {
  const bytes = await fetchWithRetry(asset.downloadUrl, asset.wikiFile, {
    consume: async (response) => {
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.toLowerCase().startsWith('image/png')) {
        throw new Error(`${asset.wikiFile} returned unexpected content type: ${contentType}`)
      }
      return Buffer.from(await response.arrayBuffer())
    },
  })
  if (bytes.length <= 200) throw new Error(`${asset.wikiFile} is unexpectedly small (${bytes.length} bytes)`)
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error(`${asset.wikiFile} did not return real PNG bytes`)
  }

  return verifyOrWriteAsset(asset, bytes, { checkOnly })
}

async function main(args = process.argv.slice(2)) {
  const unsupportedArguments = args.filter((argument) => argument !== '--check')
  if (unsupportedArguments.length > 0) throw new Error(`Unsupported argument: ${unsupportedArguments[0]}`)
  const checkOnly = args.includes('--check')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  validateManifest(manifest)

  const resolvedAssets = []
  for (let offset = 0; offset < manifest.length; offset += API_BATCH_SIZE) {
    resolvedAssets.push(...await resolveWikiBatch(manifest.slice(offset, offset + API_BATCH_SIZE)))
  }

  let totalBytes = 0
  for (let offset = 0; offset < resolvedAssets.length; offset += DOWNLOAD_BATCH_SIZE) {
    const batch = resolvedAssets.slice(offset, offset + DOWNLOAD_BATCH_SIZE)
    const sizes = await Promise.all(batch.map((asset) => downloadAsset(asset, checkOnly)))
    totalBytes += sizes.reduce((sum, size) => sum + size, 0)
    for (const asset of batch) console.log(`${checkOnly ? 'verified' : 'fetched'} ${asset.localPath}`)
  }

  console.log(`${checkOnly ? 'Verified' : 'Fetched'} ${resolvedAssets.length} attributed PNG assets (${totalBytes} bytes).`)
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (import.meta.url === invokedPath) await main()
