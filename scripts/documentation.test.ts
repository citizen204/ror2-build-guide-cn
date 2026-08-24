import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const repositoryDirectory = resolve(process.cwd())
const excludedDocumentationDirectories = new Set([
  'node_modules', 'dist', 'build', 'coverage', 'generated', '.vite',
])

function listTrackedDocumentationFiles(): string[] {
  return execFileSync('git', ['ls-files', '-z'], {
    cwd: repositoryDirectory,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .filter((file) => file.endsWith('.md') || file === 'index.html')
    .filter((file) => !file.split('/').some((part) => excludedDocumentationDirectories.has(part)))
    .sort()
}

describe('maintainer documentation', () => {
  test('documents the canonical guide, item-pick, and validation contracts', async () => {
    const readme = await readFile(resolve(repositoryDirectory, 'README.md'), 'utf8')

    for (const field of [
      'slug', 'skills', 'buildLogic', 'solo', 'coopAdjustments', 'commandRoute',
      'voidItems', 'lunarItems', 'lunarEquipment', 'combatNotes', 'sourceIds',
      'verifiedOn', 'itemId', 'recommendation', 'stacks', 'role', 'synergy',
      'alternative',
    ]) {
      expect(readme, `README schema field ${field}`).toContain(`\`${field}\``)
    }

    expect(readme).toMatch(/`lunarItems`.*被动月球物品/)
    expect(readme).toMatch(/`lunarEquipment`.*月球主动装备/)
    expect(readme).toMatch(/`validateGuideData`.*19.*技能槽位.*统率路线.*tier/)
    expect(readme).toContain('规范顺序由签名测试固定')
  })

  test('uses the official Alloyed Collective Chinese name throughout project documentation', async () => {
    const documentationFiles = listTrackedDocumentationFiles()
    expect(documentationFiles).toContain('research/build-notes/acrid.md')

    const documents = await Promise.all(documentationFiles.map(async (file) => ({
      file,
      content: await readFile(resolve(repositoryDirectory, file), 'utf8'),
    })))

    for (const { file, content } of documents) {
      expect(content, `${file} must not use stale DLC naming`).not.toMatch(/合金集体|合金共同体/)
    }

    expect(documents.some(({ content }) => content.includes('合金意念'))).toBe(true)
  })
})
