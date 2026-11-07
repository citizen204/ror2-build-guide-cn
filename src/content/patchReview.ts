import type { SkillSlot } from '../domain/guide'

export interface SkillResearch {
  survivorSlug: string
  nameEn: string
  slot: SkillSlot
  officialSourceId: string
  mechanicsSourceId: string
  researchedOn: string
  nameZh: string
  icon: string
  unlock: string
  facts: string
  assessment: string
}

/** Official existence/slot is separate from community mechanics and editorial choices. */
export const newSkillResearch: SkillResearch[] = [
  ['commando', '蓄意破坏', '在获得 8 点业力后击败终极首领', 'Sabotage', 'special', '三枚可附着炸药，受到攻击时电击敌人；每枚 400%，社区记录冷却七秒。', '可研究爆发分支；不能把三枚伤害相加后直接当作一次命中计算手环。'],
  ['huntress', '激光旋风', '25 分钟内从堡垒的橱柜取得一件神器', 'Laser Cyclone', 'secondary', '接回时再次输入可续投；社区记录基础每秒 400%，每次续投再增加每秒 400%。', '可研究副技能弹匣与持续命中分支；每秒伤害不能直接当手环单击倍率。'],
  ['acrid', '黏腻吐息', '至少用秩序神龛重排一次物品后通关', 'Cloying Breath', 'special', '留下持续毒雾；社区记录每秒 240%、冷却十二秒。', '适合研究守点持续命中；替换传播技能会改变对分散敌人的处理方式，不直接判定更强。'],
  ['artificer', '构造爆破', '不激活任何柱子到达月球的终极首领面前', 'Tectonic Blast', 'utility', '八片各 100% 伤害碎片并施加油效果；社区记录冷却七秒。', '可研究点燃协同，但失去原有冰冻工具；应同时评估生存，不只比较伤害。'],
  ['engineer', '激光切割器', '用逃生舱的燃料组件修理装备无人机', 'Laser Cutter', 'primary', '重型激光，描述为每秒 270%–630%，可治疗炮台与无人机。', '可研究本体持续命中和机械治疗；不会仅因本体换主技能就改变炮台武器。'],
  ['rex', '增殖生长', '携带至少 5 种不同的月球物品通关', 'Proliferation', 'utility', '消耗 20% 生命种下会射击的花，对花使用辅助技能可传送并恢复 20% 生命；最多同时两朵。', '可研究预置退路；种花有自伤成本，不能当作原本无自伤位移路线的直接升级。'],
].map(([survivorSlug, nameZh, unlock, nameEn, slot, facts, assessment]) => ({
  survivorSlug, nameZh, unlock, nameEn, slot: slot as SkillSlot, facts, assessment,
  icon: `assets/skills/${survivorSlug}/${nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
  officialSourceId: 'official-hc-release', mechanicsSourceId: `wiki-hc-${survivorSlug}-skill`,
  researchedOn: '2026-11-07',
}))

export const patchFactsBySurvivor: Record<string, string[]> = {
  commando: ['官方已修复主攻攻速上限低于预期的问题；旧版本观察到的上限不再可靠。'],
  engineer: ['气泡护盾已修复对盾外爆炸的阻挡，炮台已修复临时物品继承。'],
  operator: ['防火墙的外部爆炸阻挡已修复，运输无人机攻击静止敌人的崩溃已修复。'],
  'false-son': ['父之激光已修复攻速缩放，激光爆发补充尖刺后的相关触发也已修复。'],
  'mul-t': ['切换工具已修复首件装备落入无法访问栏位的问题。'],
  mercenary: ['剔骨已改为穿过盟友，减少联机时错误追踪队友的情况。'],
  drifter: ['已修复禁用合金意念时被动失效、错误收回自己及部分队友越界传回问题。'],
  seeker: ['已修复缓刑与火山之卵导致的越界问题。'],
  chef: ['已修复跳跃、落地与翻滚交互的部分动作问题。'],
  railgunner: ['已修复关闭虚空幸存者时磁力加速器失效的问题。'],
}

export const sharedPatchFacts = [
  '符文透镜与空对地导弹之间可能无限触发的连锁已修复，不能沿用无限连锁构筑。',
  '首关神龛与红装掉落已调整，旧的固定首关经济预期需要重新评估。',
  '新增可选业力系统会提高月球终战难度；原终战建议未完成业力路线实测。',
]
