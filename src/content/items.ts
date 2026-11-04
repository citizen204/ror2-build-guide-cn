import type { ItemDefinition, ItemResearch } from '../domain/guide'

/** Never merge research records into `items` until game localization and assets are checked. */
export const hallowedItemResearch: ItemResearch[] = /* @__PURE__ */ [
  ['corpse-lily', 'Corpse Lily', 'hallowed', '守点区域周期施加枯萎；单人一件在效果持续时为每秒 180% 基础伤害。', '每件额外增加 60%；按全队件数计算。', '持续三秒、每五秒施加一次；不能把 180% 当作全程平均伤害。', 'wiki-corpse-lily'],
  ['dream-crucible', 'Dream Crucible', 'hallowed', '有概率代替另一物品承担冷却或消耗；一件基础概率 10%。', '文本写每件额外增加 10%；实际概率公式仍待游戏代码核对。', '冷却代替和消耗代替是不同事件；不要沿用预告中笼统的每关一次。', 'wiki-dream-crucible'],
  ['earthbound-vessel', 'Earthbound Vessel', 'hallowed', '提供三次额外跳跃，未消耗的跳跃每次提供五点护甲。', '每件额外增加两次跳跃；落地充能时间的实际公式待核。', '当前仅核对社区数据表描述；防御姿态下的跳跃互动待实测。', 'wiki-hc-items'],
  ['infernal-mark', 'Infernal Mark', 'hallowed', '技能命中累积十次标记后施加灵魂烙印，持续五秒，使目标可被其他敌人攻击。', '每件额外增加五秒持续时间；结束后十五秒不能再标记。', '每击增加标记的概率受触发系数影响；物品伤害不能直接当成技能命中。', 'wiki-infernal-mark'],
  ['nightmare-demon', 'Nightmare Demon', 'hallowed', '技能命中有 20% 基础概率附着梦魇；技能伤害蓄满 1600% 后再命中可引爆并触发击杀效果。', '爆炸为 600% 基础伤害，每件额外增加 600%。', '基础概率受触发系数影响；不要求先击杀首领，但必须完成蓄能与引爆。', 'wiki-nightmare-demon'],
  ['ritual-helmet', 'Ritual Helmet', 'hallowed', '冲刺移动蓄能，满十次充能后可用撞击消耗充能造成伤害。', '撞击为 300% 基础伤害，每件额外增加 100%，再按移动速度缩放。', '文本与实现的蓄能距离不同；举盾不能冲刺，不应推荐为持续举盾核心。', 'wiki-ritual-helmet'],
  ['sanguine-chalice', 'Sanguine Chalice', 'hallowed', '提供 10% 基础流血概率；自身流血伤害跳数可带来治疗。', '每跳治疗最大生命的 0.5%，每件额外增加 0.5%；额外件数不提高流血概率。', '触发系数影响流血概率；侍僧收到治疗后仍遵循其被动，不能当作直接回血。', 'wiki-sanguine-chalice'],
  ['stained-scimitar', 'Stained Scimitar', 'hallowed', '提供 1% 吸血；累计治疗达到最大生命 10% 时生成持续五秒的刀刃，副技能可将刀刃射出。', '每件额外增加 1% 吸血和六把刀刃上限；一件上限六把。', '吸血受触发系数影响；自然回复不计入刀刃，侍僧特殊治疗交互仍需实测。', 'wiki-stained-scimitar'],
  ['totem-of-avarice', 'Totem of Avarice', 'hallowed', '单次高于 400% 的命中可使附近敌人金化，持续五秒，冷却十秒。', '金化半径在描述与数据表中不一致，暂不填入具体叠加结论。', '多段总伤害不等于一次命中超过阈值。', 'wiki-hc-items'],
  ['vengeful-spirit', 'Vengeful Spirit', 'hallowed', '召唤保护灵，分担所受伤害的 50%。', '每件增加一个保护灵；分担比例不随件数增加。', '保护灵可死亡；不能作为永久减伤，重生及复仇效果需完整复核。', 'wiki-vengeful-spirit'],
  ['vile-censer', 'Vile Censer', 'hallowed', '技能命中眩晕目标可引发烟雾连锁，造成 200% 基础伤害。', '每件额外增加 100% 伤害；社区实现记录范围为 14 米，每件额外增加 4 米。', '文本写固定 10% 眩晕及 10 米范围，社区实现与之不同；不把文本直接当实测。', 'wiki-vile-censer'],
].map(([id, nameEn, tier, effect, stacking, caveat, sourceId]) => ({
  id, nameEn, tier: tier as 'hallowed', effect, stacking, caveat,
  nameZh: null, localizationStatus: 'pending-game-text',
  researchedOn: '2026-11-04', evidence: 'community-mechanics', sourceIds: [sourceId],
}))

