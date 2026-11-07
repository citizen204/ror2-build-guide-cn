import type { ItemDefinition, ItemResearch } from '../domain/guide'

/** Names come from the game's zh-CN files; mechanics are community records, not playtests. */
export const hallowedItemResearch: ItemResearch[] = /* @__PURE__ */ [
  ['corpse-lily', '尸骸百合', 'Corpse Lily', 'hallowed', '守点区域周期施加枯萎：每五秒附加两层，再加全队每件一层；每层持续三秒、每秒 60% 基础伤害。单人一件在效果持续时为每秒 180%。', '每件额外增加 60%，按全队件数计算；每多一件，烟云早 10% 充能达到最大范围。', '不能把 180% 当作全程平均伤害，事件开始约五秒后才有首次枯萎。游戏描述的扩张比例与社区实现不同。', 'wiki-corpse-lily'],
  ['dream-crucible', '梦境熔炉', 'Dream Crucible', 'hallowed', '有概率代替另一物品承担冷却或消耗；一件基础概率 10%。', '社区记录为非线性：两件 19%、三件 27.1%、五件 41%，符合 1−0.9^件数，并受幸运影响；游戏描述的每件 +10% 不是实际增长。', '十件也不必定触发。代替消耗时所有件数一起消耗，下一关再生，试炼隐藏关内不再生。', 'wiki-dream-crucible'],
  ['earthbound-vessel', '地上船', 'Earthbound Vessel', 'hallowed', '提供三次额外跳跃，未消耗的跳跃每次提供五点护甲。', '每件额外增加两次跳跃；落地恢复时间按件数双曲下降：五秒、四秒、三点三秒。', '拾取时固定只有三次，其余要充能。消耗后的护甲到落地才失去。执行者防御姿态下的跳跃互动待实测。', 'wiki-earthbound-vessel'],
  ['infernal-mark', '炼狱烙印', 'Infernal Mark', 'hallowed', '技能命中累积十次标记后施加灵魂烙印，持续五秒，使目标吸引周围单位并可被其他敌人攻击。', '每件额外增加五秒持续时间；结束后十五秒不能再标记。', '每击按触发系数判定，标记不会过期且由持有者共享；眩晕只有一秒，对首领无效。被其他怪物击杀不触发你的击杀效果。', 'wiki-infernal-mark'],
  ['nightmare-demon', '梦魇恶魔', 'Nightmare Demon', 'hallowed', '技能命中有 20% 基础概率附着梦魇；技能伤害蓄满 1600% 后再命中可引爆并触发击杀效果。', '爆炸为 600% 基础伤害，每件额外增加 600%；二十米内随距离衰减。', '只有技能伤害能附着和蓄能，物品伤害不行；800% 起可半伤引爆。', 'wiki-nightmare-demon'],
  ['ritual-helmet', '仪式头盔', 'Ritual Helmet', 'hallowed', '奔跑蓄能，满十层后加速并生成灵体颅骨，每次伤害消耗一层。', '颅骨为 300% 基础伤害，每件额外增加 100%，再按移动速度缩放。', '一件每层实际约 9.09 米而非描述的 10 米；防御姿态不能奔跑，不应推荐为持续举盾核心。', 'wiki-ritual-helmet'],
  ['sanguine-chalice', '猩红圣杯', 'Sanguine Chalice', 'hallowed', '提供 10% 基础流血概率；自身流血或出血每跳可带来治疗。', '每跳治疗最大生命的 0.5%，每件额外增加 0.5%；社区记录再乘目标身上的流血与出血总层数，包括队友施加的。额外件数不提高流血概率。', '击杀那一跳不治疗；侍僧收到治疗后仍遵循其被动，不能当作直接回血。', 'wiki-sanguine-chalice'],
  ['stained-scimitar', '染血弯刀', 'Stained Scimitar', 'hallowed', '提供 1% 吸血；累计治疗达到最大生命 10% 时生成持续五秒的刀刃，副技能可将刀刃射出。', '每件额外增加 1% 吸血和六把刀刃上限；一件上限六把。', '吸血受触发系数影响且不计暴击；自然回复不计入刀刃，侍僧特殊治疗交互仍需实测。', 'wiki-stained-scimitar'],
  ['totem-of-avarice', '贪婪图腾', 'Totem of Avarice', 'hallowed', '单次达到 400% 的命中可使附近敌人金化，最多五秒，冷却十秒；按暴击前伤害判断。', '社区记录半径实际为十米、每件加十米，游戏描述的五米有误；金钱加成每件 +50%。', '精英与首领金化时间更短，不能冻结的敌人无效。多段总伤害不等于一次命中达标。', 'wiki-totem-of-avarice'],
  ['vengeful-spirit', '复仇之魂', 'Vengeful Spirit', 'hallowed', '召唤守护之灵，分担所受伤害的 50%。', '每件增加一个守护之灵；分担比例不随件数增加，只是由更多灵分摊。', '灵有独立生命且可死亡，死后当关转为休眠，获得友方死亡时的攻速与冷却增益。', 'wiki-vengeful-spirit'],
  ['vile-censer', '邪秽香炉', 'Vile Censer', 'hallowed', '技能命中眩晕目标可引发烟雾连锁，造成 200% 基础伤害。', '每件额外增加 100% 伤害；社区记录范围实际为 14 米，每件额外增加 4 米。', '文本写固定 10% 眩晕及 10 米，社区记录为随缺失生命 0–20% 且乘触发系数；免疫眩晕的目标按缺失生命另算。', 'wiki-vile-censer'],
].map(([id, nameZh, nameEn, tier, effect, stacking, caveat, sourceId]) => ({
  id, nameZh, nameEn, tier: tier as 'hallowed', icon: `assets/items/${id}.png`, effect, stacking, caveat,
  localizationStatus: 'game-text-verified',
  researchedOn: '2026-11-07', evidence: 'community-mechanics', sourceIds: ['game-language-files', sourceId],
}))

