import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const defaultBasePath = '/ror2-build-guide-cn/'

function normalizeBasePath(basePath) {
  if (!basePath.startsWith('/') || !basePath.endsWith('/')) {
    throw new Error(`GitHub Pages 子路径必须以 / 开头和结尾：${basePath}`)
  }

  return basePath
}

function isExternalReference(reference) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)
}

export function verifyDeploymentOutput({
  distDirectory = resolve(process.cwd(), 'dist'),
  basePath = defaultBasePath,
} = {}) {
  const normalizedBasePath = normalizeBasePath(basePath)
  const normalizedDistDirectory = resolve(distDirectory)
  const indexFile = resolve(normalizedDistDirectory, 'index.html')

  if (!existsSync(indexFile)) {
    throw new Error(`找不到生产构建入口：${indexFile}`)
  }

  const indexHtml = readFileSync(indexFile, 'utf8')
  const references = [...indexHtml.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((reference) => !isExternalReference(reference))

  if (references.length === 0) {
    throw new Error('生产构建入口未引用任何本地资源')
  }

  for (const reference of references) {
    const pathname = decodeURIComponent(
      new URL(reference, 'https://pages.invalid').pathname,
    )

    if (!pathname.startsWith(normalizedBasePath)) {
      throw new Error(`构建资源未使用 GitHub Pages 子路径：${reference}`)
    }

    const relativePath = pathname.slice(normalizedBasePath.length)
    const assetFile = resolve(normalizedDistDirectory, relativePath)
    const pathFromDist = relative(normalizedDistDirectory, assetFile)

    if (pathFromDist.startsWith('..') || isAbsolute(pathFromDist)) {
      throw new Error(`构建资源路径越出 dist：${reference}`)
    }

    if (!existsSync(assetFile)) {
      throw new Error(`构建资源文件不存在：${relativePath}`)
    }
  }

  return references
}

const invokedFile = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : undefined

if (invokedFile === import.meta.url) {
  try {
    const references = verifyDeploymentOutput()
    console.log(`Verified ${references.length} GitHub Pages build references.`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
