import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const document = new DOMParser().parseFromString(html, 'text/html')

function metaContent(selector: string): string | null {
  return document.querySelector<HTMLMetaElement>(selector)?.content ?? null
}

describe('document metadata', () => {
  test('identifies the document as Simplified Chinese', () => {
    expect(document.documentElement.lang).toBe('zh-CN')
  })

  test('provides descriptive search and browser metadata', () => {
    expect(document.title).toBe('雨中冒险 2 全角色构筑攻略｜中文技能与物品指南')
    expect(metaContent('meta[name="description"]')).toMatch(/全角色中文构筑攻略/)
    expect(metaContent('meta[name="description"]')).toMatch(/合金意念（Alloyed Collective）/)
    expect(metaContent('meta[name="theme-color"]')).toBe('#050505')
    expect(document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://citizen204.github.io/ror2-build-guide-cn/',
    )
  })

  test('provides text-only Open Graph metadata for the public URL', () => {
    expect(metaContent('meta[property="og:title"]')).toBe(
      '雨中冒险 2 全角色构筑攻略｜中文技能与物品指南',
    )
    expect(metaContent('meta[property="og:description"]')).toMatch(/技能、物品、统率路线和联机建议/)
    expect(metaContent('meta[property="og:type"]')).toBe('website')
    expect(metaContent('meta[property="og:url"]')).toBe(
      'https://citizen204.github.io/ror2-build-guide-cn/',
    )
    expect(document.querySelector('meta[property="og:image"]')).not.toBeInTheDocument()
    expect(html).not.toMatch(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)
  })
})
