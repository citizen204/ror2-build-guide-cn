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

export const specialSurvivors: SurvivorGuide[] = [
  {
    slug: 'heretic',
    nameZh: '异端',
    nameEn: 'Heretic',
    dlc: 'special',
    portrait: 'assets/survivors/heretic.png',
    role: '四件 Heresy 月球物品触发的非可选特殊变身',
    difficulty: 5,
    summary: 'Heretic 不能在角色选择界面直接选择；任意普通幸存者同局持有四件 Heresy 月球物品才会立即变身，获得高属性和三段跳，但持续负生命回复。',
    skills: [
      skill('heretic', 'primary', '饥渴凝视（异端幻象）', 'Hungering Gaze', 'transformation', '由 Visions of Heresy 替换主技能，追踪碎片延迟爆炸并有十二层充能。'),
      skill('heretic', 'secondary', '切割漩涡（异端之钩）', 'Slicing Maelstrom', 'transformation', '由 Hooks of Heresy 替换副技能，蓄力涡流持续伤害，三秒后爆炸并定身。'),
      skill('heretic', 'utility', '暗影消退（异端跨越）', 'Shadowfade', 'transformation', '由 Strides of Heresy 替换位移，无形、加速并按最大生命治疗。'),
      skill('heretic', 'special', '毁灭（异端精华）', 'Ruin', 'transformation', '由 Essence of Heresy 替换特殊，无限距离引爆此前伤害叠加的 Ruin。'),
    ],
    buildLogic: [
      'Heretic 非正常可选角色：先完成 Blockade Breaker 解锁四件物品，再让同一名普通幸存者同时持有 Visions、Hooks、Strides 和 Essence 才立即变身。',
      '四件各一件是最稳组装；额外堆叠会增加充能或持续时间，也会延长技能周期，不能把“更多 Heresy”简单当作无条件提升。',
      '基础生命回复为负并持续掉血，护甲和格挡无法阻止；至少三件 Cautious Slug 才产生正常脱战正回复，Shadowfade 是战中关键治疗。',
      'Maelstrom 先控场，Hungering Gaze 给多目标叠 Ruin，装备和爆炸补层后再由 Ruin 集中引爆，最后 Shadowfade 无形撤离。',
      '四件变身物品是组装前提，不属于下面的可选 Lunar 建议；宿主应选择愿意替换技能的角色，避免毁掉 Loader 或 Mercenary 核心位移。',
    ],
    solo: {
      common: [
        pick('cautious-slug', 'core', '稳定生命路线 3 件', '抵消 Heretic 持续负生命回复并恢复脱战续航', '前两件主要抵消负回复，第三件才开始提供正常正回复，是生命路线底线。'),
        pick('backup-magazine', 'core', '2–4 件', '增加 Slicing Maelstrom 储备和控场频率', '更多涡流能分批控制怪群，并为 Ruin 引爆积累更多命中层。'),
        pick('mocha', 'recommended', '3–5 件', '提高碎片发射手感与基础移动能力', '三段跳和较快基础移速进一步受益，让 Shadowfade 空窗更安全。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'core', '1–3 件', '把碎片、涡流和 Ruin 命中转为导弹伤害', '终爆具有完整触发机会，导弹继续为 Ruin 叠层并补首领单体。'),
        pick('fuel-cell', 'recommended', '1–3 件', '提高主动治疗或伤害装备的储备频率', '负回复让装备时机重要，也决定是否值得转 Lysate Cell。'),
        pick('harvesters-scythe', 'recommended', '暴击成型后 1–2 件', '高频暴击提供战斗中的持续恢复能力', '与 Shadowfade 共同抵消负回复，但不替代三层 Slug 的脱战底线。'),
      ],
      legendary: [
        pick('57-leaf-clover', 'core', '1 件', '重掷多碎片和涡流触发的整套概率物品', '多段技能提供大量判定，三叶草稳定提高导弹、连锁和首领 proc。'),
        pick('rejuvenation-rack', 'recommended', '生命路线 1 件', '倍增 Shadowfade 与暴击镰刀的治疗效果', '能对抗战中负回复；Transcendence 护盾路线则不再需要。'),
      ],
      boss: [
        pick('titanic-knurl', 'recommended', '1 件起', '提高最大生命、基础回复和持续作战底盘', '高基础生命进一步获益，能延长负回复下的安全时间。'),
        pick('charged-perforator', 'recommended', '1 件起', '为完整触发的技能终爆增加电击伤害', 'Hungering Gaze 爆炸、Maelstrom 终爆和 Ruin 都能启动首领物品。'),
      ],
      equipment: [
        pick('royal-capacitor', 'recommended', '通用携带 1 件', '远程点杀并为目标额外叠加 Ruin 伤害', '与碎片、涡流一起在引爆前集中堆层，处理飞行精英也稳定。'),
        pick('super-massive-leech', 'conditional', '战中恢复不足时携带', '把 Ruin 爆发窗口转化为短时生命恢复', '能抵消战斗中负回复，但长冷却要求为高压阶段保留。'),
      ],
    },
    coopAdjustments: [
      '月球荚和蓝色传送门时间要先沟通；Heretic 是个人变身，不应要求全队牺牲所有月球币。',
      '四件组装完成前不要为了半套无配套地破坏宿主技能；确认本局能凑齐后再投入稀缺资源。',
      'Shadowfade 能自救，普通治疗可让无自疗前排；Heretic 负责用 Ruin 对齐团队首领爆发窗口。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'cautious-slug', 'oddly-shaped-opal'], explanation: '先把宿主移动、脱战恢复和第一下防护做稳，不急着用一两件 Heresy 破坏技能组。' },
      { phase: '中期', picks: ['strides-of-heresy', 'visions-of-heresy', 'hooks-of-heresy', 'essence-of-heresy'], explanation: '确定能凑齐后收集四件各一件；Strides 先保命，完整四件同时持有才转化。' },
      { phase: '后期', picks: ['backup-magazine', 'atg-missile-mk-1', '57-leaf-clover', 'alien-head', 'brilliant-behemoth'], explanation: '变身后补三层 Slug、涡流库存和触发链，红装按幸运、冷却与范围选择。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，提供可预测冷却格挡', 'Shadowfade 两次无形之间可等待保护恢复，但格挡不能阻止基础负回复。'),
      pick('polylute', 'recommended', '1 件起', '腐化 Ukulele，把群体连锁换成单体雷击', 'Hungering Gaze 多碎片和 Ruin 能频繁触发，显著加强 Boss 单体。'),
      pick('plasma-shrimp', 'conditional', 'Transcendence 路线 1 件', '腐化 AtG Missile Mk. 1，以护盾换每击导弹', '只有护盾路线能稳定维持；生命路线持续掉血时可靠性较差。'),
      pick('pluripotent-larva', 'conditional', '接受重塑库存时 1 件', "腐化 Dio's Best Friend，复活后腐化可转换物品", '会失去原版复活物并重塑库存，只有接受整套 Void 转换时拾取。'),
      pick('weeping-fungus', 'avoid', '不作为负回复解法', '腐化 Bustling Fungus，改为冲刺中恢复', '需要持续冲刺且不能单独解决负回复，稳定性不如 Slug 与 Shadowfade。'),
    ],
    lunarItems: [
      pick('transcendence', 'recommended', '护盾路线 1 件', '把生命转自动恢复护盾并规避负生命回复', '常规治疗与 Shadowfade 治疗会失去价值，但能彻底解决持续掉血。'),
      pick('shaped-glass', 'conditional', '高熟练 1 件', '利用高基础属性倍增伤害但减半最大生命', '负回复会更快压低安全线，必须已有回盾或多层保险。'),
      pick('corpsebloom', 'avoid', '不建议生命路线', '放大总治疗但延迟 Shadowfade 的关键恢复', '高压阶段恢复被限速会无法及时抵消负回复，风险超过总量收益。'),
    ],
    combatNotes: combat(
      'Maelstrom 控场，Hungering Gaze 多目标叠 Ruin，装备补层后集中引爆，再 Shadowfade 撤离治疗。',
      '先累积 Ruin 到硬直爆发窗再引爆，Maelstrom 终爆对准首领停顿，不每层都立即按。',
      'Hungering Gaze 追踪处理，电容器点精英；三段跳维持射线并留 Shadowfade 回地面。',
      'Shadowfade 无形穿锤击和旋转墙。四件 Heresy 当前都是 CannotSteal，米斯历克斯第四阶段不会夺走，变身与四技能始终保留；其余可偷物品仍会被夺。',
    ),
    sourceIds: ['wiki-heretic', 'wiki-cannot-steal-items', 'wiki-mithrix-item-steal', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
]
