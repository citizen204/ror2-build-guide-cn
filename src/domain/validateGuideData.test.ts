import { describe, expect, test } from 'vitest'
import {
  SURVIVOR_ROSTER,
  type ItemDefinition,
  type SurvivorGuide,
} from './guide'
import { validateGuideData } from './validateGuideData'

const item: ItemDefinition = {
  id: 'soldiers-syringe',
  nameZh: '士兵注射器',
  nameEn: "Soldier's Syringe",
  tier: 'common',
  icon: '/items/soldiers-syringe.svg',
}

function createGuide(overrides: Partial<SurvivorGuide> = {}): SurvivorGuide {
  return {
    slug: 'commando',
    nameZh: '突击队员',
    nameEn: 'Commando',
    dlc: 'base',
    portrait: '/survivors/commando.svg',
    role: '持续输出',
    difficulty: 1,
    summary: '基础角色。',
    skills: [
      { slot: 'primary', nameZh: '双重射击', nameEn: 'Double Tap', icon: '', unlock: 'default', reason: '稳定输出' },
      { slot: 'secondary', nameZh: '相位爆裂', nameEn: 'Phase Blast', icon: '', unlock: 'default', reason: '近距离爆发' },
      { slot: 'utility', nameZh: '战术滑行', nameEn: 'Tactical Dive', icon: '', unlock: 'default', reason: '快速位移' },
      { slot: 'special', nameZh: '压制火力', nameEn: 'Suppressive Fire', icon: '', unlock: 'default', reason: '控制敌人' },
    ],
    buildLogic: '攻速与暴击兼顾。',
    solo: {
      common: [{ itemId: item.id, recommendation: 'core', stacks: '优先叠加', role: '攻速', synergy: '提升触发频率' }],
      uncommon: [],
      legendary: [],
      boss: [],
      equipment: [],
    },
    coopAdjustments: ['让出关键治疗。'],
    commandRoute: [
      { phase: '前期', picks: ['攻速'], explanation: '先保证输出手感。' },
      { phase: '中期', picks: ['暴击'], explanation: '补足倍率。' },
      { phase: '后期', picks: ['生存'], explanation: '应对高压。' },
    ],
    voidItems: [{ itemId: item.id, recommendation: 'conditional', stacks: '视情况', role: '转化', synergy: '谨慎选择' }],
    lunarItems: [{ itemId: item.id, recommendation: 'avoid', stacks: '不拿', role: '风险', synergy: '副作用高' }],
    combatNotes: [{ title: '走位', body: '保持距离。' }],
    sourceIds: ['wiki'],
    verifiedOn: '2026-08-25',
    ...overrides,
  }
}

describe('guide domain', () => {
  test('exports the required survivor roster in its canonical order', () => {
    expect(SURVIVOR_ROSTER).toEqual([
      'commando', 'huntress', 'bandit', 'mul-t', 'engineer', 'artificer',
      'mercenary', 'rex', 'loader', 'acrid', 'captain', 'railgunner',
      'void-fiend', 'seeker', 'chef', 'false-son', 'operator', 'drifter',
      'heretic',
    ])
  })
})

describe('validateGuideData', () => {
  test('reports incomplete roster and every missing slug for empty data', () => {
    const errors = validateGuideData([], [])

    expect(errors).toContain('缺少 19 名角色的完整攻略')
    expect(errors).toContain('缺少角色：commando')
    expect(errors).toContain('缺少角色：heretic')
    expect(errors.filter((error) => error.startsWith('缺少角色：'))).toHaveLength(19)
  })

  test('detects duplicate guide slugs in otherwise valid data', () => {
    const guide = createGuide()

    expect(validateGuideData([guide, guide], [item])).toContain('角色 slug 重复')
  })

  test('detects an unknown item reference from a populated solo build', () => {
    const guide = createGuide({
      solo: {
        common: [{ itemId: 'missing-item', recommendation: 'core', stacks: '一件', role: '测试', synergy: '验证引用' }],
        uncommon: [],
        legendary: [],
        boss: [],
        equipment: [],
      },
    })

    expect(validateGuideData([guide], [item])).toContain('commando 引用了未知物品：missing-item')
  })
})
