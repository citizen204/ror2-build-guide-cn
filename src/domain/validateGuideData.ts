import {
  type BuildSection,
  type ItemDefinition,
  type ItemPick,
  type ItemTier,
  type SurvivorGuide,
} from './guide'

export const EXPECTED_SURVIVOR_SLUGS = [
  'commando',
  'huntress',
  'bandit',
  'mul-t',
  'engineer',
  'artificer',
  'mercenary',
  'rex',
  'loader',
  'acrid',
  'captain',
  'railgunner',
  'void-fiend',
  'seeker',
  'chef',
  'false-son',
  'operator',
  'drifter',
  'heretic',
] as const

const REQUIRED_SKILL_SLOTS = ['primary', 'secondary', 'utility', 'special'] as const
const REQUIRED_ROUTE_PHASES = ['前期', '中期', '后期'] as const
const SOLO_TIERS: [keyof BuildSection, ItemTier][] = [
  ['common', 'common'],
  ['uncommon', 'uncommon'],
  ['legendary', 'legendary'],
  ['boss', 'boss'],
  ['equipment', 'equipment'],
]

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function itemPicksFor(guide: SurvivorGuide): ItemPick[] {
  return [
    ...guide.solo.common,
    ...guide.solo.uncommon,
    ...guide.solo.legendary,
    ...guide.solo.boss,
    ...guide.solo.equipment,
    ...guide.voidItems,
    ...guide.lunarItems,
  ]
}

function validateCatalogue(items: ItemDefinition[], errors: string[]): Map<string, ItemDefinition> {
  const itemById = new Map<string, ItemDefinition>()
  const duplicateIds = new Set<string>()

  for (const item of items) {
    if (!hasText(item.id) || !hasText(item.nameZh) || !hasText(item.nameEn) || !hasText(item.icon)
      || (item.corrupts !== undefined && !hasText(item.corrupts))) {
      errors.push(`物品定义不完整：${hasText(item.id) ? item.id : '未命名'}`)
    }

    if (itemById.has(item.id) && !duplicateIds.has(item.id)) {
      errors.push(`物品 ID 重复：${item.id}`)
      duplicateIds.add(item.id)
    }

    if (!itemById.has(item.id)) {
      itemById.set(item.id, item)
    }
  }

  for (const item of items) {
    if (item.corrupts && !itemById.has(item.corrupts)) {
      errors.push(`${item.id} 的腐化目标不存在：${item.corrupts}`)
    }
  }

  return itemById
}

function validatePublishableContent(guide: SurvivorGuide, errors: string[]): void {
  if (!hasText(guide.nameZh) || !hasText(guide.nameEn)) errors.push(`${guide.slug} 缺少角色名称`)
  if (!hasText(guide.portrait)) errors.push(`${guide.slug} 缺少角色头像`)
  if (!hasText(guide.role)) errors.push(`${guide.slug} 缺少角色定位`)
  if (!hasText(guide.summary)) errors.push(`${guide.slug} 缺少角色简介`)
  if (guide.buildLogic.length === 0 || guide.buildLogic.some((entry) => !hasText(entry))) {
    errors.push(`${guide.slug} 缺少构筑思路`)
  }
  if (guide.combatNotes.length === 0 || guide.combatNotes.some((note) => !hasText(note.title) || !hasText(note.body))) {
    errors.push(`${guide.slug} 缺少战斗说明`)
  }
  if (guide.sourceIds.length === 0 || guide.sourceIds.some((sourceId) => !hasText(sourceId))) {
    errors.push(`${guide.slug} 缺少来源`)
  }
  if (!hasText(guide.verifiedOn)) errors.push(`${guide.slug} 缺少验证日期`)

  if (guide.skills.some((skill) => !hasText(skill.nameZh) || !hasText(skill.nameEn) || !hasText(skill.icon) || !hasText(skill.reason))) {
    errors.push(`${guide.slug} 的技能配置存在空内容`)
  }
  if (guide.commandRoute.some((route) => route.picks.length === 0 || route.picks.some((pick) => !hasText(pick)) || !hasText(route.explanation))) {
    errors.push(`${guide.slug} 的统率路线存在空内容`)
  }
  if (itemPicksFor(guide).some((pick) => !hasText(pick.itemId) || !hasText(pick.stacks) || !hasText(pick.role) || !hasText(pick.synergy))) {
    errors.push(`${guide.slug} 的物品推荐存在空内容`)
  }
}

function validateItemPicks(
  guide: SurvivorGuide,
  picks: ItemPick[],
  itemById: Map<string, ItemDefinition>,
  errors: string[],
  expectedTier?: ItemTier,
  tierLabel?: string,
): void {
  for (const pick of picks) {
    if (!hasText(pick.itemId)) continue

    const item = itemById.get(pick.itemId)
    if (!item) {
      errors.push(`${guide.slug} 引用了未知物品：${pick.itemId}`)
      continue
    }

    if (expectedTier && item.tier !== expectedTier) {
      errors.push(`${guide.slug} 的${tierLabel}物品 tier 不匹配：${pick.itemId}`)
    }
  }
}

export function validateGuideData(
  guides: SurvivorGuide[],
  items: ItemDefinition[],
): string[] {
  const errors: string[] = []
  const guideSlugs = new Set(guides.map((guide) => guide.slug))
  const itemById = validateCatalogue(items, errors)

  if (guides.length !== EXPECTED_SURVIVOR_SLUGS.length) {
    errors.push('缺少 19 名角色的完整攻略')
  }

  if (guideSlugs.size !== guides.length) {
    errors.push('角色 slug 重复')
  }

  for (const slug of EXPECTED_SURVIVOR_SLUGS) {
    if (!guideSlugs.has(slug)) {
      errors.push(`缺少角色：${slug}`)
    }
  }

  for (const guide of guides) {
    validatePublishableContent(guide, errors)

    if (guide.skills.length < 4) {
      errors.push(`${guide.slug} 的技能配置不完整`)
    }
    if (!REQUIRED_SKILL_SLOTS.every((slot) => guide.skills.filter((skill) => skill.slot === slot).length === 1)) {
      errors.push(`${guide.slug} 的技能槽位必须各包含一个主技能、副技能、位移技能和特殊技能`)
    }

    if (guide.commandRoute.length !== 3
      || !REQUIRED_ROUTE_PHASES.every((phase) => guide.commandRoute.filter((route) => route.phase === phase).length === 1)) {
      errors.push(`${guide.slug} 的统率路线必须包含三个阶段`)
    }

    if (guide.coopAdjustments.length === 0 || guide.coopAdjustments.some((adjustment) => !hasText(adjustment))) {
      errors.push(`${guide.slug} 缺少联机调整`)
    }

    if (guide.voidItems.length === 0 || guide.lunarItems.length === 0) {
      errors.push(`${guide.slug} 缺少虚空或月球物品建议`)
    }

    for (const [section, tier] of SOLO_TIERS) {
      validateItemPicks(guide, guide.solo[section], itemById, errors, tier, ` ${section} `)
    }
    validateItemPicks(guide, guide.voidItems, itemById, errors, 'void', '虚空')
    validateItemPicks(guide, guide.lunarItems, itemById, errors, 'lunar', '月球')
  }

  return errors
}
