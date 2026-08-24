import { describe, expect, test } from 'vitest'
import {
  type ItemDefinition,
  type SurvivorGuide,
} from './guide'
import {
  EXPECTED_SURVIVOR_SLUGS,
  validateGuideData,
} from './validateGuideData'

const items: ItemDefinition[] = [
  { id: 'soldiers-syringe', nameZh: '士兵注射器', nameEn: "Soldier's Syringe", tier: 'common', icon: '/items/soldiers-syringe.svg' },
  { id: 'harvesters-scythe', nameZh: '收割者镰刀', nameEn: "Harvester's Scythe", tier: 'uncommon', icon: '/items/harvesters-scythe.svg' },
  { id: 'brilliant-behemoth', nameZh: '璀璨巨兽', nameEn: 'Brilliant Behemoth', tier: 'legendary', icon: '/items/brilliant-behemoth.svg' },
  { id: 'little-disciple', nameZh: '小门徒', nameEn: 'Little Disciple', tier: 'boss', icon: '/items/little-disciple.svg' },
  { id: 'royal-capacitor', nameZh: '皇家电容器', nameEn: 'Royal Capacitor', tier: 'equipment', icon: '/items/royal-capacitor.svg' },
  { id: 'needletick', nameZh: '针刺', nameEn: 'Needletick', tier: 'void', icon: '/items/needletick.svg', corrupts: 'soldiers-syringe' },
  { id: 'shaped-glass', nameZh: '塑形玻璃', nameEn: 'Shaped Glass', tier: 'lunar', icon: '/items/shaped-glass.svg' },
  { id: 'spinel-tonic', nameZh: '尖晶强心剂', nameEn: 'Spinel Tonic', tier: 'lunar-equipment', icon: '/items/spinel-tonic.svg' },
]

const item = items[0]

function pick(itemId: string) {
  return {
    itemId,
    recommendation: 'core' as const,
    stacks: '一件',
    role: '测试',
    synergy: '验证推荐',
  }
}

function createBuildSection() {
  return {
    common: [pick('soldiers-syringe')],
    uncommon: [pick('harvesters-scythe')],
    legendary: [pick('brilliant-behemoth')],
    boss: [pick('little-disciple')],
    equipment: [pick('royal-capacitor')],
  }
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
      { slot: 'primary', nameZh: '双重射击', nameEn: 'Double Tap', icon: '/skills/double-tap.svg', unlock: 'default', reason: '稳定输出' },
      { slot: 'secondary', nameZh: '相位爆裂', nameEn: 'Phase Blast', icon: '/skills/phase-blast.svg', unlock: 'default', reason: '近距离爆发' },
      { slot: 'utility', nameZh: '战术滑行', nameEn: 'Tactical Dive', icon: '/skills/tactical-dive.svg', unlock: 'default', reason: '快速位移' },
      { slot: 'special', nameZh: '压制火力', nameEn: 'Suppressive Fire', icon: '/skills/suppressive-fire.svg', unlock: 'default', reason: '控制敌人' },
    ],
    buildLogic: ['攻速与暴击兼顾。'],
    solo: createBuildSection(),
    coopAdjustments: ['让出关键治疗。'],
    commandRoute: [
      { phase: '前期', picks: ['soldiers-syringe'], explanation: '先保证输出手感。' },
      { phase: '中期', picks: ['harvesters-scythe'], explanation: '补足倍率。' },
      { phase: '后期', picks: ['brilliant-behemoth'], explanation: '应对高压。' },
    ],
    voidItems: [pick('needletick')],
    lunarItems: [pick('shaped-glass')],
    lunarEquipment: [],
    combatNotes: [{ title: '走位', body: '保持距离。' }],
    sourceIds: ['wiki'],
    verifiedOn: '2026-08-25',
    ...overrides,
  }
}

function createCompleteRoster(): SurvivorGuide[] {
  return EXPECTED_SURVIVOR_SLUGS.map((slug) => createGuide({
    slug,
    nameZh: `角色 ${slug}`,
    nameEn: slug,
  }))
}

