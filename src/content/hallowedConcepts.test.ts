import { describe, expect, test } from 'vitest'
import { hallowedItemResearch, items, hexItemResearch } from './items'
import { newSkillResearch, patchFactsBySurvivor } from './patchReview'
import { siteMetadata } from './siteMetadata'
import { sources } from './sources'
import { hcSurvivorDrafts } from './survivors/hc'
import { survivors } from './survivors'

const researchItems = [...hallowedItemResearch, ...hexItemResearch]
const sourceIds = new Set(sources.map((source) => source.id))
const itemById = new Map([...items, ...researchItems].map((item) => [item.id, item]))

describe('Hallowed Concepts evidence and publication boundary', () => {
  test('keeps unverified drafts out of the public roster and item catalogue', () => {
    expect(hcSurvivorDrafts.map((guide) => guide.slug)).toEqual(['enforcer', 'acolyte'])
    expect(survivors).toHaveLength(19)
    expect(survivors.some((guide) => guide.dlc === 'hc')).toBe(false)
    expect(items.some((item) => researchItems.some((draft) => draft.id === item.id))).toBe(false)
    expect(siteMetadata.pendingDlc.status).toBe('draft')
    expect(siteMetadata.pendingDlc.releasedOn).toBe('2026-10-08')
    expect(siteMetadata.patchBaseline).toBe('2026-10-14')
    expect(siteMetadata.verifiedOn).toBe('2026-08-25')
    expect(siteMetadata.dlcScope.some((dlc) => String(dlc.id) === 'hc')).toBe(false)
  })

  test('tracks all announced Hex and Hallowed identities without manufacturing missing effects', () => {
    expect(researchItems.filter((item) => item.tier === 'hallowed')).toHaveLength(11)
    expect(researchItems.filter((item) => item.tier === 'hex')).toHaveLength(14)
    expect(new Set(researchItems.map((item) => item.id)).size).toBe(25)
    for (const item of researchItems) {
      expect(item.nameZh).toBeNull()
      expect(item.localizationStatus).toBe('pending-game-text')
      expect(item.sourceIds.length).toBeGreaterThan(0)
      expect(item.sourceIds.every((source) => sourceIds.has(source))).toBe(true)
      if (item.evidence === 'identity-only') {
        expect(item.effect).toBeNull()
        expect(item.stacking).toBeNull()
      } else {
        expect(item.effect?.trim()).toBeTruthy()
        expect(item.stacking?.trim()).toBeTruthy()
      }
      expect(item.caveat.trim()).toBeTruthy()
    }
  })

  test.each(hcSurvivorDrafts)('$slug draft has all requested chapters and resolvable references', (guide) => {
    expect(guide.status).toBe('draft')
    expect(guide.localizationStatus).toBe('pending-game-text')
    expect(guide.releaseBlockers.length).toBeGreaterThan(0)
    for (const slot of ['primary', 'secondary', 'utility', 'special']) {
      expect(guide.skills.filter((skill) => skill.slot === slot)).toHaveLength(1)
    }
    expect(guide.alternatives.length).toBeGreaterThanOrEqual(4)
    expect(guide.buildLogic.length).toBeGreaterThan(0)
    expect(guide.coopAdjustments.length).toBeGreaterThan(0)
    expect(guide.combatNotes.map((note) => note.title)).toEqual(['传送器事件', '首领处理', '飞行敌人', '最终阶段 / 米斯历克斯'])
    expect(guide.commandRoute.map((route) => route.phase)).toEqual(['前期', '中期', '后期'])
    for (const route of guide.commandRoute) {
      expect(route.explanation.trim()).toBeTruthy()
      expect(route.picks.length).toBeGreaterThan(0)
      // A research item cannot become a guaranteed Command pick.
      for (const id of route.picks) expect(items.some((item) => item.id === id)).toBe(true)
    }
    const groups = { ...guide.solo, void: guide.voidItems, lunar: guide.lunarItems, hallowed: guide.hallowedItems }
    for (const [tier, picks] of Object.entries(groups)) {
      expect(picks.length).toBeGreaterThan(0)
      for (const pick of picks) {
        expect(itemById.get(pick.itemId)?.tier, pick.itemId).toBe(tier)
        for (const value of [pick.stacks, pick.role, pick.synergy]) expect(value.trim()).toBeTruthy()
      }
    }
    for (const id of [...guide.sourceIds, ...guide.skills.flatMap((skill) => skill.sourceIds), ...guide.alternatives.flatMap((skill) => skill.sourceIds)]) {
      expect(sourceIds.has(id), id).toBe(true)
    }
  })

  test('tracks the six free skills in their official slots without pretending to know game translations', () => {
    expect(newSkillResearch.map(({ survivorSlug, nameEn, slot }) => [survivorSlug, nameEn, slot])).toEqual([
      ['commando', 'Sabotage', 'special'], ['huntress', 'Laser Cyclone', 'secondary'],
      ['acrid', 'Cloying Breath', 'special'], ['artificer', 'Tectonic Blast', 'utility'],
      ['engineer', 'Laser Cutter', 'primary'], ['rex', 'Proliferation', 'utility'],
    ])
    for (const skill of newSkillResearch) {
      expect(skill.nameZh).toBeNull()
      expect(sourceIds.has(skill.officialSourceId)).toBe(true)
      expect(sourceIds.has(skill.mechanicsSourceId)).toBe(true)
      expect(skill.assessment.trim()).toBeTruthy()
      expect(survivors.some((guide) => guide.slug === skill.survivorSlug)).toBe(true)
    }
    for (const slug of Object.keys(patchFactsBySurvivor)) expect(survivors.some((guide) => guide.slug === slug)).toBe(true)
  })
})
