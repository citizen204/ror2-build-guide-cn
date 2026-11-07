import { describe, expect, test } from 'vitest'
import { items } from './items'

const REQUIRED_TIERS = [
  'common',
  'uncommon',
  'legendary',
  'boss',
  'equipment',
  'lunar',
  'lunar-equipment',
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

const EXPECTED_ID_TIERS = [
  '57-leaf-clover:legendary',
  'aegis:legendary',
  'alien-head:legendary',
  'armor-piercing-rounds:common',
  'atg-missile-mk-1:uncommon',
  'backup-magazine:common',
  'bens-raincoat:legendary',
  'benthic-bloom:void',
  'box-of-dynamite:uncommon',
  'brilliant-behemoth:legendary',
  'brittle-crown:lunar',
  'bustling-fungus:common',
  'cautious-slug:common',
  'ceremonial-dagger:legendary',
  'charged-perforator:boss',
  'chronobauble:uncommon',
  'collectors-compulsion:uncommon',
  'corpse-lily:hallowed',
  'corpsebloom:lunar',
  'crowbar:common',
  'death-mark:uncommon',
  'defense-nucleus:boss',
  'defensive-microbots:legendary',
  'delicate-watch:common',
  'deus-ex-machina:equipment',
  'dios-best-friend:legendary',
  'disposable-missile-launcher:equipment',
  'dream-crucible:hallowed',
  'earthbound-vessel:hallowed',
  'empathy-cores:boss',
  'encrusted-key:void',
  'energy-drink:common',
  'essence-of-heresy:lunar',
  'executive-card:equipment',
  'focus-crystal:common',
  'focused-convergence:lunar',
  'forgive-me-please:equipment',
  'frost-relic:legendary',
  'fuel-cell:uncommon',
  'gasoline:common',
  'genesis-loop:boss',
  'gesture-of-the-drowned:lunar',
  'gorags-opus:equipment',
  'h3ad-5t-v2:legendary',
  'hardlight-afterburner:legendary',
  'harvesters-scythe:uncommon',
  'hex-of-acceleration:hex',
  'hex-of-blindness:hex',
  'hex-of-famine:hex',
  'hex-of-greed:hex',
  'hex-of-haunting:hex',
  'hex-of-leaping:hex',
  'hex-of-loss:hex',
  'hex-of-mimicry:hex',
  'hex-of-misfortune:hex',
  'hex-of-ossification:hex',
  'hex-of-pain:hex',
  'hex-of-patience:hex',
  'hex-of-rain:hex',
  'hex-of-strife:hex',
  'hooks-of-heresy:lunar',
  'hopoo-feather:uncommon',
  'ignition-tank:uncommon',
  'infernal-mark:hallowed',
  'infusion:uncommon',
  'item-scrap-green:uncommon',
  'item-scrap-red:legendary',
  'item-scrap-white:common',
  'item-scrap-yellow:boss',
  'kjaro-band:uncommon',
  'laser-scope:legendary',
  'lens-makers-glasses:common',
  'light-flux-pauldron:lunar',
  'little-disciple:boss',
  'lost-seers-lenses:void',
  'lysate-cell:void',
  'mired-urn:boss',
  'mocha:common',
  'molten-perforator:boss',
  'needletick:void',
  'neutronium-weight:lunar',
  'nightmare-demon:hallowed',
  'ocular-hud:equipment',
  'oddly-shaped-opal:common',
  'old-guillotine:uncommon',
  'orphaned-core:legendary',
  'pauls-goat-hoof:common',
  'plasma-shrimp:void',
  'pluripotent-larva:void',
  'pocket-icbm:legendary',
  'polylute:void',
  'predatory-instincts:uncommon',
  'preon-accumulator:equipment',
  'purity:lunar',
  'queens-gland:boss',
  'razorwire:uncommon',
  'recycler:equipment',
  'rejuvenation-rack:legendary',
  'ritual-helmet:hallowed',
  'rose-buckler:uncommon',
  'royal-capacitor:equipment',
  'runald-band:uncommon',
  'rusted-key:common',
  'safer-spaces:void',
  'sanguine-chalice:hallowed',
  'sentient-meat-hook:legendary',
  'shaped-glass:lunar',
  'shatterspleen:boss',
  'shipping-request-form:uncommon',
  'shuriken:uncommon',
  'soldiers-syringe:common',
  'soulbound-catalyst:legendary',
  'spare-drone-parts:legendary',
  'spinel-tonic:lunar-equipment',
  'stained-scimitar:hallowed',
  'strides-of-heresy:lunar',
  'substandard-duplicator:legendary',
  'super-massive-leech:equipment',
  'symbiotic-scorpion:legendary',
  'tentabauble:void',
  'the-back-up:equipment',
  'titanic-knurl:boss',
  'topaz-brooch:common',
  'totem-of-avarice:hallowed',
  'tougher-times:common',
  'transcendence:lunar',
  'tri-tip-dagger:common',
  'ukulele:uncommon',
  'vengeful-spirit:hallowed',
  'vile-censer:hallowed',
  'visions-of-heresy:lunar',
  'voidsent-flame:void',
  'wax-quail:uncommon',
  'weeping-fungus:void',
  'will-o-the-wisp:uncommon',
] as const

describe('canonical item catalogue', () => {
  test('uses unique stable kebab-case IDs', () => {
    const ids = items.map((item) => item.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true)
  })

  test('matches the complete reviewed ID:tier manifest', () => {
    const actual = items.map((item) => `${item.id}:${item.tier}`).sort()

    expect(actual).toEqual(EXPECTED_ID_TIERS)
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