describe('guide domain', () => {
  test('exports the required survivor roster in its canonical order', () => {
    expect(EXPECTED_SURVIVOR_SLUGS).toEqual([
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

    expect(validateGuideData([guide, guide], items)).toContain('角色 slug 重复')
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

    expect(validateGuideData([guide], items)).toContain('commando 引用了未知物品：missing-item')
  })

  test('accepts the canonical complete roster with publishable data', () => {
    expect(validateGuideData(createCompleteRoster(), items)).toEqual([])
  })

  test('rejects duplicate or missing required skill slots', () => {
    const [guide] = createCompleteRoster()
    guide.skills[3] = { ...guide.skills[3], slot: 'primary' }

    expect(validateGuideData([guide], items)).toContain(
      'commando 的技能槽位必须各包含一个主技能、副技能、位移技能和特殊技能',
    )
  })

  test('rejects duplicate or missing command route phases', () => {
    const [guide] = createCompleteRoster()
    guide.commandRoute[1] = { ...guide.commandRoute[1], phase: '前期' }

    expect(validateGuideData([guide], items)).toContain('commando 的统率路线必须包含三个阶段')
  })

  test('rejects every unknown Command route item reference', () => {
    const guides = createCompleteRoster()
    const [commando, huntress] = guides
    commando.commandRoute[0] = {
      ...commando.commandRoute[0],
      picks: ['missing-command-white', 'soldiers-syringe'],
    }
    commando.commandRoute[2] = {
      ...commando.commandRoute[2],
      picks: ['missing-command-red'],
    }
    huntress.commandRoute[1] = {
      ...huntress.commandRoute[1],
      picks: ['harvesters-scythe', 'missing-command-green'],
    }

    expect(validateGuideData(guides, items)).toEqual([
      'commando 的前期统率路线引用了未知物品：missing-command-white',
      'commando 的后期统率路线引用了未知物品：missing-command-red',
      'huntress 的中期统率路线引用了未知物品：missing-command-green',
    ])
  })

  test('rejects blank required publishable content', () => {
    const [guide] = createCompleteRoster()
    guide.nameZh = ' '
    guide.portrait = ' '
    guide.coopAdjustments = [' ']
    guide.buildLogic = [' ']
    guide.combatNotes = [{ title: ' ', body: ' ' }]
    guide.sourceIds = [' ']
    guide.verifiedOn = ' '
    guide.skills[0] = { ...guide.skills[0], nameZh: ' ', nameEn: ' ', icon: ' ', reason: ' ' }
    guide.commandRoute[0] = { ...guide.commandRoute[0], picks: [], explanation: ' ' }
    guide.solo.common[0] = { ...guide.solo.common[0], itemId: ' ', stacks: ' ', role: ' ', synergy: ' ' }

    expect(validateGuideData([guide], items)).toEqual(expect.arrayContaining([
      'commando 缺少角色名称',
      'commando 缺少角色头像',
      'commando 缺少构筑思路',
      'commando 缺少战斗说明',
      'commando 缺少来源',
      'commando 缺少验证日期',
      'commando 的技能配置存在空内容',
      'commando 的统率路线存在空内容',
      'commando 的物品推荐存在空内容',
      'commando 缺少联机调整',
    ]))
  })

  test('rejects duplicate item catalogue IDs and unknown corrupts targets', () => {
    const catalogue = [
      ...items,
      { ...item },
      { ...items[5], corrupts: 'missing-item' },
    ]

    expect(validateGuideData(createCompleteRoster(), catalogue)).toEqual(expect.arrayContaining([
      '物品 ID 重复：soldiers-syringe',
      'needletick 的腐化目标不存在：missing-item',
    ]))
  })

  test('rejects solo item tier mismatches', () => {
    const [guide] = createCompleteRoster()
    guide.solo.common = [pick('harvesters-scythe')]

    expect(validateGuideData([guide], items)).toContain('commando 的 common 物品 tier 不匹配：harvesters-scythe')
  })

  test('rejects void and passive lunar tier mismatches while retaining unknown item errors', () => {
    const [guide] = createCompleteRoster()
    guide.voidItems = [pick('harvesters-scythe'), pick('missing-void')]
    guide.lunarItems = [pick('soldiers-syringe'), pick('missing-lunar')]

    expect(validateGuideData([guide], items)).toEqual(expect.arrayContaining([
      'commando 的虚空物品 tier 不匹配：harvesters-scythe',
      'commando 的月球物品 tier 不匹配：soldiers-syringe',
      'commando 引用了未知物品：missing-void',
      'commando 引用了未知物品：missing-lunar',
    ]))
  })

  test('keeps passive lunar items and lunar active equipment in distinct tiers', () => {
    const [guide] = createCompleteRoster()
    guide.lunarItems = [pick('spinel-tonic')]
    guide.lunarEquipment = [pick('shaped-glass'), pick('missing-lunar-equipment')]

    expect(validateGuideData([guide], items)).toEqual(expect.arrayContaining([
      'commando 的月球物品 tier 不匹配：spinel-tonic',
      'commando 的月球主动装备物品 tier 不匹配：shaped-glass',
      'commando 引用了未知物品：missing-lunar-equipment',
    ]))
  })
})