/** Community observations; all game-localization checks remain pending. */
export const hexItemResearch: ItemResearch[] = /* @__PURE__ */ [
  ['Strife', '每件增加一次山之神龛级别的传送器首领强化，不增加奖励。', '按全队件数累加。', '不是持有者的私人风险；联机需要全队共同承担。'],
  ['Blindness', '限制视距；社区正式版资料记录一件为 100 米。', '每多一件再减半。', '早期官方预告写 96 米；正式版游戏文本与实现仍需核验，不能混用。'],
  ["Acceleration", "降低加速度并使地面打滑。", "社区记录加速度除以 1.4，此后每件给除数增加 0.3。", "文本所写的降低 40% 不是线性扣减；还叠加地面控制变化。"],
  ["Famine", "削弱治疗和自然回复。", "社区记录治疗除以 1 + 0.4 × 件数。", "一件实际约减少 28.6%，不是文本直读的 40%；依赖治疗的路线需谨慎。"],
  ["Greed", "每十五秒把随机库存物品的副本给最多三个附近敌人。", "一件复制一种，每件额外增加一种。", "持有者保留原物；敌人共享副本会改变危险程度。"],
  ["Haunting", "使附近互动体附灵，可能被投向玩家。", "社区记录间隔为 60 / (1 + 0.25 × 件数) 秒。", "一件为四十八秒而非文本六十秒；不是只有战斗阶段才有危险。"],
  ["Leaping", "连续跳跃削弱跳跃初速度，并降低安全坠落距离。", "停止跳跃后六秒恢复，每件额外增加六秒；单次跳跃惩罚不随件数增加。", "描述写跳跃高度，社区实现作用于初速度，不能把二者百分比混用。"],
  ["Loss", "周期禁用库存中的一部分物品种类，选中种类的全部件数失效。", "每三十秒轮换；一件禁用 10% 种类，每件额外增加 10%，向上取整。", "初次禁用可能在拾取后三秒发生；精确核心路线不能只看总件数。"],
  ["Mimicry", "周期生成伪装成箱子的敌人。", "社区记录间隔为 60 / (1 + 0.1 × 件数) 秒；额外件数提高敌人属性。", "一件实际间隔约五十四点五秒；献祭神器也不保证免除生成。"],
  ["Misfortune", "使用互动体可能给自己附加随机减益，机会神龛失败必受惩罚。", "件数同时增加判定次数与减益集合，增长快于线性。", "不能按每件只增加一种减益估计风险；联机不替队友作决定。"],
  ["Ossification", "击杀敌人会给附近其他敌人屏障。", "一件给出死者最大生命 100% 的屏障，半径三十米；每件额外增加 100% 和十五米。", "还存在按受益敌人自身生命的最低屏障；不将它误写成治疗。"],
  ["Pain", "降低最大生命和护盾。", "社区记录分母为 1 + 0.3 × 件数。", "一件约降低 23.1%；社区记录会取消一击保护，须实测后才能放入安全路线。"],
  ["Patience", "离开传送器范围时持续损失生命。", "社区状态表记录初始每秒最大生命与护盾合计的 1%；圈外每十秒按 12.5% × 件数复合增加。", "是否与所有守点区域一致仍待核；不能推荐离圈远程风筝而忽略该惩罚。"],
  ["Rain", "提高随时间增长的难度部分，影响全队。", "单人每件增加 25% 时间难度；联机按人数的 0.75 次方分摊系数。", "不是所有难度直接乘 1.25；拾取后按当前计时回溯计算，晚拿也不是免费。"],
].map(([name, effect, stacking, caveat]) => ({
  id: `hex-of-${name.toLowerCase()}`, nameEn: `Hex of ${name}`, tier: 'hex',
  nameZh: null, localizationStatus: 'pending-game-text', researchedOn: '2026-11-04',
  evidence: 'community-mechanics', sourceIds: [`wiki-hex-of-${name.toLowerCase()}`],
  effect, stacking, caveat,
}))

