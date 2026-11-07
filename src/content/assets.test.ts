/// <reference types="node" />

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import { items } from './items'
import { newSkillResearch } from './patchReview'
import { survivors } from './survivors'

type AssetKind = 'survivor' | 'skill' | 'item'

interface AssetRecord {
  localPath: string
  wikiFile: string
  sourcePage: string
  kind: AssetKind
  byteLength: number
  sha256: string
}

const manifestPath = resolve('src/content/assets.json')
const manifest: AssetRecord[] = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8')) as AssetRecord[]
  : []

const expectedAssets = new Map<string, AssetKind>([
  ...items.map((item) => [item.icon, 'item'] as const),
  ...survivors.map((survivor) => [survivor.portrait, 'survivor'] as const),
  ...survivors.flatMap((survivor) => survivor.skills.map((skill) => [skill.icon, 'skill'] as const)),
  ...survivors.flatMap((survivor) => [...(survivor.alternativeSkills ?? []), ...(survivor.transformationSkills ?? [])]
    .map((skill) => [skill.icon, 'skill'] as const)),
  ...newSkillResearch.map((skill) => [skill.icon, 'skill'] as const),
])

describe('local game asset manifest', () => {
  test('exists and records complete attributed metadata', () => {
    expect(existsSync(manifestPath), 'src/content/assets.json must exist').toBe(true)
    expect(manifest.length).toBeGreaterThan(0)

    for (const asset of manifest) {
      expect(asset.localPath.trim()).not.toBe('')
      expect(asset.wikiFile.trim()).not.toBe('')
      expect(asset.sourcePage.trim()).not.toBe('')
      expect(['survivor', 'skill', 'item']).toContain(asset.kind)
      expect(Number.isSafeInteger(asset.byteLength)).toBe(true)
      expect(asset.byteLength).toBeGreaterThan(200)
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/)

      const sourceUrl = new URL(asset.sourcePage)
      expect(sourceUrl.protocol).toBe('https:')
      expect(sourceUrl.hostname).toBe('riskofrain2.wiki.gg')
      expect(sourceUrl.pathname).not.toBe('/')
    }
  })

  test('rejects duplicate local paths and duplicate wiki source identities', () => {
    const localPaths = manifest.map((asset) => asset.localPath)
    const sourceIdentities = manifest.map((asset) => asset.wikiFile.trim().toLocaleLowerCase('en-US'))

    expect(new Set(localPaths).size).toBe(localPaths.length)
    expect(new Set(sourceIdentities).size).toBe(sourceIdentities.length)
  })

  test('contains every referenced item, portrait, and skill path exactly once with no extras', () => {
    const manifestCounts = new Map<string, number>()
    for (const asset of manifest) {
      manifestCounts.set(asset.localPath, (manifestCounts.get(asset.localPath) ?? 0) + 1)
      expect(asset.kind).toBe(expectedAssets.get(asset.localPath))
    }

    expect([...manifestCounts.keys()].sort()).toEqual([...expectedAssets.keys()].sort())
    for (const localPath of expectedAssets.keys()) {
      expect(manifestCounts.get(localPath), localPath).toBe(1)
    }
  })

  test('stores every referenced file as the exact pinned real PNG', () => {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

    for (const asset of manifest) {
      const filePath = resolve('public', asset.localPath)
      const bytes = readFileSync(filePath)
      expect(existsSync(filePath), filePath).toBe(true)
      expect(statSync(filePath).size, filePath).toBe(asset.byteLength)
      expect(bytes.subarray(0, 8), filePath).toEqual(pngSignature)
      expect(createHash('sha256').update(bytes).digest('hex'), filePath).toBe(asset.sha256)
    }
  })

  test('contains no unpinned physical files on disk', () => {
    const assetsRoot = resolve('public/assets')
    const files: string[] = []
    const visit = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = resolve(directory, entry.name)
        if (entry.isDirectory()) visit(entryPath)
        else if (entry.isFile()) files.push(relative(resolve('public'), entryPath).replaceAll('\\', '/'))
        else files.push(`unsupported:${relative(assetsRoot, entryPath).replaceAll('\\', '/')}`)
      }
    }
    visit(assetsRoot)

    expect(files.sort()).toEqual(manifest.map((asset) => asset.localPath).sort())
  })
})