/** Names from the game's zh-CN files; mechanics are community records rechecked against game text. */
export const hexItemResearch: ItemResearch[] = /* @__PURE__ */ [
  ['Strife', '争斗诅咒', '每件增加一次山之神龛级别的传送器首领强化，不增加奖励。', '按全队件数累加。', '不是持有者的私人风险；联机需要全队共同承担。'],
  ['Blindness', '失明诅咒', '限制视距；一件为 100 米。', '每多一件再减半。', '早期官方预告写 96 米，已被正式版文本取代。'],
  ['Acceleration', '加速诅咒', '降低加速度并使地面打滑。', '社区记录加速度除以 1.4，此后每件给除数增加 0.3。', '文本所写的降低 40% 不是线性扣减；还叠加地面控制变化。'],
  ['Famine', '饥荒诅咒', '削弱治疗和自然回复。', '社区记录治疗除以 1 + 0.4 × 件数。', '一件实际约减少 28.6%，不是文本直读的 40%；依赖治疗的路线需谨慎。'],
  ['Greed', '贪婪诅咒', '每十五秒把随机库存物品的副本给最多三个附近敌人。', '一件复制一种，每件额外增加一种。', '持有者保留原物；敌人共享副本会改变危险程度。'],
  ['Haunting', '附身诅咒', '使附近互动体附灵，可能被投向玩家。', '社区记录间隔为 60 / (1 + 0.25 × 件数) 秒。', '一件为四十八秒而非文本六十秒；不是只有战斗阶段才有危险。'],
  ['Leaping', '跳跃诅咒', '连续跳跃削弱跳跃初速度，并降低安全坠落距离。', '停止跳跃后六秒恢复，每件额外增加六秒；单次跳跃惩罚不随件数增加。', '描述写跳跃高度，社区实现作用于初速度，不能把二者百分比混用。'],
  ['Loss', '失落诅咒', '周期禁用库存中的一部分物品种类，选中种类的全部件数失效。', '每三十秒轮换；一件禁用 10% 种类，每件额外增加 10%，向上取整。', '初次禁用在拾取后三秒发生；精确核心路线不能只看总件数。'],
  ['Mimicry', '拟态诅咒', '周期生成伪装成箱子的敌人。', '社区记录间隔为 60 / (1 + 0.1 × 件数) 秒；额外件数提高敌人属性。', '一件实际间隔约五十四点五秒；献祭神器也不保证免除生成。'],
  ['Misfortune', '不幸诅咒', '使用互动体可能给自己附加随机减益，机会神龛失败必受惩罚。', '件数同时增加判定次数与减益集合，增长快于线性。', '不能按每件只增加一种减益估计风险；联机不替队友作决定。'],
  ['Ossification', '骨化诅咒', '击杀敌人会给附近其他敌人屏障。', '一件给出死者最大生命 100% 的屏障，半径三十米；每件额外增加 100% 和十五米。', '还存在按受益敌人自身生命的最低屏障；不将它误写成治疗。'],
  ['Pain', '苦痛诅咒', '降低最大生命和护盾。', '社区记录分母为 1 + 0.3 × 件数。', '一件约降低 23.1%；社区记录一件就会取消一击保护，不要放入安全路线。'],
  ['Patience', '耐心诅咒', '离开传送器范围时持续损失生命，对队友同样生效。', '社区状态表记录初始每秒最大生命与护盾合计的 1%；圈外每十秒按 12.5% × 件数复合增加。', '是否与所有守点区域一致仍待核，含执行者信标；不能推荐离圈远程风筝而忽略该惩罚。'],
  ['Rain', '雨水诅咒', '提高随时间增长的难度部分，影响全队。', '单人每件增加 25% 时间难度；联机按人数的 0.75 次方分摊系数。', '不是所有难度直接乘 1.25；拾取后按当前计时回溯计算，晚拿也不是免费。'],
].map(([name, nameZh, effect, stacking, caveat]) => ({
  id: `hex-of-${name.toLowerCase()}`, nameZh, nameEn: `Hex of ${name}`, tier: 'hex',
  icon: `assets/items/hex-of-${name.toLowerCase()}.png`,
  localizationStatus: 'game-text-verified', researchedOn: '2026-11-07',
  evidence: 'community-mechanics', sourceIds: ['game-language-files', `wiki-hex-of-${name.toLowerCase()}`],
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
  ...hallowedItemResearch,
  ...hexItemResearch,
]
