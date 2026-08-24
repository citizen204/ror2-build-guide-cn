import { describe, expect, test } from 'vitest'
import { items } from './items'

const REQUIRED_TIERS = [
  'common',
  'uncommon',
  'legendary',
  'boss',
  'equipment',
  'lunar',
  'void',
] as const

const EXPECTED_CORRUPTIONS: Record<string, string> = {
  'benthic-bloom': '57-leaf-clover',
  'encrusted-key': 'rusted-key',
  'lost-seers-lenses': 'lens-makers-glasses',
  'lysate-cell': 'fuel-cell',
  'needletick': 'tri-tip-dagger',
  'plasma-shrimp': 'atg-missile-mk-1',
  'pluripotent-larva': 'dios-best-friend',
  'polylute': 'ukulele',
  'safer-spaces': 'tougher-times',
  'tentabauble': 'chronobauble',
  'voidsent-flame': 'will-o-the-wisp',
  'weeping-fungus': 'bustling-fungus',
}

const EXPECTED_SPECIAL_REFERENCES = {
  'defensive-microbots': {
    nameZh: '防御用微型机器人',
    nameEn: 'Defensive Microbots',
    tier: 'legendary',
  },
  'item-scrap-white': {
    nameZh: '物品碎片，白色',
    nameEn: 'Item Scrap, White',
    tier: 'common',
  },
  'item-scrap-green': {
    nameZh: '物品碎片，绿色',
    nameEn: 'Item Scrap, Green',
    tier: 'uncommon',
  },
  'item-scrap-red': {
    nameZh: '物品碎片，红色',
    nameEn: 'Item Scrap, Red',
    tier: 'legendary',
  },
  'item-scrap-yellow': {
    nameZh: '物品碎片，黄色',
    nameEn: 'Item Scrap, Yellow',
    tier: 'boss',
  },
} as const

describe('canonical item catalogue', () => {
  test('uses unique stable kebab-case IDs', () => {
    const ids = items.map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true)
  })

  test('provides nonblank Chinese and exact English names', () => {
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((item) => item.nameZh.trim() && item.nameEn.trim())).toBe(true)
  })

  test('uses local PNG icon paths', () => {
    expect(items.every((item) => /^assets\/items\/.+\.png$/.test(item.icon))).toBe(true)
  })

  test('includes every concretely referenced world-unique item at its source tier', () => {
    const expectedIds = Object.keys(EXPECTED_SPECIAL_REFERENCES)
    const actual = Object.fromEntries(
      items
        .filter((item) => expectedIds.includes(item.id))
        .map(({ id, nameZh, nameEn, tier }) => [id, { nameZh, nameEn, tier }]),
    )

    expect(actual).toEqual(EXPECTED_SPECIAL_REFERENCES)
  })

  test.each(REQUIRED_TIERS)('contains at least one %s entry', (tier) => {
    expect(items.some((item) => item.tier === tier)).toBe(true)
  })

  test('records every included Void item corruption target exactly', () => {
    const actual = Object.fromEntries(
      items
        .filter((item) => item.tier === 'void')
        .map((item) => [item.id, item.corrupts]),
    )

    expect(actual).toEqual(EXPECTED_CORRUPTIONS)
    for (const originalId of Object.values(actual)) {
      expect(items.some((item) => item.id === originalId && item.tier !== 'void')).toBe(true)
    }
  })
})
