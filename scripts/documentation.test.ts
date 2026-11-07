import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const repositoryDirectory = resolve(process.cwd())

interface DocumentationFile {
  file: string
  content: string
}

interface DocumentationSafetyViolation {
  file: string
  kind: string
}

const documentationSafetyRules = [
  { kind: 'email address', pattern: /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/ },
  { kind: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/ },
  { kind: 'GitHub token', pattern: /\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}/ },
  { kind: 'OpenAI token', pattern: /\bsk-[A-Za-z0-9_-]{20,}/ },
  { kind: 'AWS access key', pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { kind: 'Slack token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}/ },
  { kind: 'GitLab token', pattern: /\bglpat-[A-Za-z0-9_-]{20,}/ },
  { kind: 'Google API key', pattern: /\bAIza[0-9A-Za-z_-]{30,}/ },
] as const

function findDocumentationSafetyViolations(
  documents: DocumentationFile[],
): DocumentationSafetyViolation[] {
  return documents.flatMap(({ file, content }) => (
    documentationSafetyRules.flatMap(({ kind, pattern }) => (
      pattern.test(content) ? [{ file, kind }] : []
    ))
  ))
}

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
  test('detects contact addresses and credential tokens in nested documentation', () => {
    const controlledViolations = [
      {
        file: 'docs/superpowers/specs/email-example.md',
        content: ['maintainer', 'example.test'].join('@'),
        kind: 'email address',
      },
      {
        file: 'research/build-notes/private-key-example.md',
        content: ['-----BEGIN', 'ENCRYPTED', 'PRIVATE KEY-----'].join(' '),
        kind: 'private key',
      },
      {
        file: 'docs/superpowers/specs/github-example.md',
        content: ['github', 'pat', 'A'.repeat(24)].join('_'),
        kind: 'GitHub token',
      },
      {
        file: 'research/build-notes/openai-example.md',
        content: ['sk', 'A'.repeat(24)].join('-'),
        kind: 'OpenAI token',
      },
      {
        file: 'docs/superpowers/specs/aws-example.md',
        content: ['ASIA', 'A'.repeat(16)].join(''),
        kind: 'AWS access key',
      },
      {
        file: 'research/build-notes/slack-example.md',
        content: ['xoxb', 'A'.repeat(24)].join('-'),
        kind: 'Slack token',
      },
      {
        file: 'docs/superpowers/specs/gitlab-example.md',
        content: ['glpat', 'A'.repeat(24)].join('-'),
        kind: 'GitLab token',
      },
      {
        file: 'research/build-notes/google-example.md',
        content: ['AIza', 'A'.repeat(32)].join(''),
        kind: 'Google API key',
      },
    ]

    expect(findDocumentationSafetyViolations(
      controlledViolations.map(({ file, content }) => ({ file, content })),
    )).toEqual(controlledViolations.map(({ file, kind }) => ({ file, kind })))
  })

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

  test('keeps every tracked documentation file free of contact addresses and credential material', async () => {
    const documentationFiles = listTrackedDocumentationFiles()
    expect(documentationFiles).toEqual(expect.arrayContaining([
      'index.html',
      'docs/superpowers/specs/2026-08-25-chinese-only-presentation-design.md',
      'research/build-notes/acrid.md',
    ]))

    const documents = await Promise.all(documentationFiles.map(async (file) => ({
      file,
      content: await readFile(resolve(repositoryDirectory, file), 'utf8'),
    })))
    const violations = findDocumentationSafetyViolations(documents)

    expect(
      violations,
      violations.map(({ file, kind }) => `${file}: ${kind}`).join('\n'),
    ).toEqual([])
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
    expect(readme).toMatch(/`validateGuideData`.*21.*技能槽位.*统率路线.*tier/)
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