function item(
  id: string,
  nameZh: string,
  nameEn: string,
  tier: ItemDefinition['tier'],
  corrupts?: string,
): ItemDefinition {
  return {
    id,
    nameZh,
    nameEn,
    tier,
    icon: `assets/items/${id}.png`,
    ...(corrupts ? { corrupts } : {}),
  }
}

/**
 * Canonical catalogue for every item referenced by the survivor research notes.
 * English names and tiers follow the in-game logbook/wiki.gg item index. The
 * Chinese labels are matched to the current installed game's official zh-CN
 * localization bundle (verified 2026-08-25).
 */
export const items: ItemDefinition[] = [
  // Common (white)
  item('lens-makers-glasses', '透镜制作者的眼镜', "Lens-Maker's Glasses", 'common'),
  item('soldiers-syringe', '士兵的注射器', "Soldier's Syringe", 'common'),
  item('mocha', '摩卡', 'Mocha', 'common'),
  item('pauls-goat-hoof', '保罗的山羊蹄', "Paul's Goat Hoof", 'common'),
  item('energy-drink', '能量饮料', 'Energy Drink', 'common'),
  item('tougher-times', '更艰难的时光', 'Tougher Times', 'common'),
  item('bustling-fungus', '爆裂真菌', 'Bustling Fungus', 'common'),
  item('crowbar', '撬棍', 'Crowbar', 'common'),
  item('tri-tip-dagger', '三尖匕首', 'Tri-Tip Dagger', 'common'),
  item('cautious-slug', '谨慎的蛞蝓', 'Cautious Slug', 'common'),
  item('gasoline', '汽油', 'Gasoline', 'common'),
  item('backup-magazine', '备用弹夹', 'Backup Magazine', 'common'),
  item('armor-piercing-rounds', '穿甲弹', 'Armor-Piercing Rounds', 'common'),
  item('topaz-brooch', '黄晶胸针', 'Topaz Brooch', 'common'),
  item('focus-crystal', '凝神水晶', 'Focus Crystal', 'common'),
  item('oddly-shaped-opal', '奇形怪状的蛋白石', 'Oddly-shaped Opal', 'common'),
  item('delicate-watch', '易碎手表', 'Delicate Watch', 'common'),
  item('rusted-key', '生锈的钥匙', 'Rusted Key', 'common'),
  item('item-scrap-white', '物品碎片，白色', 'Item Scrap, White', 'common'),

  // Uncommon (green)
  item('atg-missile-mk-1', '空对地导弹1号', 'AtG Missile Mk. 1', 'uncommon'),
  item('ukulele', '尤克里里', 'Ukulele', 'uncommon'),
  item('hopoo-feather', '霍普羽毛', 'Hopoo Feather', 'uncommon'),
  item('kjaro-band', '贾罗的手环', "Kjaro's Band", 'uncommon'),
  item('runald-band', '鲁纳德的手环', "Runald's Band", 'uncommon'),
  item('will-o-the-wisp', '鬼火', "Will-o'-the-wisp", 'uncommon'),
  item('wax-quail', '蜡鹌鹑', 'Wax Quail', 'uncommon'),
  item('shuriken', '手里剑', 'Shuriken', 'uncommon'),
  item('predatory-instincts', '捕食本能', 'Predatory Instincts', 'uncommon'),
  item('harvesters-scythe', '收割者镰刀', "Harvester's Scythe", 'uncommon'),
  item('fuel-cell', '燃料电池', 'Fuel Cell', 'uncommon'),
  item('rose-buckler', '玫瑰圆盾', 'Rose Buckler', 'uncommon'),
  item('infusion', '浸剂', 'Infusion', 'uncommon'),
  item('razorwire', '剃刀尖网', 'Razorwire', 'uncommon'),
  item('chronobauble', '时空装置', 'Chronobauble', 'uncommon'),
  item('death-mark', '湮灭标记', 'Death Mark', 'uncommon'),
  item('old-guillotine', '陈旧断头台', 'Old Guillotine', 'uncommon'),
  item('ignition-tank', '点火罐', 'Ignition Tank', 'uncommon'),
  item('shipping-request-form', '运输申请单', 'Shipping Request Form', 'uncommon'),
  item('box-of-dynamite', '一箱炸药', 'Box of Dynamite', 'uncommon'),
  item('collectors-compulsion', '收藏者的冲动', "Collector's Compulsion", 'uncommon'),
  item('item-scrap-green', '物品碎片，绿色', 'Item Scrap, Green', 'uncommon'),

  // Legendary (red)
  item('brilliant-behemoth', '完美巨兽', 'Brilliant Behemoth', 'legendary'),
  item('57-leaf-clover', '57片叶子的三叶草', '57 Leaf Clover', 'legendary'),
  item('alien-head', '外星脑袋', 'Alien Head', 'legendary'),
  item('hardlight-afterburner', '强光补燃器', 'Hardlight Afterburner', 'legendary'),
  item('h3ad-5t-v2', '动能脚环', 'H3AD-5T v2', 'legendary'),
  item('soulbound-catalyst', '灵魂绑定触媒', 'Soulbound Catalyst', 'legendary'),
  item('spare-drone-parts', '无人机配件', 'Spare Drone Parts', 'legendary'),
  item('dios-best-friend', '迪奥最好的朋友', "Dio's Best Friend", 'legendary'),
  item('rejuvenation-rack', '回春支架', 'Rejuvenation Rack', 'legendary'),
  item('laser-scope', '激光瞄准镜', 'Laser Scope', 'legendary'),
  item('sentient-meat-hook', '感应肉钩', 'Sentient Meat Hook', 'legendary'),
  item('ceremonial-dagger', '仪式用匕首', 'Ceremonial Dagger', 'legendary'),
  item('frost-relic', '冰霜圣物', 'Frost Relic', 'legendary'),
  item('aegis', '庇护', 'Aegis', 'legendary'),
  item('symbiotic-scorpion', '共生蝎', 'Symbiotic Scorpion', 'legendary'),
  item('pocket-icbm', '袖珍型洲际导弹', 'Pocket I.C.B.M.', 'legendary'),
  item('bens-raincoat', '本的雨衣', "Ben's Raincoat", 'legendary'),
  item('orphaned-core', '遗落核心', 'Orphaned Core', 'legendary'),
  item('substandard-duplicator', '标准复制器', 'Substandard Duplicator', 'legendary'),
  item('defensive-microbots', '防御用微型机器人', 'Defensive Microbots', 'legendary'),
  item('item-scrap-red', '物品碎片，红色', 'Item Scrap, Red', 'legendary'),

  // Boss (yellow)
  item('titanic-knurl', '巨型隆起', 'Titanic Knurl', 'boss'),
  item('queens-gland', '女王的腺体', "Queen's Gland", 'boss'),
  item('genesis-loop', '创世之环', 'Genesis Loop', 'boss'),
  item('little-disciple', '小门徒', 'Little Disciple', 'boss'),
  item('molten-perforator', '熔融钻机', 'Molten Perforator', 'boss'),
  item('charged-perforator', '电能钻机', 'Charged Perforator', 'boss'),
  item('mired-urn', '泥沼之瓮', 'Mired Urn', 'boss'),
  item('shatterspleen', '易爆的脾脏', 'Shatterspleen', 'boss'),
  item('empathy-cores', '共情核心', 'Empathy Cores', 'boss'),
  item('defense-nucleus', '防御核心', 'Defense Nucleus', 'boss'),
  item('item-scrap-yellow', '物品碎片，黄色', 'Item Scrap, Yellow', 'boss'),

  // Equipment (orange)
  item('royal-capacitor', '皇家电容器', 'Royal Capacitor', 'equipment'),
  item('disposable-missile-launcher', '一次性导弹发射器', 'Disposable Missile Launcher', 'equipment'),
  item('recycler', '回收机', 'Recycler', 'equipment'),
  item('executive-card', '钻石会员卡', 'Executive Card', 'equipment'),
  item('gorags-opus', '古拉格的杰作', "Gorag's Opus", 'equipment'),
  item('ocular-hud', '眼部平视显示', 'Ocular HUD', 'equipment'),
  item('preon-accumulator', '前子蓄能器', 'Preon Accumulator', 'equipment'),
  item('the-back-up', '对讲机', 'The Back-up', 'equipment'),
  item('super-massive-leech', '超巨型水蛭', 'Super Massive Leech', 'equipment'),
  item('forgive-me-please', '请原谅我', 'Forgive Me Please', 'equipment'),
  item('deus-ex-machina', '机械降神', 'Deus Ex Machina', 'equipment'),

  // Lunar (blue)
  item('gesture-of-the-drowned', '溺亡者的心意', 'Gesture of the Drowned', 'lunar'),
  item('spinel-tonic', '尖晶强心剂', 'Spinel Tonic', 'lunar-equipment'),
  item('shaped-glass', '塑形玻璃', 'Shaped Glass', 'lunar'),
  item('transcendence', '超绝', 'Transcendence', 'lunar'),
  item('purity', '纯净', 'Purity', 'lunar'),
  item('light-flux-pauldron', '光通量肩甲', 'Light Flux Pauldron', 'lunar'),
  item('corpsebloom', '尸爆', 'Corpsebloom', 'lunar'),
  item('brittle-crown', '易碎王冠', 'Brittle Crown', 'lunar'),
  item('focused-convergence', '专注趋同', 'Focused Convergence', 'lunar'),
  item('neutronium-weight', '中子重量', 'Neutronium Weight', 'lunar'),
  item('visions-of-heresy', '异端幻象', 'Visions of Heresy', 'lunar'),
  item('hooks-of-heresy', '异端之钩', 'Hooks of Heresy', 'lunar'),
  item('strides-of-heresy', '异端跨越', 'Strides of Heresy', 'lunar'),
  item('essence-of-heresy', '异端精华', 'Essence of Heresy', 'lunar'),

  // Void (purple). `corrupts` is the exact original item replaced on pickup.
  item('needletick', '虚空针尖', 'Needletick', 'void', 'tri-tip-dagger'),
  item('lost-seers-lenses', '失落先知的透镜', "Lost Seer's Lenses", 'void', 'lens-makers-glasses'),
  item('weeping-fungus', '哭泣真菌', 'Weeping Fungus', 'void', 'bustling-fungus'),
  item('safer-spaces', '更安全的空间', 'Safer Spaces', 'void', 'tougher-times'),
  item('encrusted-key', '结壳的钥匙', 'Encrusted Key', 'void', 'rusted-key'),
  item('polylute', '聚合鲁特琴', 'Polylute', 'void', 'ukulele'),
  item('plasma-shrimp', '等离子虾', 'Plasma Shrimp', 'void', 'atg-missile-mk-1'),
  item('tentabauble', '触手装置', 'Tentabauble', 'void', 'chronobauble'),
  item('voidsent-flame', '虚空源焰', 'Voidsent Flame', 'void', 'will-o-the-wisp'),
  item('lysate-cell', '溶菌电池', 'Lysate Cell', 'void', 'fuel-cell'),
  item('benthic-bloom', '海底之花', 'Benthic Bloom', 'void', '57-leaf-clover'),
  item('pluripotent-larva', '多能性幼体', 'Pluripotent Larva', 'void', 'dios-best-friend'),
]
