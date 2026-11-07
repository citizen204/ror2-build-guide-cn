export type DlcId = 'base' | 'sotv' | 'sots' | 'ac' | 'hc' | 'special'

export type ItemTier =
  | 'common'
  | 'uncommon'
  | 'legendary'
  | 'boss'
  | 'equipment'
  | 'lunar'
  | 'lunar-equipment'
  | 'void'
  | 'hex'
  | 'hallowed'

export type Recommendation = 'core' | 'recommended' | 'conditional' | 'avoid'

export type SkillSlot = 'primary' | 'secondary' | 'utility' | 'special' | 'passive'

export type SkillUnlock = 'default' | 'unlock-required' | 'transformation'

export interface SkillChoice {
  slot: SkillSlot
  nameZh: string
  nameEn: string
  icon: string
  unlock: SkillUnlock
  reason: string
}

export interface ItemDefinition {
  id: string
  nameZh: string
  nameEn: string
  tier: ItemTier
  icon: string
  corrupts?: string
}

export interface ItemPick {
  itemId: string
  recommendation: Recommendation
  stacks: string
  role: string
  synergy: string
  alternative?: string
}

export interface BuildSection {
  common: ItemPick[]
  uncommon: ItemPick[]
  legendary: ItemPick[]
  boss: ItemPick[]
  equipment: ItemPick[]
}

export interface StageRoute {
  phase: '前期' | '中期' | '后期'
  picks: string[]
  explanation: string
}

export interface CombatNote {
  title: string
  body: string
}

export interface AlternativeSkill {
  slot: SkillSlot | 'litany'
  nameZh: string
  nameEn: string
  icon: string
  /** Challenge that unlocks the skill; absent when no unlock is recorded. */
  unlockCondition?: string
  assessment: string
}

export interface TransformationSkill {
  slot: SkillSlot
  nameZh: string
  nameEn: string
  icon: string
  facts: string
}

export interface SurvivorGuide {
  slug: string
  nameZh: string
  nameEn: string
  dlc: DlcId
  portrait: string
  role: string
  difficulty: 1 | 2 | 3 | 4 | 5
  summary: string
  skills: SkillChoice[]
  buildLogic: string[]
  solo: BuildSection
  coopAdjustments: string[]
  commandRoute: StageRoute[]
  voidItems: ItemPick[]
  lunarItems: ItemPick[]
  lunarEquipment: ItemPick[]
  combatNotes: CombatNote[]
  sourceIds: string[]
  verifiedOn: string
  /** Set when a guide is published before any in-game build testing. */
  playtestStatus?: 'untested'
  alternativeSkills?: AlternativeSkill[]
  transformationSkills?: TransformationSkill[]
  hallowedItems?: ItemPick[]
}

export interface ItemResearch {
  id: string
  nameEn: string
  tier: 'hex' | 'hallowed'
  icon: string
  nameZh: string
  localizationStatus: 'game-text-verified'
  researchedOn: string
  evidence: 'community-mechanics' | 'identity-only'
  sourceIds: string[]
  effect: string | null
  stacking: string | null
  caveat: string
}
