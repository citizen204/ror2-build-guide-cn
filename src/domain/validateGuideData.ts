import {
  SURVIVOR_ROSTER,
  type ItemDefinition,
  type ItemPick,
  type SurvivorGuide,
} from './guide'

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

export function validateGuideData(
  guides: SurvivorGuide[],
  items: ItemDefinition[],
): string[] {
  const errors: string[] = []
  const guideSlugs = new Set(guides.map((guide) => guide.slug))
  const itemIds = new Set(items.map((item) => item.id))

  if (guides.length !== SURVIVOR_ROSTER.length) {
    errors.push('缺少 19 名角色的完整攻略')
  }

  if (guideSlugs.size !== guides.length) {
    errors.push('角色 slug 重复')
  }

  for (const slug of SURVIVOR_ROSTER) {
    if (!guideSlugs.has(slug)) {
      errors.push(`缺少角色：${slug}`)
    }
  }

  for (const guide of guides) {
    if (guide.skills.length < 4) {
      errors.push(`${guide.slug} 的技能配置不完整`)
    }

    if (guide.commandRoute.length !== 3) {
      errors.push(`${guide.slug} 的统率路线必须包含三个阶段`)
    }

    if (guide.coopAdjustments.length === 0) {
      errors.push(`${guide.slug} 缺少联机调整`)
    }

    if (guide.voidItems.length === 0 || guide.lunarItems.length === 0) {
      errors.push(`${guide.slug} 缺少虚空或月球物品建议`)
    }

    for (const pick of itemPicksFor(guide)) {
      if (!itemIds.has(pick.itemId)) {
        errors.push(`${guide.slug} 引用了未知物品：${pick.itemId}`)
      }
    }
  }

  return errors
}
