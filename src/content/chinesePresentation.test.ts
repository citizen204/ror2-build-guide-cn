import { createElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test } from 'vitest'
import App from '../App'
import type { BuildSection, ItemPick, SurvivorGuide } from '../domain/guide'
import { items } from './items'
import { survivors } from './survivors'

const approvedOfficialLatinNames = ['MUL-T', 'REX'] as const
const latinNameBoundaryCharacters = String.raw`\p{Script=Latin}\p{Number}_\-`
const approvedOfficialLatinNamePattern = new RegExp(
  `(?<![${latinNameBoundaryCharacters}])(?:${approvedOfficialLatinNames.join('|')})(?![${latinNameBoundaryCharacters}])`,
  'gu',
)
const latinScriptPattern = /\p{Script=Latin}+/gu
const userFacingAttributes = [
  'alt',
  'aria-label',
  'aria-description',
  'title',
  'placeholder',
  'aria-valuetext',
] as const

interface VisibleTextEntry {
  source: string
  value: string
}

function unexpectedLatinTokens(value: string): string[] {
  const withoutApprovedNames = value.replace(approvedOfficialLatinNamePattern, '')
  return Array.from(withoutApprovedNames.matchAll(latinScriptPattern), ([token]) => token)
}

function expectChineseOnly({ source, value }: VisibleTextEntry): void {
  expect.soft(
    unexpectedLatinTokens(value),
    `${source} 含有未批准的拉丁字母：${value}`,
  ).toEqual([])
}

function itemPickText(pick: ItemPick, source: string): VisibleTextEntry[] {
  return [
    { source: `${source}.stacks`, value: pick.stacks },
    { source: `${source}.role`, value: pick.role },
    { source: `${source}.synergy`, value: pick.synergy },
    ...(pick.alternative === undefined
      ? []
      : [{ source: `${source}.alternative`, value: pick.alternative }]),
  ]
}

function itemPickListText(picks: ItemPick[], source: string): VisibleTextEntry[] {
  return picks.flatMap((pick, index) => itemPickText(pick, `${source}[${index}]`))
}

function buildText(build: BuildSection, source: string): VisibleTextEntry[] {
  return Object.entries(build).flatMap(([tier, picks]) => (
    itemPickListText(picks, `${source}.${tier}`)
  ))
}

function guideVisibleText(guide: SurvivorGuide): VisibleTextEntry[] {
  const source = `survivors/${guide.slug}`

  return [
    { source: `${source}.nameZh`, value: guide.nameZh },
    { source: `${source}.role`, value: guide.role },
    { source: `${source}.summary`, value: guide.summary },
    ...guide.skills.flatMap((skill, index) => [
      { source: `${source}.skills[${index}].nameZh`, value: skill.nameZh },
      { source: `${source}.skills[${index}].reason`, value: skill.reason },
    ]),
    ...guide.buildLogic.map((value, index) => ({
      source: `${source}.buildLogic[${index}]`,
      value,
    })),
    ...buildText(guide.solo, `${source}.solo`),
    ...guide.coopAdjustments.map((value, index) => ({
      source: `${source}.coopAdjustments[${index}]`,
      value,
    })),
    ...guide.commandRoute.flatMap((route, index) => [
      { source: `${source}.commandRoute[${index}].phase`, value: route.phase },
      { source: `${source}.commandRoute[${index}].explanation`, value: route.explanation },
    ]),
    ...itemPickListText(guide.voidItems, `${source}.voidItems`),
    ...itemPickListText(guide.lunarItems, `${source}.lunarItems`),
    ...itemPickListText(guide.lunarEquipment, `${source}.lunarEquipment`),
    ...guide.combatNotes.flatMap((note, index) => [
      { source: `${source}.combatNotes[${index}].title`, value: note.title },
      { source: `${source}.combatNotes[${index}].body`, value: note.body },
    ]),
  ]
}

function renderedPresentationEntries(source: string): VisibleTextEntry[] {
  return [
    {
      source: `${source} document.title`,
      value: document.title,
    },
    {
      source: `${source} 可见文本`,
      value: document.body.textContent ?? '',
    },
    ...userFacingAttributes.flatMap((attribute) => (
      Array.from(document.querySelectorAll(`[${attribute}]`), (element, index) => ({
        source: `${source} ${element.localName}[${index}].${attribute}`,
        value: element.getAttribute(attribute) ?? '',
      }))
    )),
  ]
}

afterEach(cleanup)

describe('全中文展示契约', () => {
  test('只允许完整且精确匹配的官方拉丁专名', () => {
    for (const value of [
      'MUL-T',
      'REX',
      '（MUL-T）、REX。',
      '角色MUL-T与REX搭档',
    ]) {
      expect.soft(
        unexpectedLatinTokens(value),
        `${value} 必须只包含批准的官方拉丁专名`,
      ).toEqual([])
    }

    for (const value of [
      'MUL-TREX',
      'REXMUL-T',
      'MUL-TMUL-T',
      'MUL-T2',
      'REX2',
      '2REX',
      'MUL-T_REX',
      'é',
      'Acrid',
    ]) {
      expect.soft(
        unexpectedLatinTokens(value),
        `${value} 必须被识别为未批准的拉丁字符串`,
      ).not.toEqual([])
    }
  })

  test('路由扫描器会检查文档标题和所有用户可见属性', () => {
    const originalTitle = document.title
    document.title = 'English document title'

    try {
      render(createElement(
        'section',
        {
          'aria-label': 'English aria label',
          'aria-description': 'English aria description',
          title: 'English title',
        },
        createElement('img', { alt: 'English alt' }),
        createElement('input', {
          placeholder: 'English placeholder',
          'aria-valuetext': 'English value text',
        }),
      ))

      const violations = renderedPresentationEntries('受控夹具')
        .filter(({ value }) => unexpectedLatinTokens(value).length > 0)

      expect(violations).toEqual([
        { source: '受控夹具 document.title', value: 'English document title' },
        { source: '受控夹具 img[0].alt', value: 'English alt' },
        { source: '受控夹具 section[0].aria-label', value: 'English aria label' },
        { source: '受控夹具 section[0].aria-description', value: 'English aria description' },
        { source: '受控夹具 section[0].title', value: 'English title' },
        { source: '受控夹具 input[0].placeholder', value: 'English placeholder' },
        { source: '受控夹具 input[0].aria-valuetext', value: 'English value text' },
      ])
    } finally {
      document.title = originalTitle
    }
  })

  test('物品和角色的中文展示字段不含未批准的拉丁字母', () => {
    for (const item of items) {
      expectChineseOnly({ source: `items/${item.id}.nameZh`, value: item.nameZh })
    }
    for (const guide of survivors) {
      guideVisibleText(guide).forEach(expectChineseOnly)
    }
  })

  test.each(['/', ...survivors.map(({ slug }) => `/survivors/${slug}`)])(
    '%s 路由只渲染中文和批准的官方专名',
    (path) => {
      render(createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(App),
      ))

      renderedPresentationEntries(`路由 ${path}`).forEach(expectChineseOnly)
    },
  )
})
