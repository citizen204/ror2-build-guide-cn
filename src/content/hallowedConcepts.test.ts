import { describe, expect, test } from 'vitest'
import { hallowedItemResearch, items, hexItemResearch } from './items'
import { newSkillResearch, patchFactsBySurvivor } from './patchReview'
import { siteMetadata } from './siteMetadata'
import { sources } from './sources'
import { hcSurvivors } from './survivors/hc'
import { survivors } from './survivors'

const researchItems = [...hallowedItemResearch, ...hexItemResearch]
const sourceIds = new Set(sources.map((source) => source.id))
const itemById = new Map([...items, ...researchItems].map((item) => [item.id, item]))

describe('Hallowed Concepts evidence and publication boundary', () => {
  test('publishes both guides with a visible untested status and keeps old dates separate', () => {
    expect(hcSurvivors.map((guide) => guide.slug)).toEqual(['enforcer', 'acolyte'])
    expect(survivors).toHaveLength(21)
    expect(survivors.filter((guide) => guide.dlc === 'hc')).toEqual(hcSurvivors)
    expect(survivors.filter((guide) => guide.playtestStatus === 'untested')).toEqual(hcSurvivors)
    for (const item of researchItems) expect(items).toContain(item)
    expect(siteMetadata.latestDlc.status).toBe('untested')
    expect(siteMetadata.latestDlc.releasedOn).toBe('2026-10-08')
    expect(siteMetadata.patchBaseline).toBe('2026-10-14')
    expect(siteMetadata.verifiedOn).toBe('2026-08-25')
    expect(siteMetadata.dlcScope.some((dlc) => String(dlc.id) === 'hc')).toBe(true)
  })

  test('tracks all announced Hex and Hallowed identities without manufacturing missing effects', () => {
    expect(researchItems.filter((item) => item.tier === 'hallowed')).toHaveLength(11)
    expect(researchItems.filter((item) => item.tier === 'hex')).toHaveLength(14)
    expect(new Set(researchItems.map((item) => item.id)).size).toBe(25)
    for (const item of researchItems) {
      expect(item.nameZh.trim()).toBeTruthy()
      expect(item.localizationStatus).toBe('game-text-verified')
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

  test.each(hcSurvivors)('$slug guide has all requested chapters and resolvable references', (guide) => {
    expect(guide.playtestStatus).toBe('untested')
    expect(guide.nameZh.trim()).toBeTruthy()
    for (const skill of [...guide.skills, ...(guide.alternativeSkills ?? []), ...(guide.transformationSkills ?? [])]) expect(skill.nameZh.trim(), skill.nameEn).toBeTruthy()
    for (const slot of ['primary', 'secondary', 'utility', 'special']) {
      expect(guide.skills.filter((skill) => skill.slot === slot)).toHaveLength(1)
    }
    expect(guide.alternativeSkills?.length).toBeGreaterThanOrEqual(4)
    expect(guide.buildLogic.length).toBeGreaterThan(0)
    expect(guide.coopAdjustments.length).toBeGreaterThan(0)
    expect(guide.combatNotes.map((note) => note.title)).toEqual(['传送器事件', '首领处理', '飞行敌人', '最终阶段 / 米斯历克斯'])
    expect(guide.commandRoute.map((route) => route.phase)).toEqual(['前期', '中期', '后期'])
    for (const route of guide.commandRoute) {
      expect(route.explanation.trim()).toBeTruthy()
      expect(route.picks.length).toBeGreaterThan(0)
      // Hallowed Shrines drop at random under Command, so they cannot be guaranteed picks.
      for (const id of route.picks) expect(['hallowed', 'hex']).not.toContain(itemById.get(id)?.tier)
    }
    const groups = { ...guide.solo, void: guide.voidItems, lunar: guide.lunarItems, hallowed: guide.hallowedItems ?? [] }
    for (const [tier, picks] of Object.entries(groups)) {
      expect(picks.length).toBeGreaterThan(0)
      for (const pick of picks) {
        expect(itemById.get(pick.itemId)?.tier, pick.itemId).toBe(tier)
        for (const value of [pick.stacks, pick.role, pick.synergy]) expect(value.trim()).toBeTruthy()
      }
    }
    for (const id of guide.sourceIds) {
      expect(sourceIds.has(id), id).toBe(true)
    }
  })

  test('pins names read from the game language files instead of store or 2K translations', () => {
    expect(hcSurvivors.map((guide) => guide.nameZh)).toEqual(['执行者', '侍僧'])
    expect(siteMetadata.latestDlc.inGameNameZh).toBe('神圣观念')
    expect(siteMetadata.gameBuild).toBe('25921972')
    expect(itemById.get('earthbound-vessel')?.nameZh).toBe('地上船')
    expect(itemById.get('hex-of-acceleration')?.nameZh).toBe('加速诅咒')
    const acolyte = hcSurvivors.find((guide) => guide.slug === 'acolyte')!
    expect(acolyte.transformationSkills?.map((skill) => skill.slot)).toEqual(['primary', 'secondary', 'utility', 'special'])
    expect(acolyte.summary).toContain('破碎的仪式')
  })

  test('tracks the six free skills in their official slots with names and unlocks from game text', () => {
    expect(newSkillResearch.map(({ survivorSlug, nameEn, slot }) => [survivorSlug, nameEn, slot])).toEqual([
      ['commando', 'Sabotage', 'special'], ['huntress', 'Laser Cyclone', 'secondary'],
      ['acrid', 'Cloying Breath', 'special'], ['artificer', 'Tectonic Blast', 'utility'],
      ['engineer', 'Laser Cutter', 'primary'], ['rex', 'Proliferation', 'utility'],
    ])
    for (const skill of newSkillResearch) {
      expect(skill.nameZh.trim()).toBeTruthy()
      expect(skill.unlock.trim()).toBeTruthy()
      expect(sourceIds.has(skill.officialSourceId)).toBe(true)
      expect(sourceIds.has(skill.mechanicsSourceId)).toBe(true)
      expect(skill.assessment.trim()).toBeTruthy()
      expect(survivors.some((guide) => guide.slug === skill.survivorSlug)).toBe(true)
    }
    for (const slug of Object.keys(patchFactsBySurvivor)) expect(survivors.some((guide) => guide.slug === slug)).toBe(true)
  })
})
