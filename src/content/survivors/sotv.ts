import type { CombatNote, ItemPick, Recommendation, SkillChoice, SkillSlot, SkillUnlock, SurvivorGuide } from '../../domain/guide'

const verifiedOn = '2026-08-25'

function pick(itemId: string, recommendation: Recommendation, stacks: string, role: string, synergy: string, alternative?: string): ItemPick {
  return { itemId, recommendation, stacks, role, synergy, ...(alternative ? { alternative } : {}) }
}

function skill(slug: string, slot: SkillSlot, nameZh: string, nameEn: string, unlock: SkillUnlock, reason: string): SkillChoice {
  const fileName = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return { slot, nameZh, nameEn, icon: `assets/skills/${slug}/${fileName}.png`, unlock, reason }
}

function combat(teleporter: string, boss: string, flying: string, finalStage: string): CombatNote[] {
  return [
    { title: '传送器事件', body: teleporter },
    { title: '首领处理', body: boss },
    { title: '飞行敌人', body: flying },
    { title: '最终阶段 / 米斯历克斯', body: finalStage },
  ]
}

export const sotvSurvivors: SurvivorGuide[] = [
  {
    slug: 'railgunner',
    nameZh: '磁轨炮手',
    nameEn: 'Railgunner',
    dlc: 'sotv',
    portrait: 'assets/survivors/railgunner.png',
    role: '超远程弱点狙击与单发强击爆发',
    difficulty: 4,
    summary: '瞄准弱点必定暴击，并把暴击率转换为弱点暴击伤害；稳定输出来自准确命中、完美换弹、撬棍和双手环，而不是无脑堆高频触发。',
    skills: [
      skill('railgunner', 'passive', '磁力加速器', 'Magnetic Accelerator', 'default', '弱点必暴击，并把暴击率转换成额外弱点暴击伤害。'),
      skill('railgunner', 'primary', '智能弹系统', 'XQR Smart Round System', 'default', '唯一非瞄准主攻，自导弹用于清理贴身小怪。'),
      skill('railgunner', 'secondary', '狙击枪', 'M99 Sniper', 'default', '1000% 强击配完美换弹，远程稳定性优于精确射手步枪。'),
      skill('railgunner', 'utility', '震荡装置', 'Concussion Device', 'default', '两层爆破可推动自身，弥补原生机动并保留紧急撤离。'),
      skill('railgunner', 'special', '冷冻充能', 'Cryocharge', 'unlock-required', '2000% 冻结且没有五秒禁枪，稳定性优于超级充能。'),
    ],
    buildLogic: [
      '狙击枪命中弱点后完成完美换弹是核心时间轴；完美换弹提供的基础伤害加成不会自动延伸到弹匣追加射击，因此不优先堆备用弹夹。',
      '撬棍提高满血首击，暴击眼镜转成弱点倍率，双手环由高倍率狙击稳定触发；三类组件共同决定一枪阈值。',
      '冷冻充能冻结后仍需再补一枪，才能利用低血非首领处决；震荡装置始终留至少一层处理近身。',
      '瞄准时先找掩体和高点，每枪后移动再换弹；伤害成型后优先补额外跳跃、位移充能、本的雨衣与复活。',
    ],
    solo: {
      common: [
        pick('crowbar', 'core', '5–10 件', '放大满血弱点狙击并提高一枪处决线', '狙击枪与冷冻充能都是高倍率首击，能完整兑现撬棍乘区。'),
        pick('lens-makers-glasses', 'core', '目标 10 件暴击等效', '把暴击率转换成额外弱点暴击伤害', '弱点本来必暴击，眼镜价值体现在磁力加速器的倍率转换。'),
        pick('armor-piercing-rounds', 'recommended', '3–5 件', '强化传送器首领和米斯历克斯单体爆发', '与撬棍、弱点倍率和手环相乘，是终局首领最稳定白色增伤。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件', '让高倍率狙击稳定触发火环范围爆发', '狙击枪与特殊技能轻松超过触发阈值，首件改善清群最明显。'),
        pick('runald-band', 'core', '1 件', '让同一发狙击同步触发冰环伤害与减速', '与贾罗的手环组成一套完整强击资源，不需优先继续堆冰环。'),
        pick('hopoo-feather', 'recommended', '1–2 件', '补充震荡装置之外的垂直与落点修正', '瞄准站位和最终阶段都需要独立跳跃，避免只靠自爆位移。'),
      ],
      legendary: [
        pick('laser-scope', 'core', '1 件', '进一步放大所有弱点必暴击的伤害倍率', '与暴击率转换叠加，是狙击成型后的首选伤害红。'),
        pick('bens-raincoat', 'recommended', '1 件', '阻挡一个有时限减益并获得临时屏障', '当前为传奇物品，五秒后恢复充能，保护瞄准与换弹窗口。'),
      ],
      boss: [
        pick('shatterspleen', 'core', '1 件', '利用弱点必暴击施加流血并制造击杀爆炸', '狙击天然保证暴击，单发处决后能显著修复清群短板。'),
        pick('molten-perforator', 'recommended', '1 件起', '让高伤狙击触发额外火焰钻机爆发', '强击的完整触发可放大首领窗口，与撬棍双环同步。'),
      ],
      equipment: [
        pick('ocular-hud', 'recommended', '携带 1 件', '直接提供暴击率并转换成更多弱点伤害', '即使弱点本身必暴击，眼部平视显示的暴击率仍由被动转成倍率。'),
        pick('preon-accumulator', 'conditional', '开场爆发携带', '提供长冷却高倍率开场并同步撬棍手环', '适合首领阶段集中爆发；难瞄高速目标时改皇家电容器。'),
      ],
    },
    coopAdjustments: [
      '磁轨炮手优先撬棍、双手环与远程首领点杀，把攻速、高频触发和无人机件让给队友。',
      '远程站位不能远到团队无法复活或支援；请队友处理贴身怪并尽量留出弱点视线。',
      '与装载机同队时按远程首领和近战精英分工，确保两位强击角色各有一套手环。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['crowbar', 'lens-makers-glasses', 'mocha', 'oddly-shaped-opal'], explanation: '先取三件撬棍、三件眼镜、基础移动与蛋白石，同时练稳定完美换弹。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'hopoo-feather', 'armor-piercing-rounds'], explanation: '双手环建立一枪爆发，再补羽毛、更多撬棍和穿甲；狙击枪不优先弹匣。' },
      { phase: '后期', picks: ['laser-scope', 'brilliant-behemoth', 'hardlight-afterburner', 'dios-best-friend'], explanation: '激光瞄准镜先放大弱点，随后按清群或位移需求选择红装并补复活。' },
    ],
    voidItems: [
      pick('voidsent-flame', 'recommended', '1 件起', '腐化鬼火，改为满血目标爆炸', '与撬棍和第一发弱点狙击同步，能把强击扩展到周围敌人。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供可预测冷却格挡', '瞄准和换弹之间可计划保护恢复，比随机格挡更易管理。'),
      pick('polylute', 'conditional', '队伍有清群时 1 件', '腐化尤克里里，把群体连锁换成单体多段雷击', '能增加首领单体，但自身缺清群时先保尤克里里或完美巨兽。'),
      pick('lost-seers-lenses', 'avoid', '绝不用于弱点构筑', '腐化全部暴击眼镜并改成概率瞬杀', '会直接损失暴击率转换的弱点倍率，拆毁角色最核心的伤害机制。'),
    ],
    lunarItems: [
      pick('purity', 'recommended', '纯狙击路线 1 件', '缩短技能冷却并加快特殊与位移回转', '负幸运对单发倍率流影响较小，但仍会削弱手环和钻机触发。'),
      pick('transcendence', 'conditional', '远程无伤路线 1 件', '把生命转成脱战自动恢复的护盾体系', '远程站位适合回盾，但全部常规治疗会失效，受击后要主动离战。'),
      pick('visions-of-heresy', 'avoid', '除完整转化外不拿', '替换智能弹系统并引入与瞄准切换复杂的充能互动', '会破坏推荐武器组和贴身自导清杂，只有完整转异端才考虑。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '找掩体和高点，狙击枪命中弱点后完美换弹，智能弹系统清近身，使用震荡装置位移，冷冻充能冻结精英再补枪。',
      '装备与特殊开场触发双环；每枪后先移动再换弹，不在瞄准镜里贪视野。',
      '狙击枪直接点弱点，高速小怪用智能弹系统或皇家电容器，不浪费高倍率特殊。',
      '震荡装置留一层躲锤与旋转墙；夺取物品阶段靠远距弱点和掩体慢打。',
    ),
    sourceIds: ['wiki-railgunner', 'wiki-proc-coefficient', 'official-ac-patch-1-4-1', 'wiki-bens-raincoat'],
    verifiedOn,
  },
  {
    slug: 'void-fiend',
    nameZh: '虚空恶鬼',
    nameEn: 'Void Fiend',
    dlc: 'sotv',
    portrait: 'assets/survivors/void-fiend.png',
    role: '腐化值资源管理与双形态远近切换',
    difficulty: 4,
    summary: '在普通远程控制形态和腐化近距爆发形态之间自动切换；受伤与暴击提高腐化值，收到治疗会降低它，每件虚空物品又会抬高最低值。',
    skills: [
      skill('void-fiend', 'passive', '虚空腐化', 'Void Corruption', 'default', '100% 自动变身，治疗降低资源，每件虚空物品提高最低值 2%。'),
      skill('void-fiend', 'primary', '溺亡', 'Drown', 'default', '普通形态远程精准；腐化后自动成为近距持续束流腐化溺亡。'),
      skill('void-fiend', 'secondary', '洪流', 'Flood', 'default', '普通形态蓄力强击；腐化后自动成为快速范围攻击腐化洪流。'),
      skill('void-fiend', 'utility', '越界', 'Trespass', 'default', '清除减益并移除受击判定；普通向上，腐化版本横向前冲。'),
      skill('void-fiend', 'special', '压制', 'Suppress', 'default', '普通消耗腐化值治疗；腐化版本消耗生命换取更多腐化值。'),
    ],
    buildLogic: [
      '未腐化时腐化值自然上升，暴击和受伤提高；收到任何治疗会降低，治疗型触发可能提前结束计划好的爆发。',
      '每件虚空物品把最低腐化值提高 2%，会更快变身并延长腐化；不要盲目独占虚空物品而失去普通形态远程和自疗。',
      '变身瞬间短暂无敌并刷新自身技能冷却，接近 100% 时不要先浪费普通越界，利用刷新完成入场和撤退。',
      '普通压制消耗 25% 腐化值治疗 25% 最大生命，腐化版本反向消耗生命换资源；两种形态都按资源线而非固定冷却使用。',
    ],
    solo: {
      common: [
        pick('lens-makers-glasses', 'core', '5–10 件', '同时提高伤害并通过暴击增加腐化值', '普通形态更快接近变身，腐化束流也获得稳定暴击输出。'),
        pick('mocha', 'core', '3–5 件', '同步改善双形态攻击速度和基础机动', '普通溺亡与腐化束流都受益，越界空窗也更易走位。'),
        pick('backup-magazine', 'recommended', '2–4 件', '增加洪流储备并强化双形态爆发连续性', '普通蓄力与腐化快速范围攻击都能多次使用，变身刷新后再接一轮。'),
      ],
      uncommon: [
        pick('predatory-instincts', 'core', '1–3 件', '暴击后提高腐化束流和普通主攻的攻速', '眼镜同时提高腐化值，变身后能快速维持近距单体输出。'),
        pick('atg-missile-mk-1', 'recommended', '1–3 件', '为双形态高频命中补充通用导弹伤害', '不依赖治疗且在普通、腐化两形态都稳定工作。'),
        pick('harvesters-scythe', 'conditional', '最多 0–1 件', '暴击提供治疗但会同步降低腐化值', '只在生存确实需要时拿，计划腐化爆发会被持续治疗提前结束。'),
      ],
      legendary: [
        pick('57-leaf-clover', 'core', '1 件', '重掷双形态触发并放大整套触发伤害', '束流命中频繁，三叶草能稳定提高导弹、连锁和首领物品收益。'),
        pick('alien-head', 'recommended', '1 件', '缩短技能冷却并降低形态切换后的空窗', '与变身刷新叠加，让洪流、越界和压制更灵活。'),
      ],
      boss: [
        pick('shatterspleen', 'core', '暴击成型后 1 件', '利用稳定暴击补流血与击杀范围爆炸', '腐化束流能高频触发，普通形态则获得额外清群来源。'),
        pick('charged-perforator', 'recommended', '1 件起', '为高频命中增加电击单体和连锁伤害', '两种形态都有足够触发密度，且不会像治疗那样扰动资源。'),
      ],
      equipment: [
        pick('ocular-hud', 'core', '腐化爆发携带', '主动提供暴击并迅速推高腐化值与伤害', '在接近变身或腐化期使用能延长高输出窗口，但需手动对齐时机。'),
        pick('royal-capacitor', 'recommended', '通用携带 1 件', '远程点杀并补普通形态的瞬时爆发', '无需改变腐化值计划，能处理束流射程外的高威胁目标。'),
      ],
    },
    coopAdjustments: [
      '提前告诉队友：治疗信标、探寻者治疗和其他大额治疗都会降低腐化值，计划爆发时不要强制喂奶。',
      '可以优先暴击和部分虚空物品，但不能独占全部；最低腐化值过高会失去普通形态远程与主动自疗。',
      '腐化期负责近距首领爆发，普通期清远端威胁；治疗资源按当前形态和资源线决定，而非看到掉血就拿。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'lens-makers-glasses', 'backup-magazine', 'oddly-shaped-opal'], explanation: '两件摩卡、三件眼镜和一层洪流库存先成型，用压制主动控制资源。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'predatory-instincts', 'hopoo-feather'], explanation: '触发链和暴击攻速放大两种形态，只取确实需要的虚空转换并观察最低值。' },
      { phase: '后期', picks: ['57-leaf-clover', 'brilliant-behemoth', 'alien-head', 'dios-best-friend'], explanation: '三叶草、巨兽和冷却红扩大腐化窗，终场前避免突然加入大量被动治疗。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供不属于治疗的定时格挡', '格挡不会主动降低腐化值，且能保护近距腐化束流输出。'),
      pick('polylute', 'recommended', '1 件起', '腐化尤克里里，把群体连锁换成单体多段雷击', '腐化溺亡的高频束流能频繁触发，显著提高首领单体。'),
      pick('plasma-shrimp', 'conditional', '稳定护盾时 1 件', '腐化空对地导弹1号，以护盾换每次命中导弹', '需靠个人护盾与不受击维持；压制的治疗本身不会补普通护盾。'),
      pick('weeping-fungus', 'avoid', '仅偏普通形态才考虑', '腐化爆裂真菌，改为冲刺中持续治疗', '奔跑治疗会不断压低腐化值，显著拖慢或终止计划腐化爆发。'),
    ],
    lunarItems: [
      pick('transcendence', 'recommended', '腐化倾向 1 件', '把生命转护盾并减少常规治疗需求', '能减少治疗压低腐化值，但压制的生命与治疗互动仍需实战管理。'),
      pick('gesture-of-the-drowned', 'conditional', '眼部平视显示闭环 1 件', '自动使用眼部平视显示并加快装备循环', '会自动开启暴击和腐化值窗口，代价是不能为指定腐化期保留。'),
      pick('corpsebloom', 'avoid', '不建议资源管理路线', '放大总治疗但把恢复延迟分批释放', '会先立即扣除腐化值，再随延迟治疗继续扣除，极难计划变身。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '普通溺亡、洪流远程铺伤，约九成资源时位移入场，变身刷新后束流爆发再用越界撤出。',
      '用压制控制变身时点，腐化期贴到束流射程，结束前预先确定退路。',
      '普通溺亡精准处理；腐化束流射程短，宁可清近敌等形态回转。',
      '普通越界穿过旋转墙、腐化版本横移锤击；夺取物品阶段勿用腐化压制将生命压入处决线。',
    ),
    sourceIds: ['wiki-void-fiend', 'wiki-void-fiend-corruption', 'wiki-proc-coefficient', 'wiki-void-items'],
    verifiedOn,
  },
]
