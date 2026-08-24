import { describe, expect, test } from 'vitest'
import { items } from '../items'
import { sources } from '../sources'
import { EXPECTED_SURVIVOR_SLUGS, validateGuideData } from '../../domain/validateGuideData'
import { survivors } from './index'

describe('publishable survivor guides', () => {
  test('exports all 19 survivors in canonical order', () => {
    expect(survivors.map((guide) => guide.slug)).toEqual(EXPECTED_SURVIVOR_SLUGS)
  })

  test('passes the complete guide-domain validation', () => {
    expect(validateGuideData(survivors, items)).toEqual([])
  })

  test('contains readable editorial detail for every guide and item recommendation', () => {
    for (const guide of survivors) {
      expect(guide.summary.length, `${guide.slug} summary`).toBeGreaterThan(30)
      expect(guide.buildLogic.join('').length, `${guide.slug} build logic`).toBeGreaterThan(120)
      expect(guide.combatNotes.length, `${guide.slug} combat notes`).toBeGreaterThanOrEqual(4)

      const picks = [
        ...guide.solo.common,
        ...guide.solo.uncommon,
        ...guide.solo.legendary,
        ...guide.solo.boss,
        ...guide.solo.equipment,
        ...guide.voidItems,
        ...guide.lunarItems,
      ]

      for (const pick of picks) {
        expect(pick.role.length, `${guide.slug}/${pick.itemId} role`).toBeGreaterThan(10)
        expect(pick.synergy.length, `${guide.slug}/${pick.itemId} synergy`).toBeGreaterThan(10)
      }
    }
  })

  test('uses the reviewed DLC-sized roster groups', () => {
    const counts = survivors.reduce<Record<string, number>>((result, guide) => {
      result[guide.dlc] = (result[guide.dlc] ?? 0) + 1
      return result
    }, {})

    expect(counts).toEqual({ base: 11, sotv: 2, sots: 3, ac: 2, special: 1 })
  })

  test('references only registered research sources', () => {
    const sourceIds = new Set(sources.map((source) => source.id))

    for (const guide of survivors) {
      for (const sourceId of guide.sourceIds) {
        expect(sourceIds.has(sourceId), `${guide.slug}/${sourceId}`).toBe(true)
      }
    }
  })

  test('uses valid item IDs in every Command phase', () => {
    const itemIds = new Set(items.map((item) => item.id))

    for (const guide of survivors) {
      expect(guide.commandRoute.map((route) => route.phase)).toEqual(['前期', '中期', '后期'])
      for (const route of guide.commandRoute) {
        for (const itemId of route.picks) {
          expect(itemIds.has(itemId), `${guide.slug}/${route.phase}/${itemId}`).toBe(true)
        }
      }
    }
  })

  test('preserves reviewed conditional Lunar recommendation labels', () => {
    const expected = {
      engineer: { 'gesture-of-the-drowned': 'conditional', transcendence: 'recommended' },
      rex: { purity: 'conditional' },
      seeker: { 'gesture-of-the-drowned': 'conditional' },
      chef: { 'light-flux-pauldron': 'conditional' },
      'false-son': { 'light-flux-pauldron': 'conditional' },
      operator: { 'gesture-of-the-drowned': 'conditional' },
      drifter: { 'gesture-of-the-drowned': 'conditional', 'light-flux-pauldron': 'conditional' },
    } as const

    for (const [slug, recommendations] of Object.entries(expected)) {
      const guide = survivors.find((candidate) => candidate.slug === slug)
      expect(guide, slug).toBeDefined()
      for (const [itemId, recommendation] of Object.entries(recommendations)) {
        expect(
          guide?.lunarItems.find((item) => item.itemId === itemId)?.recommendation,
          `${slug}/${itemId}`,
        ).toBe(recommendation)
      }
    }
  })

  test('models Captain beacons and Operator starting drones as exact local skill choices', () => {
    const captain = survivors.find((guide) => guide.slug === 'captain')
    const captainSpecial = captain?.skills.find((candidate) => candidate.slot === 'special')
    expect(captainSpecial).toMatchObject({
      nameEn: 'Beacon: Hacking',
      unlock: 'unlock-required',
      icon: 'assets/skills/captain/beacon-hacking.png',
    })
    expect(captainSpecial?.reason).toContain('两格')

    const operator = survivors.find((guide) => guide.slug === 'operator')
    const passiveChoices = operator?.skills.filter((candidate) => candidate.slot === 'passive')
    expect(passiveChoices?.map(({ nameEn, unlock, icon }) => ({ nameEn, unlock, icon }))).toEqual([
      { nameEn: 'Drone Tech', unlock: 'default', icon: 'assets/skills/operator/drone-tech.png' },
      { nameEn: 'Gunner Drone Mk 2', unlock: 'default', icon: 'assets/skills/operator/gunner-drone-mk-2.png' },
      { nameEn: 'Healing Drone Mk 2', unlock: 'default', icon: 'assets/skills/operator/healing-drone-mk-2.png' },
    ])
  })

  test('cites the direct Mired Urn source wherever Seeker and CHEF publish its current targeting', () => {
    for (const slug of ['seeker', 'chef']) {
      expect(survivors.find((guide) => guide.slug === slug)?.sourceIds).toContain('wiki-mired-urn')
    }
  })
})
