import { createElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test } from 'vitest'
import App from '../App'
import type { BuildSection, ItemPick, SurvivorGuide } from '../domain/guide'
import { items } from './items'
import { survivors } from './survivors'

const approvedOfficialLatinNames = ['MUL-T', 'REX'] as const
const latinTokenPattern = /[A-Za-z]+(?:-[A-Za-z]+)*/g

interface VisibleTextEntry {
  source: string
  value: string
}

function unexpectedLatinTokens(value: string): string[] {
  return Array.from(value.matchAll(latinTokenPattern), ([token]) => token)
    .filter((token) => !approvedOfficialLatinNames.some((name) => name === token))
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

afterEach(cleanup)

describe('全中文展示契约', () => {
  test('只允许完整且精确匹配的官方拉丁专名', () => {
    expect(unexpectedLatinTokens('MUL-T 与 REX')).toEqual([])

    for (const value of ['MUL-TREX', 'REXMUL-T', 'MUL-TMUL-T', 'Acrid']) {
      expect.soft(
        unexpectedLatinTokens(value),
        `${value} 必须被识别为未批准的拉丁字符串`,
      ).toEqual([value])
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

      expectChineseOnly({
        source: `路由 ${path} 可见文本`,
        value: document.body.textContent ?? '',
      })
      for (const [index, image] of Array.from(document.images).entries()) {
        expectChineseOnly({
          source: `路由 ${path} 图片[${index}]替代文本`,
          value: image.alt,
        })
      }
    },
  )
})
