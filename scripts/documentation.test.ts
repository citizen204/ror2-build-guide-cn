import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const repositoryDirectory = resolve(process.cwd())

function listTrackedDocumentationFiles(): string[] {
  return execFileSync('git', ['ls-files', '-z'], {
    cwd: repositoryDirectory,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .filter((file) => file.endsWith('.md') || file === 'index.html')
    .sort()
}

describe('maintainer documentation', () => {
  test('documents Chinese-only presentation and bounded English survivor search', async () => {
    const [product, readme] = await Promise.all([
      readFile(resolve(repositoryDirectory, 'PRODUCT.md'), 'utf8'),
      readFile(resolve(repositoryDirectory, 'README.md'), 'utf8'),
    ])

    expect(product).toContain('页面只显示中文')
    expect(product).toMatch(/内部英文名称.*英文角色搜索、资源匹配和内容维护/)
    expect(product).toMatch(/MUL-T.*REX.*官方专名/)
    expect(product).not.toContain('中文名、英文名总是共同出现')
    expect(product).not.toContain('中文与英文名称均可被辅助技术读取')

    expect(readme).toContain('页面只显示中文')
    expect(readme).toMatch(/输入英文角色名仍可搜索/)
    expect(readme).toContain('英文搜索仅适用于角色；本站不提供物品或技能的站内搜索。')
    expect(readme).not.toContain('- 本体（Base）')
  })

  test('keeps public documentation free of contact addresses and credential material', async () => {
    const publicDocumentationFiles = ['README.md', 'PRODUCT.md', 'index.html']
    const forbiddenPatterns = [
      /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
      /\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}/,
      /\bsk-[A-Za-z0-9_-]{20,}/,
      /\bAKIA[0-9A-Z]{16}\b/,
    ]

    for (const file of publicDocumentationFiles) {
      const content = await readFile(resolve(repositoryDirectory, file), 'utf8')
      for (const pattern of forbiddenPatterns) {
        expect(content, `${file} must not publish contact details or secrets`).not.toMatch(pattern)
      }
    }
  })

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

  test('documents GitHub Pages as live over HTTPS', async () => {
    const readme = await readFile(resolve(repositoryDirectory, 'README.md'), 'utf8')

    expect(readme).toContain('在线地址：<https://citizen204.github.io/ror2-build-guide-cn/>')
    expect(readme).toMatch(/已配置 GitHub Actions Pages.*已通过 HTTPS.*上线/)
    expect(readme).not.toContain('计划发布地址')
    expect(readme).not.toContain('首次发布前')
  })

  test('uses the official Alloyed Collective Chinese name throughout project documentation', async () => {
    const documentationFiles = listTrackedDocumentationFiles()
    const expectedDocumentationFiles = execFileSync('git', ['ls-files', '-z'], {
      cwd: repositoryDirectory,
      encoding: 'utf8',
    })
      .split('\0')
      .filter(Boolean)
      .filter((file) => file.endsWith('.md') || file === 'index.html')
      .sort()

    expect(documentationFiles).toEqual(expectedDocumentationFiles)
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
