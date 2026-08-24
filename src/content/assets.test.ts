/// <reference types="node" />

import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import { items } from './items'
import { survivors } from './survivors'

type AssetKind = 'survivor' | 'skill' | 'item'

interface AssetRecord {
  localPath: string
  wikiFile: string
  sourcePage: string
  kind: AssetKind
}

const manifestPath = resolve('src/content/assets.json')
const manifest: AssetRecord[] = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8')) as AssetRecord[]
  : []

const expectedAssets = new Map<string, AssetKind>([
  ...items.map((item) => [item.icon, 'item'] as const),
  ...survivors.map((survivor) => [survivor.portrait, 'survivor'] as const),
  ...survivors.flatMap((survivor) => survivor.skills.map((skill) => [skill.icon, 'skill'] as const)),
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

  test('stores every referenced file as a nontrivial real PNG', () => {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

    for (const asset of manifest) {
      const filePath = resolve('public', asset.localPath)
      expect(existsSync(filePath), filePath).toBe(true)
      expect(statSync(filePath).size, filePath).toBeGreaterThan(200)
      expect(readFileSync(filePath).subarray(0, 8), filePath).toEqual(pngSignature)
    }
  })
})
