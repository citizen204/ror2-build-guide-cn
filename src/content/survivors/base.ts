import type { CombatNote, ItemPick, Recommendation, SkillChoice, SkillSlot, SkillUnlock, SurvivorGuide } from '../../domain/guide'

const verifiedOn = '2026-08-25'

function pick(
  itemId: string,
  recommendation: Recommendation,
  stacks: string,
  role: string,
  synergy: string,
  alternative?: string,
): ItemPick {
  return { itemId, recommendation, stacks, role, synergy, ...(alternative ? { alternative } : {}) }
}

function skill(
  slug: string,
  slot: SkillSlot,
  nameZh: string,
  nameEn: string,
  unlock: SkillUnlock,
  reason: string,
): SkillChoice {
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

export const baseSurvivors: SurvivorGuide[] = [
  {
    slug: 'commando',
    nameZh: '突击队员',
    nameEn: 'Commando',
    dlc: 'base',
    portrait: 'assets/survivors/commando.png',
    role: '中远距离高频触发与持续输出',
    difficulty: 2,
    summary: '以高频率、完整触发系数的射击启动整套物品链，是最标准的持续输出角色；单次倍率普通，因此必须同时补足范围、倍率、移动与垂直机动。',
    skills: [
      skill('commando', 'primary', '双重射击', 'Double Tap', 'default', '唯一主技能，高频命中稳定启动流血、导弹与暴击链。'),
      skill('commando', 'secondary', '相位爆破', 'Phase Blast', 'unlock-required', '近中距离多弹丸能更快删除精英，比贯穿弹更适合稳定单人。'),
      skill('commando', 'utility', '战术滑行', 'Tactical Slide', 'unlock-required', '滑行时仍可射击，并能借坡修正高度，让输出与规避不中断。'),
      skill('commando', 'special', '压制火力', 'Suppressive Fire', 'default', '多次命中并眩晕，处理飞行怪和紧急打断比手雷更稳定。'),
    ],
    buildLogic: [
      'Double Tap 与 Suppressive Fire 负责堆高命中频率，优先让 AtG、Ukulele、流血和暴击形成可自我扩散的触发链。',
      'Phase Blast 只有在中近距离让弹丸集中时才兑现倍率；利用 Tactical Slide 横穿攻击线，不用站桩换血换输出。',
      '攻速只改善触发密度，不能代替独立倍率和范围；眼镜、穿甲、导弹与清群必须同步成长，避免只堆注射器。',
      '至少准备两类移动速度与一层额外跳跃，终局优先补格挡、复活和装备循环，让持续射击有安全时间轴。',
    ],
    solo: {
      common: [
        pick('lens-makers-glasses', 'core', '目标 10 件暴击等效', '建立稳定暴击并启动后续触发体系', '满暴击后 Predatory、Laser Scope 与 Shatterspleen 才能稳定兑现。'),
        pick('mocha', 'core', '前期 3–5 件', '同时补充攻击速度与基础移动速度', '双重射击手感和滑行走位同步改善，但成型后要转向独立倍率。'),
        pick('tri-tip-dagger', 'recommended', '未腐化时做到 10 件等效', '利用高频完整触发快速叠加持续流血', '与满暴击 Shatterspleen 共同组成稳定的单体和击杀爆炸链。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'core', '1–3 件', '把每次高频命中转化为额外单体爆发', 'Double Tap 和 Suppressive Fire 提供大量完整触发判定。'),
        pick('ukulele', 'core', '1–3 件', '把持续射击扩散成可靠的群体清场', '与导弹互补，修复 Commando 单次技能缺少范围的短板。'),
        pick('hopoo-feather', 'recommended', '至少 1 件，Eclipse 可 2 件', '补齐角色原生缺失的垂直机动能力', '额外跳跃与 Tactical Slide 组合，可越过地形和终局旋转墙。'),
      ],
      legendary: [
        pick('57-leaf-clover', 'core', '1 件起，可继续叠', '重掷所有概率触发并放大整套高频链', '命中次数越高，导弹、连锁和流血从幸运重掷获得的总收益越稳定。'),
        pick('brilliant-behemoth', 'recommended', '1 件', '让每发子弹附带范围爆炸并改善清群', '高射速将固定爆炸频繁送入怪群，直接弥补单发倍率普通的问题。'),
      ],
      boss: [
        pick('shatterspleen', 'core', '1 件', '把暴击流血转化为击杀范围爆炸', '眼镜与三尖匕首成型后，三个机制同时契合 Commando 的触发密度。'),
        pick('charged-perforator', 'recommended', '1 件起', '高频触发电击并强化首领单体伤害', '完整 proc 的连续射击能稳定触发电能钻机的额外伤害链。'),
      ],
      equipment: [
        pick('royal-capacitor', 'recommended', '携带 1 件', '远程点杀飞行精英并补充瞬时爆发', '滑行射击期间可精准指定目标，后期还能接 Soulbound Catalyst 循环。'),
        pick('recycler', 'conditional', '早中期携带', '把低价值掉落改造成构筑所缺关键件', 'Commando 需求分散，回收选择能更快补齐暴击、移动、范围和倍率。', '成型后换回 Royal Capacitor。'),
      ],
    },
    coopAdjustments: [
      '可以拿 AtG 与 Ukulele 承担稳定触发，但把撬棍和双手环让给 Railgunner、Loader 等强击角色。',
      'Spare Drone Parts 优先交给 Engineer 或 Operator；Executive Card 由队伍固定经济位携带，不重复争抢。',
      '若队伍清群已经充足，自己的绿色资源改投 Hopoo Feather、Rose Buckler 与单体 Polylute。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'lens-makers-glasses', 'oddly-shaped-opal'], explanation: '先取两件 Mocha、三件眼镜与一件蛋白石，让移动射击成立并防止第一下失误。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'hopoo-feather', 'tri-tip-dagger'], explanation: '补齐导弹、清群、额外跳跃与流血等效，避免把全部资源继续压在攻速。' },
      { phase: '后期', picks: ['57-leaf-clover', 'brilliant-behemoth', 'dios-best-friend'], explanation: '三叶草与巨兽放大整套触发链，迪奥负责终局一次失误保险，之后继续补机动。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '1 件起', '腐化 Ukulele，把群体连锁换成单体多段雷击', '队伍已有清群时，Double Tap 的高频触发能显著提高首领伤害。', '若自己仍缺清群则保留 Ukulele。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，提供可预测的定时格挡', '固定冷却保护更适合 Tactical Slide 的进出节奏，堆叠还能缩短间隔。'),
      pick('needletick', 'conditional', '短战可取 1 件', '腐化全部 Tri-Tip Dagger，把流血改为坍缩爆发', '高频射击能快速堆坍缩，短战更快；长 Boss 战通常保留持续流血。'),
      pick('lost-seers-lenses', 'avoid', '不建议拾取', '腐化全部暴击眼镜并改成极低概率瞬杀', '会同时拆掉暴击、捕食本能与 Shatterspleen 主链，代价远高于随机收益。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'recommended', '装备闭环后 1 件', '自动使用当前装备并缩短装备冷却时间', '配 Fuel Cell 与 Royal Capacitor 可形成点杀循环，但会失去保留装备时机。'),
      pick('transcendence', 'conditional', '不受击路线 1 件', '把生命转成脱战自动恢复的护盾体系', '适合 Eclipse 远程走位，但常规治疗会全部失效，必须接受回盾节奏。'),
      pick('purity', 'avoid', '不建议 proc 构筑拾取', '缩短技能冷却却显著降低幸运属性', 'Commando 依靠大量概率触发输出，负幸运会系统性削弱导弹与连锁。'),
    ],
    combatNotes: combat(
      '沿传送器边缘滑行，Phase Blast 点杀精英，Suppressive Fire 打断，再用 Double Tap 拉起触发链。',
      '中距离持续射击，看到首领攻击预兆才横滑；Phase Blast 只在安全窗口贴近打满弹丸。',
      '优先用 Suppressive Fire 或 Royal Capacitor 处理，不为 Phase Blast 强行贴到危险空域。',
      '至少留一次 Tactical Slide 躲锤击或旋转墙；夺取物品阶段利用射程和掩体，避免贪枪。',
    ),
    sourceIds: ['wiki-commando', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'huntress',
    nameZh: '女猎人',
    nameEn: 'Huntress',
    dlc: 'base',
    portrait: 'assets/survivors/huntress.png',
    role: '冲刺射击、锁定清群与高机动爆发',
    difficulty: 2,
    summary: '能在全速冲刺中保持锁定输出，以飞刃清群、弩炮补单体并用闪现跨过致命攻击；生命偏低，因此强度来自持续走位而非换血。',
    skills: [
      skill('huntress', 'primary', '扫射', 'Strafe', 'default', '前期无需暴击即可稳定工作，满暴击后可条件切换 Flurry。'),
      skill('huntress', 'secondary', '激光飞刃', 'Laser Glaive', 'default', '唯一副技能，借小怪反弹逐跳增伤，是角色主要清群手段。'),
      skill('huntress', 'utility', '闪现', 'Blink', 'default', '带垂直位移且一次脱险距离更可靠，适合稳定 Eclipse 路线。'),
      skill('huntress', 'special', '弩炮', 'Ballista', 'unlock-required', '三发远程强击兼顾单体、手环触发和空中停滞。'),
    ],
    buildLogic: [
      'Huntress 能在冲刺中攻击，因此 Energy Drink 与 Rose Buckler 都是角色特化收益；全程斜向绕圈，把 Blink 留给致命线。',
      'Laser Glaive 先锁小怪，让逐跳增伤最终落在精英；空旷单 Boss 时由 Ballista、手环和穿甲承担倍率。',
      'Strafe 前期稳定，Command 很快做满暴击后可切 Flurry；无论哪套都不能用锁定代替视线、射程和掩体管理。',
      '生命偏低意味着 Hardlight Afterburner、额外跳跃和可预测格挡优先于小额治疗，输出够后继续补位移次数。',
    ],
    solo: {
      common: [
        pick('energy-drink', 'core', '3–5 件', '放大全程冲刺并保持射击的角色优势', '冲刺速度同时改善绕圈、生存与 Little Disciple 的自动伤害频率。'),
        pick('lens-makers-glasses', 'core', '目标 10 件暴击等效', '建立稳定暴击并为 Flurry 转换做准备', '满暴击会放大 Flurry 箭数，并开启 Laser Scope 与 Shatterspleen 联动。'),
        pick('backup-magazine', 'recommended', '2–4 件', '增加 Laser Glaive 储备并强化清群连续性', '多次飞刃能在不同怪群之间轮换，减少主技能单体不足的空窗。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件起', '让 Ballista 强击触发高伤火焰范围爆发', '弩炮三发独立命中稳定跨过手环阈值，额外叠加优先火环。'),
        pick('runald-band', 'core', '1 件', '让 Ballista 同步触发冰环和减速控制', '与 Kjaro 组成完整强击窗口，单件后不必无脑继续堆叠。'),
        pick('rose-buckler', 'recommended', '1–3 件', '冲刺期间提供常驻护甲并降低擦伤风险', 'Huntress 几乎一直处于冲刺状态，能稳定兑现该条件防御。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'core', '1 件', '增加 Blink 充能并显著提高脱险次数', '连续位移是低生命角色最直接的 Eclipse 生存提升。'),
        pick('laser-scope', 'recommended', '满暴击后 1 件', '把稳定暴击进一步放大成终局伤害倍率', '同时强化 Flurry、Ballista 和 Shatterspleen，暴击未成型时不要先拿。'),
      ],
      boss: [
        pick('little-disciple', 'core', '1 件起', '冲刺时自动发射追踪弹并清理近身敌人', 'Huntress 常驻冲刺可持续触发，几乎不改变原有走位循环。'),
        pick('shatterspleen', 'recommended', '满暴击后 1 件', '为暴击构筑补充流血和击杀范围爆炸', 'Flurry 与锁定主攻提供稳定暴击，进一步扩大飞刃清场。'),
      ],
      equipment: [
        pick('royal-capacitor', 'recommended', '携带 1 件', '补足远距离单点并删除飞行精英威胁', '锁定走位中无需停下蓄力，能把装备爆发留给高价值目标。'),
        pick('gorags-opus', 'conditional', '团队爆发携带', '提供团队攻击速度与移动速度爆发窗口', '传送器和首领阶段全队都能利用，但经济不足时 Recycler 更灵活。'),
      ],
    },
    coopAdjustments: [
      '负责低成本处理空中小怪和清场，把撬棍、双手环优先让给 Railgunner、Loader 等强击核心。',
      '自己的资源优先争取移速、羽毛和位移红；无人机红装交给 Operator 或 Engineer。',
      '队伍清群过剩时可把 Ukulele 腐化为 Polylute，专注 Ballista 的 Boss 单体窗口。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['energy-drink', 'lens-makers-glasses', 'backup-magazine', 'oddly-shaped-opal'], explanation: '先让边跑边打成立，并建立暴击、飞刃库存与第一下防护。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'hopoo-feather', 'rose-buckler'], explanation: '满暴击后可切 Flurry，再补双手环、额外跳跃和冲刺护甲。' },
      { phase: '后期', picks: ['hardlight-afterburner', 'laser-scope', 'dios-best-friend'], explanation: '优先增加 Blink 次数，再用激光瞄准镜放大满暴击，最后补一次复活保险。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，得到冷却明确的定时格挡', 'Blink 两次危险窗口之间可等待保护恢复，比随机格挡更易计划。'),
      pick('polylute', 'conditional', 'Boss 压力高时 1 件', '腐化 Ukulele，把群体连锁换成单体雷击', '队伍已有清群时补足 Huntress 的单体短板，否则应保留 Ukulele。'),
      pick('plasma-shrimp', 'conditional', '稳定护盾时 1 件', '腐化 AtG Missile Mk. 1，以护盾换每次命中导弹', '只有走位足够稳定、护盾不断时收益可靠，受击掉盾后会停用。'),
      pick('lost-seers-lenses', 'avoid', '不建议拾取', '腐化全部暴击眼镜并改为概率瞬杀', '会摧毁 Flurry 箭数、Laser Scope 与 Shatterspleen 的整个暴击核心。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'recommended', '伤害装备成型后 1 件', '自动释放装备并加快短冷却点杀循环', '持续跑动能降低误用风险，但仍无法为指定首领窗口保留装备。'),
      pick('light-flux-pauldron', 'conditional', '技能流 1 件', '大幅缩短技能冷却但降低普通攻击速度', 'Ballista 与飞刃流可接受代价，依赖 Flurry 的构筑应避免。'),
      pick('brittle-crown', 'avoid', '不建议稳定路线拾取', '命中赚取金币但受伤会立刻损失金币', '低生命角色容易被擦伤，经济波动会拖慢关键移动和暴击成型。'),
    ],
    combatNotes: combat(
      '全程冲刺绕圈，飞刃先投小怪群，Ballista 点精英；Blink 只穿过明确攻击线。',
      'Ballista 开窗后持续 Strafe，飞刃借杂兵增伤；看到攻击预兆才 Blink。',
      '锁定主技能天然适合清理空中目标，Royal Capacitor 留给高威胁飞行精英。',
      '保留 Blink 的垂直与横向余量，旋转墙阶段不要一次交空所有位移。',
    ),
    sourceIds: ['wiki-huntress', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'bandit',
    nameZh: '盗贼',
    nameEn: 'Bandit',
    dlc: 'base',
    portrait: 'assets/survivors/bandit.png',
    role: '背刺暴击、隐身重定位与处决滚雪球',
    difficulty: 3,
    summary: '依靠背后必定暴击、Smoke Bomb 换侧和 Desperado 处决层数滚起单发倍率；需要管理尾刀、换弹与站位，联机时尤其要处理资源冲突。',
    skills: [
      skill('bandit', 'passive', '背刺', 'Backstab', 'default', '从背后攻击必定暴击，是站位与高倍率构筑的核心。'),
      skill('bandit', 'primary', '爆裂射击', 'Burst', 'default', '近中距离总倍率和触发更强，远距精准需求时才换 Blast。'),
      skill('bandit', 'secondary', '锯齿飞刀', 'Serrated Shiv', 'unlock-required', '安全远程施加 Hemorrhage，不必为流血持续贴脸。'),
      skill('bandit', 'utility', '烟雾弹', 'Smoke Bomb', 'default', '唯一位移，兼具隐身、眩晕、垂直修正和绕背。'),
      skill('bandit', 'special', '亡命徒', 'Desperado', 'unlock-required', '单人每次处决增加本关伤害，长关卡滚雪球最强。'),
    ],
    buildLogic: [
      '先用 Burst 和 Shiv 压低目标，再由 Desperado 完成击杀；层数只在特殊技能拿到尾刀时增长，因此不能无序清杂。',
      'Backstab 只保证背面暴击，不保证正面；早期无需急着满暴击，但正面首领与 Laser Scope 仍能从眼镜获益。',
      'Smoke Bomb 是脱锁、眩晕、换侧与垂直修正的总枢纽，应留给攻击窗口，不作为纯赶路技能随意交掉。',
      '撬棍、双手环和背刺倍率建立爆发线后，补充羽毛、蛋白石、复活与技能冷却，保证每次进场都能安全撤出。',
    ],
    solo: {
      common: [
        pick('crowbar', 'core', '3–5 件', '提高 Desperado 与背刺的满血首击倍率', '更容易把小怪推入特殊技能处决线，也放大首领开场双手环。'),
        pick('backup-magazine', 'recommended', '2–3 件', '增加 Serrated Shiv 库存并稳定远程出血', '多层飞刀能在换侧失败时继续维持 Hemorrhage 与安全输出。'),
        pick('mocha', 'recommended', '2–4 件', '同步改善换弹攻击手感与隐身后移动', 'Burst 近中距输出和 Smoke Bomb 重定位都从双属性获得收益。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件', '让背刺或 Desperado 触发高伤火焰爆发', '高单击倍率稳定超过触发阈值，首个火环收益最明显。'),
        pick('runald-band', 'core', '1 件', '同步提供冰环伤害与减速控制窗口', '与 Kjaro 组成一次完整处决爆发，不需要优先无限堆冰环。'),
        pick('old-guillotine', 'recommended', '1–2 件', '提高精英处决阈值并帮助层数滚雪球', '先压血再用 Desperado 收掉精英，可更稳定获得本关永久层数。'),
      ],
      legendary: [
        pick('laser-scope', 'core', '1 件', '直接放大背面必暴击与正面暴击伤害', 'Backstab 天然保证倍率生效，是盗贼最稳定的红色伤害件。'),
        pick('brilliant-behemoth', 'recommended', '1 件', '让每次高倍率射击产生范围爆炸清群', '背刺与 Desperado 的单发伤害会转化为更大的区域清场。'),
      ],
      boss: [
        pick('shatterspleen', 'core', '1 件', '利用背刺必暴击稳定施加流血并爆群', '与 Serrated Shiv 的 Hemorrhage 并行，长首领和杂兵清场都获益。'),
        pick('molten-perforator', 'recommended', '1 件起', '让高伤击发追加火焰钻机爆发伤害', '背刺和 Desperado 提供高倍率触发，适合首领窗口集中输出。'),
      ],
      equipment: [
        pick('ocular-hud', 'recommended', '正面暴击不足时携带', '强制正面目标进入可靠暴击窗口', '无法绕背的首领仍能吃 Laser Scope；满暴击后可换伤害装备。'),
        pick('preon-accumulator', 'conditional', '传送器开场携带', '提供长冷却高倍率开场爆发并触发手环', '与撬棍和背刺窗口同步，但必须为传送器或首领保留。'),
      ],
    },
    coopAdjustments: [
      'Desperado 尾刀与队友清场直接冲突；开局说明需要保留一波低血小怪，否则改用 Lights Out。',
      '撬棍和双手环与 Railgunner、Loader 强冲突，按谁承担首领爆发分配至少一整套。',
      '天然背刺暴击允许把早期眼镜让给 Huntress 或 Commando，但不要长期离队刷层拖慢关卡。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['crowbar', 'mocha', 'backup-magazine', 'oddly-shaped-opal'], explanation: '三件撬棍先建立 Desperado 收尾线，再补移动、飞刀库存和第一下保护。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'shuriken', 'old-guillotine'], explanation: '双手环形成强击窗口，手里剑补空窗，断头台帮助精英处决滚层。' },
      { phase: '后期', picks: ['laser-scope', 'brilliant-behemoth', 'dios-best-friend'], explanation: '激光瞄准镜放大背刺，巨兽修复范围，复活件保护高层数终局。' },
    ],
    voidItems: [
      pick('voidsent-flame', 'recommended', '1 件起', "腐化 Will-o'-the-wisp，改为满血首击爆炸", '满血爆炸与 Crowbar、背刺和 Desperado 同步触发，强化开场清群。'),
      pick('needletick', 'conditional', '短战 1 件', '腐化全部 Tri-Tip Dagger，把持续流血换成坍缩', 'Burst 能快速叠层，但长期 Hemorrhage 与流血构筑通常应保留原件。'),
      pick('lysate-cell', 'conditional', '装备价值较低时 1 件', '腐化全部 Fuel Cell，增加特殊技能充能', '可多一次 Desperado 或 Lights Out；依赖 Preon 时不要牺牲燃料电池。'),
      pick('lost-seers-lenses', 'avoid', '不建议拾取', '腐化所有暴击眼镜并失去正面暴击基础', '背面仍暴击但正面和 Laser Scope 体系崩坏，随机瞬杀无法补偿。'),
    ],
    lunarItems: [
      pick('purity', 'recommended', '纯倍率路线 1 件', '显著缩短 Smoke Bomb 与特殊技能冷却', '适合主动放弃 proc 转处决循环，但负幸运会削弱导弹、手环等概率链。'),
      pick('shaped-glass', 'conditional', '高熟练 1 件', '倍增伤害并把背刺推入更高处决阈值', '同时减半最大生命，隐身失误或近距换弹时会立刻致命。'),
      pick('visions-of-heresy', 'avoid', '除转化外不建议', '替换非常适合背刺和近距爆发的 Burst 主攻', '会破坏原有换弹与背刺节奏，只有准备完整转 Heretic 才拿。'),
    ],
    combatNotes: combat(
      '先用 Desperado 收小怪，再 Smoke Bomb 穿到精英背后，Shiv、Burst 后由特殊收尾。',
      '保持侧后方 Hemorrhage，首领转身或出招时隐身换侧，装备与双环留给硬直窗。',
      '用 Shiv、特殊或条件 Blast 点杀，不为背刺跳入没有安全落点的空域。',
      'Smoke Bomb 留给锤击和旋转墙；夺取物品阶段从背后 Burst，避免正面贪换弹。',
    ),
    sourceIds: ['wiki-bandit', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'mul-t',
    nameZh: 'MUL-T',
    nameEn: 'MUL-T',
    dlc: 'base',
    portrait: 'assets/survivors/mul-t.png',
    role: '双武器切换、双装备与高生命火力平台',
    difficulty: 3,
    summary: '利用 Retool 在两把主武器和两件装备之间切换，高生命让失误容限较高；双 Rebar 节奏提供稳定强击，同时保留 Transport Mode 脱离危险。',
    skills: [
      skill('mul-t', 'primary', '钢筋发射器（双持）', 'Rebar Puncher', 'default', '两把 Rebar 配 Retool 轮换，绕过单把充能并持续打出高倍率强击。'),
      skill('mul-t', 'secondary', '爆破罐', 'Blast Canister', 'default', '唯一副技能，提供群体眩晕和稳定清杂。'),
      skill('mul-t', 'utility', '运输模式', 'Transport Mode', 'default', '提速、加护甲并穿越危险区，比 Power Mode 的定点风险更稳。'),
      skill('mul-t', 'special', '重整', 'Retool', 'default', '在双主武器和双装备间切换，是推荐构筑的节奏核心。'),
    ],
    buildLogic: [
      '双 Rebar 通过射击后立即 Retool 再射绕过单把充能，稳定触发撬棍与双手环；不练切枪时可改 Nailgun 加 Rebar。',
      'Retool 同时提供两个装备位，一个放首领爆发、另一个放经济或短冷却工具，但不要为了双装备和队友争抢全部橙装。',
      'Transport Mode 的主要职责是提速、护甲和穿越包围圈，不把退出冲撞当 Boss 主输出；至少保留一次撤离机会。',
      '高生命和大体型同时存在，仍需山羊蹄、额外跳跃与蛋白石；伤害线成立后优先补机动、复活和位移充能。',
    ],
    solo: {
      common: [
        pick('crowbar', 'core', '双 Rebar 3–5 件', '提高钢筋满血强击与开场处决阈值', '交替 Rebar 每一发都是高倍率，能稳定放大 Crowbar 和双手环。'),
        pick('pauls-goat-hoof', 'core', '3–5 件', '改善大体型基础走位和运输模式路径', '更高移动速度能减少受击，也让两个装备位的主动节奏更安全。'),
        pick('oddly-shaped-opal', 'recommended', '1 件', '在换枪或进出技能模式时抵挡第一击', 'MUL-T 体型大易被擦伤，蛋白石为火力切换提供稳定窗口。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件', '让 Rebar 稳定触发高伤火焰范围爆发', '每发钢筋都可越过触发阈值，首件火环改善清群最明显。'),
        pick('runald-band', 'core', '1 件', '同步提供冰环伤害与首领减速控制', '与 Kjaro 组成双 Rebar 的完整强击循环，单件即可成型。'),
        pick('fuel-cell', 'recommended', '1–3 件', '同时提高两件装备的可用频率和储备', 'Retool 的双装备优势会放大燃料电池价值，但 Void 转换需谨慎。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'core', '1 件', '增加 Transport Mode 充能并提高撤离能力', '大体型角色最需要可重复穿越危险区，这是稳定路线首选红。'),
        pick('pocket-icbm', 'conditional', '导弹组件成型后 1 件', '倍增 AtG 和导弹装备的投射数量与伤害', '配 Disposable Missile Launcher 或多层 AtG 时质变，未成型先取 Behemoth。'),
      ],
      boss: [
        pick('shatterspleen', 'recommended', 'Nailgun 暴击流 1 件', '为高频主攻补流血与击杀范围爆炸', 'Nailgun 分支能稳定暴击并叠流血；双 Rebar 则优先强击钻机。'),
        pick('genesis-loop', 'conditional', '1 件保险', '利用高基础生命提供低血范围清场保险', '只当被压低时的被动救场，不能为了触发它主动卖血。'),
      ],
      equipment: [
        pick('preon-accumulator', 'recommended', '第一装备位', '提供传送器开场高倍率爆发并同步手环', 'Retool 可在长冷却期间切到另一件短冷却装备继续战斗。'),
        pick('royal-capacitor', 'recommended', '第二装备位', '提供短冷却点杀并处理远处飞行精英', '与 Preon 形成开场爆发和日常点杀的双装备分工。'),
      ],
    },
    coopAdjustments: [
      '先约定只拿一个主战橙装，第二格放经济或工具，避免 Retool 变成独占队伍装备的理由。',
      'Rebar 路线与 Loader、Railgunner 争撬棍手环；若改 Nailgun，就拿他们不需要的攻速和流血。',
      'Spare Drone Parts 留给 Operator 或 Engineer，把稀缺治疗交给更脆的前排角色。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['crowbar', 'pauls-goat-hoof', 'oddly-shaped-opal'], explanation: '双 Rebar 先取三件撬棍、两件山羊蹄和一件蛋白石，建立强击与安全移动。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'fuel-cell', 'hopoo-feather'], explanation: '双手环与燃料电池强化两套节奏，再用羽毛修复垂直机动。' },
      { phase: '后期', picks: ['hardlight-afterburner', 'brilliant-behemoth', 'pocket-icbm'], explanation: '先补运输模式次数，再按范围或导弹库存选择巨兽与袖珍洲际导弹。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '1 件起', '腐化 Ukulele，把群体连锁换成单体多段雷击', '双 Rebar 的完整 proc 能可靠启动，适合已有其他清群来源的首领战。'),
      pick('needletick', 'conditional', 'Nailgun 短战 1 件', '腐化全部 Tri-Tip Dagger，把流血换成坍缩', 'Nailgun 能迅速叠层，长 Boss 战仍应保留可持续流血。'),
      pick('lysate-cell', 'conditional', 'Power Mode 分支 1 件', '腐化 Fuel Cell，增加特殊技能充能而失去装备储备', 'Power Mode 可获益，但 Retool 双装备核心不应腐化全部燃料电池。'),
      pick('benthic-bloom', 'avoid', '不建议精确构筑拾取', '腐化 57 Leaf Clover 并随机升级普通物品', '会打散双武器分支为撬棍或攻速保留的精确库存。'),
    ],
    lunarItems: [
      pick('transcendence', 'recommended', '护盾路线 1 件', '把高基础生命转为大型脱战恢复护盾', '大生命底盘换得高护盾，但常规治疗失效，必须按脱战回盾节奏移动。'),
      pick('spinel-tonic', 'conditional', '高覆盖闭环 1 件', '全面强化 Power Mode 的攻击与生存属性', '只有 Gesture 与 Fuel Cell 能保证覆盖时使用，断档会累积 Tonic Affliction。'),
      pick('shaped-glass', 'avoid', '稳定路线不建议', '倍增伤害但直接减半最大生命上限', '会浪费 MUL-T 的大生命优势，只有机动与复活极强时才承担风险。'),
    ],
    combatNotes: combat(
      'Rebar、Retool、Rebar 轮换点杀精英，Canister 打断群体，Transport Mode 穿出包围。',
      '双装备开场后进入双 Rebar 手环节奏；危险招式出现时停止贪枪并准备运输模式。',
      '优先用 Rebar、Canister 和 Royal Capacitor，电锯只处理贴身地面目标。',
      '不要提前耗掉 Transport Mode；夺取物品阶段用高基础生命和掩体拖回关键位移。',
    ),
    sourceIds: ['wiki-mul-t', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'engineer',
    nameZh: '工程师',
    nameEn: 'Engineer',
    dlc: 'base',
    portrait: 'assets/survivors/engineer.png',
    role: '炮台物品复制、区域控制与机械召唤',
    difficulty: 2,
    summary: '两座炮台会复制工程师当前物品，把每个触发与治疗件放大为三体体系；固定炮台配爆裂真菌最稳定，拾取新物品后必须重新部署才能更新。',
    skills: [
      skill('engineer', 'primary', '弹跳手雷', 'Bouncing Grenades', 'default', '唯一主技能，蓄满后用于地面大目标和炮台空窗。'),
      skill('engineer', 'secondary', '蜘蛛地雷', 'Spider Mines', 'unlock-required', '自动寻敌使实战命中比压力地雷稳定，守点预埋才换回默认。'),
      skill('engineer', 'utility', '气泡护盾', 'Bubble Shield', 'default', '稳定单人守点首选，为固定炮台覆盖明显远程射线。'),
      skill('engineer', 'special', 'TR12 高斯自动炮台', 'TR12 Gauss Auto-Turret', 'default', '远射程固定炮台继承物品，并能停在爆裂真菌治疗圈。'),
    ],
    buildLogic: [
      '两座炮台完整复制工程师当前物品，新捡物品后必须重新部署才更新；关键触发、暴击与真菌因此会在三体上同时工作。',
      '固定炮台分开放置，让射界与真菌圈互相覆盖但不重叠；护盾罩住主要远程射线，不要追着本体随意落盾。',
      'Bubble Shield 是稳定 solo 推荐；若已有掩体和移动，可条件换 Thermal Harpoons，先存满最多四枚再进入锁定爆发。',
      '机械红装与召唤件很强，但本体仍需要移动和羽毛；炮台承担火力不代表工程师可以站在治疗圈内硬吃伤害。',
    ],
    solo: {
      common: [
        pick('bustling-fungus', 'core', '固定炮台 3–5 件', '让每座站定炮台形成持续治疗区域', '第一件即成型，炮台继承后治疗圈互相覆盖；移动炮台不围绕它构筑。'),
        pick('soldiers-syringe', 'core', '3–6 件', '直接提高两座炮台与本体的攻击速度', '物品复制让同一件攻速同时在三体上兑现，触发密度增长显著。'),
        pick('tougher-times', 'recommended', '3–5 件', '让本体和两座炮台分别进行随机格挡', '三体各自判定能提高火力平台存活，但 Void 转换要考虑固定冷却。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'core', '1–3 件', '让固定炮台持续命中触发额外导弹伤害', '两炮台完整继承并各自触发，单件便能显著放大团队火力。'),
        pick('ukulele', 'core', '1–3 件', '把炮台点射扩散成稳定群体连锁伤害', '炮台持续射击能反复拉起连锁，减少本体手雷清群压力。'),
        pick('box-of-dynamite', 'recommended', '机械体系 1–2 件', '让炮台与无人机周期投放范围炸药', 'AC 机械随从体系额外获益，但会与 Operator 产生资源冲突。'),
      ],
      legendary: [
        pick('spare-drone-parts', 'core', '1 件', '强化炮台和其他机械随从的核心红装', '即使 AC 后数值削弱，炮台作为机械随从仍能获得明确增益。'),
        pick('rejuvenation-rack', 'recommended', '固定炮台 1 件', '倍增真菌与暴击镰刀的治疗效率', '炮台复制后治疗体系同时放大，移动炮台或无治疗构筑则降低优先级。'),
      ],
      boss: [
        pick('empathy-cores', 'core', '1 件起', '利用大量炮台与无人机盟友提高核心伤害', '工程师天然维持多个盟友，能稳定满足共情核心的规模收益。'),
        pick('defense-nucleus', 'recommended', '1 件', '击杀精英后生成 Alpha Construct 扩大机械军团', '炮台负责稳定精英击杀，新增构造体继续吸引火力和输出。'),
      ],
      equipment: [
        pick('the-back-up', 'recommended', '机械体系携带', '临时召唤 Strike Drones 扩大机械火力', '无人机随等级成长并吃机械增益，传送器开场可快速扩军。'),
        pick('executive-card', 'conditional', '经济不足时携带', '提高开箱购买价值并支持大量机械投资', '更快买齐无人机和箱子，战斗压力高时换 Royal Capacitor。'),
      ],
    },
    coopAdjustments: [
      '固定炮台对 Bustling Fungus 优先级最高，应提前说明；移动炮台构筑则主动让出真菌。',
      'Spare Drone Parts 与 Box of Dynamite 和 Operator 强冲突，开局约定谁承担机械主核。',
      '炮台放在传送器外缘，既吸引火力又不遮挡队友；新物品后重新部署以更新继承库存。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['bustling-fungus', 'soldiers-syringe', 'lens-makers-glasses', 'tougher-times'], explanation: '固定炮台先三件真菌、两件注射器和暴击格挡，本体另补移动。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'harvesters-scythe', 'hopoo-feather'], explanation: '触发链和镰刀让炮台自给，再用羽毛修复工程师本体垂直机动。' },
      { phase: '后期', picks: ['spare-drone-parts', 'rejuvenation-rack', '57-leaf-clover'], explanation: '机械红装先强化炮台，治疗流取回春支架，最后用三叶草放大三体触发。' },
    ],
    voidItems: [
      pick('lysate-cell', 'recommended', '第一件最重要', '腐化 Fuel Cell，把同时存在的炮台上限提高到三座', '第一件增加炮台上限，后续只加充能；装备核心时要权衡燃料电池损失。'),
      pick('weeping-fungus', 'conditional', '仅移动炮台构筑', '腐化全部 Bustling Fungus，改为冲刺中治疗', '移动炮台会离开站定圈，因此适用；固定炮台拾取会毁掉经典真菌核心。'),
      pick('plasma-shrimp', 'conditional', '护盾稳定时 1 件', '腐化 AtG Missile Mk. 1，以护盾换每次命中导弹', '炮台和本体都能高频触发，但掉盾环境应保留更稳定的 AtG。'),
      pick('benthic-bloom', 'avoid', '不建议拾取', '腐化 57 Leaf Clover 并随机升级普通物品', '可能升级掉精心保留的真菌、攻速和经济件，使炮台体系失去控制。'),
    ],
    lunarItems: [
      pick('transcendence', 'recommended', '放弃真菌时 1 件', '把生命转护盾并让常规治疗失效', '炮台也采用护盾体系，因此不能与固定炮台 Bustling Fungus 核心混搭。'),
      pick('gesture-of-the-drowned', 'conditional', 'The Back-up 闭环 1 件', '自动释放无人机装备并缩短装备冷却', '可以持续扩军，但会失去为传送器或首领保留无人机波次的时机。'),
      pick('shaped-glass', 'avoid', '稳定炮台路线不建议', '倍增伤害但同时减半本体和炮台有效生命', '部署失误会快速丢失全部火力平台，风险超过稳定通关收益。'),
    ],
    combatNotes: combat(
      '两炮台分开放置，护盾覆盖主要射线，预放地雷后本体沿盾边投弹；拾新物品后重放。',
      '建立交叉射界并由本体拉开仇恨，不要和炮台重叠让一次范围攻击全清。',
      '固定炮台与 AtG 负责对空，Spider Mines 对空不稳时用 Royal Capacitor 点杀。',
      '柱子事件先部署；米斯历克斯移动快，分散炮台，夺取物品阶段优先保命等火力重建。',
    ),
    sourceIds: ['wiki-engineer', 'wiki-engineer-turrets', 'wiki-engineer-thermal-harpoons', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'artificer',
    nameZh: '工匠',
    nameEn: 'Artificer',
    dlc: 'base',
    portrait: 'assets/survivors/artificer.png',
    role: '元素控制、蓄力强击与技能循环法师',
    difficulty: 3,
    summary: '通过 Ignite、Freeze 处决和高倍率蓄力技能触发双手环；主技能有充能且水平机动弱，稳定高难路线用 Ion Surge 作为逃生和重新定位。',
    skills: [
      skill('artificer', 'passive', '环境服', 'ENV Suit', 'default', '允许按住或切换跳跃悬浮，提供空中射线与落点控制。'),
      skill('artificer', 'primary', '火焰弹', 'Flame Bolt', 'default', '附带 Ignite 并与 Gasoline、Ignition Tank 形成稳定火焰体系。'),
      skill('artificer', 'secondary', '蓄力纳米长矛', 'Cast Nano-Spear', 'unlock-required', '远程 Freeze 与低血处决比纳米炸弹更适合稳定路线。'),
      skill('artificer', 'utility', '冰墙', 'Snapfreeze', 'default', '固定控制墙，冻结多数非首领并提供低血处决。'),
      skill('artificer', 'special', '离子激涌', 'Ion Surge', 'unlock-required', '弥补水平机动，提供垂直逃生、眩晕和重新定位。'),
    ],
    buildLogic: [
      '蓄力 Nano-Spear 的高单击倍率稳定触发双手环，Freeze 对多数非 Boss 目标还提供低血处决；先预判再释放。',
      'Flame Bolt 负责 Ignite，Gasoline 扩火，Ignition Tank 放大整条燃烧链；不要在选择火焰路线后又把关键组件分散。',
      'Ion Surge 可反复升空，但高空缺少掩体；多数战斗仍落地绕遮挡，把升空当逃生、越墙和重置位置。',
      'Backup Magazine 与技能冷却直接增加高倍率技能频率，伤害线成型后补额外跳跃、格挡和复活以保护蓄力窗口。',
    ],
    solo: {
      common: [
        pick('crowbar', 'core', '3–5 件', '放大长矛满血首击和 Freeze 处决阈值', '高倍率副技能能充分利用撬棍，也与双手环开场同步。'),
        pick('backup-magazine', 'core', '3–5 件', '增加副技能储备并直接提高强击频率', '多层 Nano-Spear 让技能循环更连续，是最直接的白色伤害投资。'),
        pick('gasoline', 'recommended', '1–3 件', '击杀后扩散火焰并建立范围清场链', 'Flame Bolt Ignite 与 Ignition Tank 会共同放大后续燃烧。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件起', '让蓄力长矛触发高伤火焰范围爆发', '副技能稳定越过触发阈值，后续堆叠优先 Kjaro 增强清群。'),
        pick('runald-band', 'core', '1 件', '让长矛同步触发冰环伤害与减速', '与 Kjaro 组成一次完整强击，控制窗口便于继续蓄力。'),
        pick('ignition-tank', 'core', '火焰路线 1–3 件', '大幅放大 Flame Bolt 与 Gasoline 的 Ignite', '角色天然持续点燃，点火罐比泛用 proc 更直接地扩大核心伤害。'),
      ],
      legendary: [
        pick('alien-head', 'core', '1 件', '缩短所有技能冷却并减少伤害空窗', '技能倍率高、主攻有充能，整体冷却下降对循环提升显著。'),
        pick('hardlight-afterburner', 'recommended', '1 件', '增加 Ion Surge 充能并强化垂直脱险', '在高难度提供多次重新定位，比纯伤害红更稳定。'),
      ],
      boss: [
        pick('molten-perforator', 'core', '1 件起', '把高倍率命中继续转为火焰钻机爆发', '与 Flame Bolt、Gasoline、Ignition Tank 同属火焰乘区，构筑集中。'),
        pick('genesis-loop', 'conditional', '1 件保险', '低血时自动清场并争取重新定位窗口', '只作为意外被压低时的保险，Eclipse 不主动卖血触发。'),
      ],
      equipment: [
        pick('preon-accumulator', 'recommended', '传送器开场携带', '提供超高倍率开场伤害并同步撬棍双环', '预蓄副技能后接 Preon 可集中删除首领，但长冷却要求留时机。'),
        pick('royal-capacitor', 'recommended', '通用携带 1 件', '远程点杀飞行精英并补短冷却爆发', '悬浮和升空时仍能精确指定目标，日常稳定性高于 Preon。'),
      ],
    },
    coopAdjustments: [
      '工匠需要一套撬棍与双手环，但 Railgunner、Loader 同样需要，通常按强击角色一人一套分配。',
      '冻结高威胁精英为全队创造处决窗口；Ignition Tank 优先给真正携带 Ignite 的火焰主核。',
      '把高频 proc 红装让 Commando 或 Engineer，自己专注技能冷却、强击与垂直机动。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['crowbar', 'backup-magazine', 'mocha', 'gasoline', 'oddly-shaped-opal'], explanation: '三件撬棍、两件弹匣后补移动和一层汽油，让强击与安全蓄力同时成立。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'ignition-tank', 'hopoo-feather'], explanation: '双手环与点火罐集中火焰爆发，再用羽毛修正 Ion Surge 后的落点。' },
      { phase: '后期', picks: ['alien-head', 'hardlight-afterburner', 'brilliant-behemoth'], explanation: '先缩短全部冷却或增加升空次数，最后用巨兽补弹体范围伤害。' },
    ],
    voidItems: [
      pick('voidsent-flame', 'recommended', '1 件起', "腐化 Will-o'-the-wisp，改为满血目标爆炸", '撬棍与 Nano-Spear 同样瞄准满血首击，爆炸机制完全顺着强击路线。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，提供可预测冷却格挡', 'Ion Surge 与蓄力技能空窗间可计划保护，避免随机格挡不可控。'),
      pick('lysate-cell', 'conditional', '特殊技能流 1 件', '腐化 Fuel Cell，增加 Ion Surge 特殊充能', '多次升空提高生存；若 Preon 或电容器是装备核心则保留燃料电池。'),
      pick('needletick', 'avoid', '不建议低命中技能流', '腐化 Tri-Tip Dagger，把流血改为坍缩', '工匠命中频率偏低，难以快速堆满坍缩，收益不如稳定强击。'),
    ],
    lunarItems: [
      pick('light-flux-pauldron', 'recommended', '纯技能流 1 件', '大幅缩短技能冷却但显著降低攻击速度', '工匠依靠高倍率技能可接受主攻变慢，但需要重新适应 Flame Bolt 充能。'),
      pick('shaped-glass', 'conditional', '高熟练 1 件', '倍增强击与处决伤害但减半最大生命', '一击线显著提高，悬浮时被远程擦伤也可能立刻致命。'),
      pick('gesture-of-the-drowned', 'avoid', 'Preon 配置不建议', '自动释放装备并失去手动保留爆发时机', '长冷却 Preon 可能被杂兵浪费，只有换短冷却装备后才考虑。'),
    ],
    combatNotes: combat(
      '长矛冻结精英，冰墙控行进线，Flame Bolt 轮射；危险时 Ion Surge 重置位置。',
      '预蓄副技能和装备触发双环，落地绕掩体，技能恢复后再升空。',
      'Flame Bolt 和长矛负责点杀，Royal Capacitor 补远处目标；Snapfreeze 留给地面敌人。',
      'Ion Surge 可躲锤击但别漂到无掩体高空；夺取物品时靠冰墙和升空拖回技能。',
    ),
    sourceIds: ['wiki-artificer', 'wiki-proc-coefficient', 'wiki-items', 'official-ac-release-notes'],
    verifiedOn,
  },
  {
    slug: 'mercenary',
    nameZh: '雇佣兵',
    nameEn: 'Mercenary',
    dlc: 'base',
    portrait: 'assets/survivors/mercenary.png',
    role: '近战 Expose 冷却循环与无敌帧连段',
    difficulty: 5,
    summary: '通过第三刀施加 Expose、消费标记减少全部技能冷却，并把多段位移与 Eviscerate 无敌窗口串成贴身时间轴；高伤但非常依赖技能顺序。',
    skills: [
      skill('mercenary', 'passive', '控制增强', 'Cybernetic Enhancements', 'default', '提供二段跳，是近战空中追击与落点修正的基础。'),
      skill('mercenary', 'primary', '激光剑', 'Laser Sword', 'default', '唯一主攻，第三击施加 Expose 以启动冷却循环。'),
      skill('mercenary', 'secondary', '旋风斩', 'Whirlwind', 'default', '双击、空中位移与连段最通用，也能稳定消费 Expose。'),
      skill('mercenary', 'utility', '致盲突袭', 'Blinding Assault', 'default', '命中后最多三段，机动、追击和无敌链比替代技能稳定。'),
      skill('mercenary', 'special', '剔骨', 'Eviscerate', 'default', '持续不可被命中窗口适合 Eclipse，稳定性高于远程极限输出。'),
    ],
    buildLogic: [
      'Laser Sword 第三击施加 Expose，再用 Whirlwind 或突袭消费；命中标记会追加基础伤并让所有技能冷却减少一秒。',
      'Eviscerate 持续及短暂结束后不可被命中，攻击速度增加命中次数但不延长时间；用它穿过明确危险招式。',
      'Blinding Assault 必须命中才获得后续段，进场前确认下一目标和落点；近战生存来自路径和技能轴，不是堆血硬抗。',
      'Focus Crystal、攻速与暴击建立伤害后，优先 Hardlight Afterburner、Alien Head、格挡和复活，缩短所有技能真空。',
    ],
    solo: {
      common: [
        pick('focus-crystal', 'core', '3–5 件', '提供贴身范围内持续生效的独立增伤', '剑、Whirlwind 和 Eviscerate 都在近距离命中，几乎全程兑现乘区。'),
        pick('soldiers-syringe', 'core', '3–6 件', '加快剑连段并增加 Eviscerate 命中次数', '更快第三刀意味着更多 Expose，特殊期间命中也随攻速增长。'),
        pick('topaz-brooch', 'recommended', '1–3 件', '击杀小怪后叠屏障保护下一次贴身进场', '高机动连续清杂能维持屏障，但不能因此主动吃高伤攻击。'),
      ],
      uncommon: [
        pick('predatory-instincts', 'core', '1–3 件', '暴击后进一步提高剑与特殊的攻击速度', '满暴击时稳定维持攻速层，增加 Expose 和 Eviscerate 频率。'),
        pick('harvesters-scythe', 'recommended', '1–2 件', '高频暴击提供贴身持续恢复能力', '与眼镜和捕食本能共用暴击核心，Eclipse 仍以不受击为主。'),
        pick('rose-buckler', 'recommended', '1–3 件', '冲刺和技能移动期间提供额外护甲', '频繁位移让条件较易维持，适合近战穿过敌群。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'core', '1 件', '增加 Blinding Assault 充能并延长位移链', '更多突袭意味着更多无敌和落点选择，是最直接的生存红。'),
        pick('alien-head', 'recommended', '1 件', '缩短全部技能冷却并减少贴身真空期', '与 Expose 的固定减冷却叠加，让整套连段更快回转。'),
      ],
      boss: [
        pick('little-disciple', 'core', '1 件起', '持续冲刺时自动发射追踪弹补清群', 'Mercenary 常在冲刺和位移中，能稳定触发而不打断剑连段。'),
        pick('shatterspleen', 'recommended', '满暴击后 1 件', '增加流血与击杀爆炸，改善贴身清群', '高频暴击稳定触发，与捕食本能和镰刀共用同一核心。'),
      ],
      equipment: [
        pick('gorags-opus', 'recommended', '团队窗口携带', '提供攻击与移动速度，放大特殊命中次数', '传送器爆发时团队共用，Eviscerate 也会获得更多命中。'),
        pick('super-massive-leech', 'conditional', '危险阶段携带', '把短时高频伤害转成战斗恢复能力', '只能在安全输出窗救急，不提供无敌，不能用来硬吃致命一击。'),
      ],
    },
    coopAdjustments: [
      '负责贴身牵制和消费 Expose，但不要把怪群带离队友 AoE 或聚怪区域。',
      'Focus Crystal、镰刀和 Rose Buckler 对前排优先；撬棍手环应让给 Loader。',
      "Gorag's Opus 在全队首领爆发窗开启，不用作个人赶路或单刷小怪。",
    ],
    commandRoute: [
      { phase: '前期', picks: ['focus-crystal', 'soldiers-syringe', 'lens-makers-glasses', 'topaz-brooch', 'energy-drink'], explanation: '先做三件凝神水晶、攻速和暴击，再补屏障与冲刺速度保护近战进场。' },
      { phase: '中期', picks: ['predatory-instincts', 'harvesters-scythe', 'ukulele', 'rose-buckler'], explanation: '暴击攻速和恢复形成闭环，Ukulele 补清群，圆盾保护持续冲刺。' },
      { phase: '后期', picks: ['hardlight-afterburner', 'alien-head', 'dios-best-friend'], explanation: '位移充能和全技能冷却优先于贪伤害，最后用复活保险近战失误。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，得到按冷却恢复的可预测格挡', '当前修复后无敌期间不会浪费护盾，能与 Eviscerate 时间轴稳定轮换。'),
      pick('polylute', 'recommended', '已有清群时 1 件', '腐化 Ukulele，把连锁伤害换成单体多段雷击', 'Eviscerate 多次命中能频繁触发，Frost Relic 已清群时尤其合适。'),
      pick('lysate-cell', 'conditional', '装备不关键时 1 件', '腐化 Fuel Cell，增加 Eviscerate 特殊充能', '多一层无敌窗口很强，但依赖救命装备时仍应保留燃料电池。'),
      pick('lost-seers-lenses', 'avoid', '不建议拾取', '腐化全部暴击眼镜并失去稳定暴击', '会同时破坏捕食本能、镰刀和 Shatterspleen 的攻防闭环。'),
    ],
    lunarItems: [
      pick('purity', 'recommended', '纯技能路线 1 件', '缩短技能冷却并强化 Expose 连段回转', '负幸运会削弱 AtG 等 proc，适合明确依赖技能倍率和无敌链的路线。'),
      pick('light-flux-pauldron', 'conditional', 'Slicing Winds 技能流 1 件', '进一步缩短技能冷却但降低普通攻击速度', '会减少 Eviscerate 命中和剑手感，默认推荐配置需谨慎。'),
      pick('strides-of-heresy', 'avoid', '除完整转化外不拿', '替换关键 Blinding Assault 位移与连段技能', '会直接破坏三段突袭和 Expose 时间轴，只有准备转 Heretic 才合理。'),
    ],
    combatNotes: combat(
      '第三刀上 Expose，Whirlwind 消费，Blinding Assault 穿群，Eviscerate 躲明确伤害后重复。',
      '贴侧后方三刀循环，读到大招时 Eviscerate 或突袭穿过；技能全空立即离开。',
      '用 Blinding Assault 连段与 Eviscerate 黏住，高空无落点时改装备点杀。',
      '保留一段突袭和 Eviscerate 应对锤击；夺取物品阶段利用无敌帧而非中心硬换。',
    ),
    sourceIds: ['wiki-mercenary', 'wiki-proc-coefficient', 'wiki-items', 'official-ac-release-notes'],
    verifiedOn,
  },
  {
    slug: 'rex',
    nameZh: 'REX',
    nameEn: 'REX',
    dlc: 'base',
    portrait: 'assets/survivors/rex.png',
    role: '远程 Weaken 控制与生命资源自愈炮台',
    difficulty: 4,
    summary: '用 Weaken 降低敌人伤害、速度与护甲，再以 Inject 和 Tangling Growth 维持治疗；稳定 Eclipse 路线选择无生命成本的 DIRECTIVE: Drill。',
    skills: [
      skill('rex', 'passive', '天然毒素', 'Natural Toxins', 'default', '让指定技能施加 Weaken，是团队减伤和降甲核心。'),
      skill('rex', 'primary', '指令：注射', 'DIRECTIVE: Inject', 'default', '三针末击施加 Weaken，并按造成伤害回复生命。'),
      skill('rex', 'secondary', '指令：钻孔', 'DIRECTIVE: Drill', 'unlock-required', '十六次命中且无耗血，是 Eclipse 稳定路线首选。'),
      skill('rex', 'utility', '指令：驱散', 'DIRECTIVE: Disperse', 'default', '无生命成本的推开与反向位移，避免 Bramble 主动压血。'),
      skill('rex', 'special', '缠绕生长', 'Tangling Growth', 'default', '群体聚怪与治疗最强，但消耗生命，Eclipse 8 必须控制使用。'),
    ],
    buildLogic: [
      'Inject 末击和其他技能维持 Weaken，显著降低首领伤害、速度并降甲；高威胁目标应常驻而不是只在开场挂一次。',
      'DIRECTIVE: Drill 提供十六次 0.5 proc 且不耗血，Backup Magazine 增加覆盖层数，是稳定 Eclipse 构筑的核心。',
      'Tangling Growth 先把怪群聚在一起，再叠 Drill；Disperse 可推回控制区或反向跳推，生命低时停止一切自伤。',
      '普通 Monsoon 可放大治疗，Eclipse 尤其 E8 更重视 Alien Head、机动、复活和避免永久伤，不能用自愈掩盖风险。',
    ],
    solo: {
      common: [
        pick('backup-magazine', 'core', '3–5 件', '增加 Drill 储备并延长区域持续覆盖', '每层都增加十六次多段命中，是最直接且无耗血的白色伤害件。'),
        pick('cautious-slug', 'recommended', '1–3 件', '提供脱战恢复而不依赖暴击或主动耗血', '危险后离开战斗恢复，避免为了治疗再次使用生命成本技能。'),
        pick('oddly-shaped-opal', 'recommended', '1 件', '自伤技能后抵挡下一次外部攻击伤害', 'Tangling Growth 压低安全线后，蛋白石提供关键第一击容错。'),
      ],
      uncommon: [
        pick('death-mark', 'core', '条件满足时 1 件', '利用 Weaken 与其他 debuff 触发独立增伤', 'REX 自带 Weaken，队伍或物品补齐四类减益后能稳定激活。'),
        pick('atg-missile-mk-1', 'recommended', '1–3 件', '把 Drill 多段命中转成额外导弹伤害', '十六次 0.5 proc 提供大量触发机会，兼顾群体和单体输出。'),
        pick('infusion', 'conditional', '1–2 件', '增加最大生命并提高承压与治疗底盘', '绝对生命更高但百分比自伤的绝对值也会提高，不能当免费减耗。'),
      ],
      legendary: [
        pick('rejuvenation-rack', 'recommended', 'Monsoon 1 件', '倍增 Inject 与 Tangling Growth 的治疗量', '普通难度能快速回到安全线，E8 治疗受限时优先级低于机动。'),
        pick('alien-head', 'core', '1 件', '缩短 Drill、控制和位移技能冷却', '让无耗血技能更频繁，减少依赖高风险自伤技能的必要。'),
      ],
      boss: [
        pick('mired-urn', 'recommended', '近战需要时 1 件', '只牵引附近敌人并提供 tar、伤害和吸血', '当前机制不会吸队友，能补 Death Mark 减益和近距维持。'),
        pick('titanic-knurl', 'recommended', '1 件起', '增加最大生命和基础回复的稳定底盘', '提高承压能力但百分比自伤绝对值同步变化，仍要控制技能成本。'),
      ],
      equipment: [
        pick('super-massive-leech', 'conditional', '危急恢复携带', '在爆发期把造成伤害转换为快速治疗', 'Drill 多段命中能迅速恢复，但装备不是无敌，低血仍先撤离。'),
        pick('royal-capacitor', 'recommended', '通用携带 1 件', '远程点杀高威胁目标并补瞬时伤害', 'REX 远程控制能安全指定目标，装备伤害也帮助尽快结束自伤窗口。'),
      ],
    },
    coopAdjustments: [
      'Tangling Growth 对准队友 AoE，把 Weaken 常驻在首领和精英上，承担团队减伤与聚怪。',
      'Mired Urn 当前只牵引敌人，可按谁需要 tar 与自疗分配，不再担心吸队友。',
      'Inject 与 Tangling 已能自给治疗，稀缺急救资源优先让给无自愈前排；Death Mark 由全队补减益。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['backup-magazine', 'mocha', 'cautious-slug', 'oddly-shaped-opal'], explanation: '先做两层 Drill 库存、基础移动、脱战恢复和自伤后的第一下保护。' },
      { phase: '中期', picks: ['death-mark', 'atg-missile-mk-1', 'hopoo-feather', 'infusion'], explanation: '利用 Weaken 建立死亡标记，导弹放大 Drill，再补垂直机动与有限生命。' },
      { phase: '后期', picks: ['alien-head', 'rejuvenation-rack', 'hardlight-afterburner'], explanation: 'Eclipse 优先技能冷却和位移，普通 Monsoon 再用回春支架放大治疗。' },
    ],
    voidItems: [
      pick('weeping-fungus', 'recommended', '1 件起', '腐化 Bustling Fungus，改为冲刺移动时恢复', 'REX 不适合固定站圈，移动恢复更符合控制后拉开距离的节奏。'),
      pick('polylute', 'recommended', '1 件起', '腐化 Ukulele，把群体连锁换成单体雷击', 'Tangling 已负责聚群，Drill 多段命中则能频繁触发 Boss 雷击。'),
      pick('needletick', 'conditional', 'Death Mark 不缺流血时 1 件', '腐化 Tri-Tip Dagger，把流血改为坍缩爆发', 'Drill 能快速叠坍缩；若队伍靠流血补四类减益就保留原件。'),
      pick('plasma-shrimp', 'avoid', '稳定路线不建议', '腐化 AtG Missile Mk. 1，以护盾维持每击导弹', '自伤和频繁掉血会打断护盾，可靠性明显低于普通 AtG。'),
    ],
    lunarItems: [
      pick('purity', 'conditional', '纯技能控制流 1 件', '缩短技能冷却并减少自伤技能依赖', '负幸运会削弱 Drill 的导弹与连锁 proc，只适合明确的纯技能路线。'),
      pick('corpsebloom', 'conditional', '普通 Monsoon 谨慎 1 件', '提高总治疗但限制单位时间的恢复速度', '爆发自伤后可能回得太慢，Eclipse 尤其永久伤环境应避免。'),
      pick('transcendence', 'avoid', '不建议稳定 REX 拾取', '把除一点外的生命转护盾并使治疗失效', '会恶化生命消耗与 Inject、Tangling 治疗核心的所有互动。'),
    ],
    combatNotes: combat(
      'Tangling 聚群后叠 Drill，Inject 维持 Weaken 和回血，Disperse 把近身怪推回控制区。',
      '常驻 Weaken 并预判 Drill 落点；生命低于安全线时停止所有主动耗血技能。',
      'Inject 和 Drill 预判弹道，Disperse 推开；Tangling 锁定后集中远程火力。',
      '利用 Disperse 反推躲线，永久伤高时少用 Tangling；夺取物品阶段靠 Weaken 慢打。',
    ),
    sourceIds: ['wiki-rex', 'wiki-proc-coefficient', 'wiki-items', 'wiki-mired-urn'],
    verifiedOn,
  },
  {
    slug: 'loader',
    nameZh: '装载机',
    nameEn: 'Loader',
    dlc: 'base',
    portrait: 'assets/survivors/loader.png',
    role: '钩索动量、Heavy 一拳与高速近战爆发',
    difficulty: 4,
    summary: '通过钩索摆荡积累速度，再让 Heavy 拳把当前速度转换为巨大单击伤害；命中产生屏障且免疫坠落伤害，但高难生存仍依赖路径。',
    skills: [
      skill('loader', 'passive', '废料屏障', 'Scrap Barrier', 'default', '免疫坠落伤害，并由主攻和两种拳命中获得屏障。'),
      skill('loader', 'primary', '铁拳', 'Knuckleboom', 'default', '唯一主技能，重拳空窗补伤并通过命中继续积累屏障。'),
      skill('loader', 'secondary', '尖刺拳', 'Spiked Fist', 'unlock-required', '自带伤害和眩晕，对重目标仍会把自己拉过去。'),
      skill('loader', 'utility', '充能拳套', 'Charged Gauntlet', 'default', '穿透群体且速度上限更高，最能兑现熟练摆荡动量。'),
      skill('loader', 'special', '雷霆震击', 'Thunderslam', 'unlock-required', '落地高倍率爆发和眩晕，首领窗口强；对空压力大可换 Pylon。'),
    ],
    buildLogic: [
      '先用 Spiked Fist 钩住重目标或地形沿切线摆荡，在速度峰值释放 Charged Gauntlet；Heavy 伤害会随当前速度增加。',
      '拳命中后继续飞离目标，不在首领面前急停；空窗用钩索和冲刺保存动量，下一次进场才重新集中伤害。',
      '屏障只来自有效近战命中，Pylon 和 Thunderslam 不提供；高难度仍靠路径规避，不能把屏障当硬抗许可。',
      '撬棍、移动速度、凝神水晶和双手环组成一拳乘区，成型后优先增加拳充能、格挡和复活以保护每次进出。',
    ],
    solo: {
      common: [
        pick('crowbar', 'core', '5–10 件', '放大满血目标的一拳开场和处决阈值', 'Charged Gauntlet 高倍率和速度乘区让 Crowbar 在首击时充分兑现。'),
        pick('pauls-goat-hoof', 'core', '3–5 件', '提高摆荡速度并直接放大 Heavy 拳伤害', '速度同时是机动和伤害资源，是 Loader 最具角色特化的白色件。'),
        pick('focus-crystal', 'core', '3–5 件', '提供近距离稳定生效的独立伤害乘区', '拳命中判定发生在贴身范围，与撬棍和速度倍率相乘。'),
      ],
      uncommon: [
        pick('kjaro-band', 'core', '1 件', '让高倍率拳稳定触发火环范围爆发', '每次蓄拳都越过手环阈值，火环帮助一拳清理周围杂兵。'),
        pick('runald-band', 'core', '1 件', '让蓄拳同步触发冰环与减速伤害', '与 Kjaro 组成完整单击爆发，首件价值远高于继续堆攻速。'),
        pick('wax-quail', 'recommended', '1–2 件', '冲刺跳提供额外速度和落点修正', '高速度同时提升路径安全与 Heavy 伤害，但要避免冲过目标。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'core', '1 件', '增加 Charged Gauntlet 充能并提高爆发次数', '更多拳既是伤害也是长距离位移，是 Loader 最直接的红装提升。'),
        pick('h3ad-5t-v2', 'recommended', '1 件', '利用免坠伤优势制造额外重砸爆发', 'Loader 可安全从高处落地，把 H3AD 的落地伤害接入移动循环。'),
      ],
      boss: [
        pick('shatterspleen', 'recommended', '暴击成型后 1 件', '把一拳暴击转成流血和击杀群体爆炸', '高单击暴击能迅速引爆周围敌人，改善近战入场后的清群。'),
        pick('charged-perforator', 'core', '1 件起', '强击触发高额电击并补充首领伤害', 'Charged Gauntlet 的完整 proc 和高倍率能稳定启动钻机。'),
      ],
      equipment: [
        pick('preon-accumulator', 'recommended', '首领开场携带', '提供额外高倍率开场爆发并同步双手环', '预先摆荡后拳与 Preon 集中在同一首领窗口，快速越过阶段。'),
        pick('ocular-hud', 'conditional', '暴击未满时携带', '让一拳进入可靠暴击窗口并触发暴击体系', '满暴击后可换 Royal Capacitor，避免装备效果重复。'),
      ],
    },
    coopAdjustments: [
      'Loader 是撬棍和双手环第一优先候选之一，与 Railgunner、Bandit 协商每人至少一套。',
      '把攻速、高频 proc 与无人机件让给持续射手，自己负责快速开远箱和点杀高威胁精英。',
      '不要把首领拉出传送器或队伍 AoE；若队友无法处理飞行群，可改 M551 Pylon。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['pauls-goat-hoof', 'crowbar', 'focus-crystal', 'oddly-shaped-opal'], explanation: '先做两件山羊蹄、三件撬棍和两件水晶，让摆荡与一拳阈值同时成立。' },
      { phase: '中期', picks: ['kjaro-band', 'runald-band', 'wax-quail', 'hopoo-feather'], explanation: '双手环提供一次完整强击，再用鹌鹑和羽毛提高速度与落点修正。' },
      { phase: '后期', picks: ['hardlight-afterburner', 'h3ad-5t-v2', 'dios-best-friend'], explanation: '先增加拳充能，再补落地爆发和一次复活，终局伤害够后继续机动。' },
    ],
    voidItems: [
      pick('voidsent-flame', 'recommended', '1 件起', "腐化 Will-o'-the-wisp，改为满血目标爆炸", '与 Crowbar 和满速 Charged Gauntlet 同步命中，把一拳扩展为清群。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，提供可预测冷却格挡', '两次高速进场之间可以等待保护恢复，更符合一拳即撤的节奏。'),
      pick('lysate-cell', 'conditional', '装备不关键时 1 件', '腐化 Fuel Cell，增加 Thunderslam 特殊充能', '多一次落地爆发很强；若 Preon 是开场核心则保留燃料电池。'),
      pick('needletick', 'avoid', '不建议低频一拳流', '腐化 Tri-Tip Dagger，把流血改为坍缩', '低频重击难以快速叠满坍缩，收益低于强击和手环体系。'),
    ],
    lunarItems: [
      pick('purity', 'recommended', '纯倍率一拳流 1 件', '缩短拳、钩索和特殊技能冷却', '负幸运对纯倍率路线代价较小，但会削弱手环和钻机等 proc。'),
      pick('shaped-glass', 'conditional', '高熟练 1 件', '倍增一拳伤害并极大提高处决阈值', '同时减半最大生命，只有路线熟练且已有复活时才承担风险。'),
      pick('strides-of-heresy', 'avoid', '除完整转化外不拿', '替换 Charged Gauntlet 并破坏速度伤害核心', '失去主要拳和位移循环，单件完全不符合 Loader 构筑。'),
    ],
    combatNotes: combat(
      '钩住边缘重目标或地形，满速拳穿精英群，Thunderslam 落地后继续飞离。',
      '预先拉长摆荡，速度峰值一拳触发双环；首领出招期间绕场继续积速。',
      'Spiked Fist 拉近后拳穿过，或条件换 Pylon 慢清；始终保留下一个锚点。',
      '钩柱子和场边避锤及旋转墙；夺取物品阶段一拳即撤，不在中心停留。',
    ),
    sourceIds: ['wiki-loader', 'wiki-proc-coefficient', 'wiki-items'],
    verifiedOn,
  },
  {
    slug: 'acrid',
    nameZh: '阿克里德',
    nameEn: 'Acrid',
    dlc: 'base',
    portrait: 'assets/survivors/acrid.png',
    role: '百分比 Poison 削血、传播与外部伤害收尾',
    difficulty: 3,
    summary: '用 Epidemic 把百分比 Poison 传播给高血目标，再靠汽油、触发链或装备完成最后一击；Poison 本身不能击杀，因此收尾能力比堆近战更关键。',
    skills: [
      skill('acrid', 'passive', '剧毒', 'Poison', 'default', '长局与高血 Boss 最稳定，按目标生命削血但不能单独击杀。'),
      skill('acrid', 'primary', '恶毒创伤', 'Vicious Wounds', 'default', '唯一主攻，安全窗口近战三连并负责最终收尾。'),
      skill('acrid', 'secondary', '神经毒素', 'Neurotoxin', 'default', '远程施毒且不强迫贴脸，比 Ravenous Bite 更稳定。'),
      skill('acrid', 'utility', '腐蚀飞跃', 'Caustic Leap', 'default', '两层充能和毒池控制，进场与退场各保留一次。'),
      skill('acrid', 'special', '传染', 'Epidemic', 'default', '唯一特殊技能，把 Poison 在怪群中连续传播。'),
    ],
    buildLogic: [
      'Epidemic 先投到怪群中央，让 Poison 把高血目标压到一生命；它不能单独击杀，必须由汽油、主攻、装备或 proc 收尾。',
      'Caustic Leap 进场和退场各留一次，落点毒池主要提供控制而非高 proc；稳定打法是远程上毒后绕地形。',
      'Poison 对长局和高血 Boss 远胜按基础伤害成长的 Blight，因此推荐默认被动，不围绕短局主动叠层切换。',
      '收尾链建立后再补技能冷却和移动，避免把资源浪费在强迫贴脸；首领战只需维持 Poison 并耐心处理小怪。',
    ],
    solo: {
      common: [
        pick('gasoline', 'core', '1–3 件', '解决 Poison 不能击杀并把尾刀扩成清群', '任一外部伤害收掉一生命目标后，汽油会连锁引爆周围被毒敌人。'),
        pick('tri-tip-dagger', 'recommended', '5–10 件', '用远近命中补充可直接击杀的持续流血', '流血与 Poison 并行并能完成最后一击，改善单体收尾可靠性。'),
        pick('backup-magazine', 'recommended', '2–3 件', '增加 Neurotoxin 储备并扩大远程覆盖', '更多安全远程施毒减少必须贴身使用 Vicious Wounds 的次数。'),
      ],
      uncommon: [
        pick('ukulele', 'core', '1–3 件', '把任意收尾命中扩散成额外群体伤害', '被 Poison 压低的怪群很容易被连锁依次收掉，并继续触发汽油。'),
        pick('atg-missile-mk-1', 'recommended', '1–3 件', '为技能命中补充可击杀的独立导弹伤害', '导弹能点掉低血精英并接 on-kill 链，弥补 Poison 的限制。'),
        pick('death-mark', 'recommended', '减益齐全时 1 件', '利用 Poison、毒池减速和队伍减益触发增伤', 'Acrid 已自带多类 debuff，团队补齐四类后能稳定放大收尾伤害。'),
      ],
      legendary: [
        pick('brilliant-behemoth', 'core', '1 件', '让每次命中附带可完成尾刀的范围爆炸', '爆炸会收掉一生命目标并连锁汽油，是最可靠的终局收尾红。'),
        pick('ceremonial-dagger', 'recommended', '1 件', '首个击杀后自动追踪其余低血目标', 'Poison 先把全场压低，仪式匕首从第一个尾刀开始自动清屏。'),
      ],
      boss: [
        pick('mired-urn', 'recommended', '近战时 1 件', '只牵引附近敌人并提供 tar、伤害与吸血', '当前不会吸队友，能帮助近战维持并补 Death Mark 的减益来源。'),
        pick('little-disciple', 'recommended', '1 件起', '持续冲刺时自动发射追踪伤害完成尾刀', '远程上毒后绕圈即可持续触发，非常适合一生命收尾。'),
      ],
      equipment: [
        pick('royal-capacitor', 'core', '携带 1 件', '精准点掉一生命飞行精英并启动击杀链', 'Epidemic 传播后可选择最高威胁目标，不必贴脸寻找尾刀。'),
        pick('forgive-me-please', 'conditional', 'on-kill 成型后携带', '远程主动触发击杀类物品并启动清场', '配汽油、鬼火或仪式匕首可从安全位置启动链条。'),
      ],
    },
    coopAdjustments: [
      'Acrid 给所有高血目标挂 Poison，队友负责尾刀，因此无需抢撬棍和双手环等强击资源。',
      'Death Mark 由队伍共同补减益；Mired Urn 当前只吸敌人，可按近战前排需求分配。',
      'Epidemic 先铺全场，不与队友争低血尾刀；把 Loader 或 Railgunner 的强击窗口留给首领。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['gasoline', 'energy-drink', 'backup-magazine', 'oddly-shaped-opal'], explanation: '第一件汽油先解决不能击杀，再补移动、神经毒素库存和第一下保护。' },
      { phase: '中期', picks: ['ukulele', 'atg-missile-mk-1', 'death-mark', 'hopoo-feather'], explanation: '连锁和导弹承担尾刀，死亡标记放大减益目标，羽毛保护跳跃落点。' },
      { phase: '后期', picks: ['brilliant-behemoth', 'ceremonial-dagger', 'alien-head'], explanation: '巨兽或仪式匕首先完成自动清屏，再用外星脑袋提高传播和位移频率。' },
    ],
    voidItems: [
      pick('voidsent-flame', 'recommended', '1 件起', "腐化 Will-o'-the-wisp，改为攻击满血目标爆炸", 'Epidemic 后的首击范围伤能提供额外外部收尾链，与汽油互相启动。'),
      pick('polylute', 'recommended', '队伍有 AoE 时 1 件', '腐化 Ukulele，把群体连锁换成单体多段雷击', '首领被 Poison 压血后雷击可补稳定尾刀，自己缺清群则保留原件。'),
      pick('needletick', 'conditional', '短战 1 件', '腐化 Tri-Tip Dagger，把流血改成延迟坍缩', '坍缩能击杀被 Poison 压低的目标；长 Boss 战更需要持续流血。'),
      pick('lost-seers-lenses', 'avoid', '不建议作为收尾核心', '腐化暴击眼镜并改为极低概率瞬杀', '随机瞬杀不能替代稳定尾刀，还会拆掉所有正常暴击基础。'),
    ],
    lunarItems: [
      pick('purity', 'recommended', '纯技能毒流 1 件', '缩短 Epidemic 和 Caustic Leap 冷却', 'Poison 本体不依赖幸运；若 proc 收尾不强，负幸运代价相对可控。'),
      pick('visions-of-heresy', 'conditional', '纯远程路线 1 件', '替换近战 Vicious Wounds，提供远程主攻收尾', '能改善不想贴脸的 Acrid，但会改变主攻节奏，也是 Heretic 转化部件。'),
      pick('shaped-glass', 'avoid', '不建议稳定路线', '倍增部分伤害但减半最大生命与容错', 'Poison 百分比部分不会简单等比例获益，付出的生存代价过高。'),
    ],
    combatNotes: combat(
      'Epidemic 投中央，Neurotoxin 补散怪，绕圈等毒压血，再由汽油或装备收尾。',
      '只需维持 Poison，把时间用于躲招和清小怪，安全时用主攻补最后一击。',
      'Epidemic 传播后用 Neurotoxin 或电容器收尾，Leap 不跳进没有落点的空域。',
      '远程上毒并用 Leap 横越旋转墙；夺取物品阶段仍靠百分比 Poison 耐心削血。',
    ),
    sourceIds: ['wiki-acrid', 'wiki-acrid-poison', 'wiki-proc-coefficient', 'wiki-items', 'wiki-mired-urn'],
    verifiedOn,
  },
  {
    slug: 'captain',
    nameZh: '舰长',
    nameEn: 'Captain',
    dlc: 'base',
    portrait: 'assets/survivors/captain.png',
    role: '霰弹触发、轨道控场与每关经济支援',
    difficulty: 3,
    summary: 'Vulcan Shotgun 的八颗弹丸提供密集触发，轨道探针负责控场，Hacking Beacon 每关免费高价值金币对象；没有原生位移，移动物品必须优先。',
    skills: [
      skill('captain', 'passive', '防御用微型机器人', 'Defensive Microbots', 'default', '拦截附近投射物并由无人机继承，是角色特有防御核心。'),
      skill('captain', 'primary', '火神霰弹枪', 'Vulcan Shotgun', 'default', '唯一主攻，八弹丸各有触发判定，蓄力只收紧散布。'),
      skill('captain', 'secondary', '电击枪', 'Power Tazer', 'default', '唯一副技能，先眩晕普通目标再预判 Probe 落点。'),
      skill('captain', 'utility', '轨道探针', 'Orbital Probe', 'default', '三次短延迟轨道打击比会伤及全员的 DIABLO 稳定。'),
      skill('captain', 'special', '骇入信标', 'Beacon: Hacking', 'unlock-required', 'Orbital Supply Beacon 的两格都选择 Hacking；每关免费关键金币对象，落地后不可回收。'),
    ],
    buildLogic: [
      'Vulcan Shotgun 八弹丸各有 0.75 proc，蓄力只收紧散布不提高总伤；靠近大目标可密集触发 AtG、Ukulele 和流血。',
      'Hacking Beacon 将附近金币购买对象逐个降到零，优先传奇箱、无人机商店或多个对象密集处；月球币对象不免费。',
      'Captain 无原生位移，Mocha、山羊蹄、两层羽毛和蛋白石优先于小额伤害；Tazer 接 Probe 让敌人停在落点。',
      '部分 Hidden Realms 不能使用轨道技能，最终关也不能把信标当唯一生存；终场前必须由纯物品补齐移动和防护。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '同时补无原生位移的移动和霰弹攻速', '跑位与射击手感同步改善，是 Captain 前期最稳定的双属性投资。'),
        pick('pauls-goat-hoof', 'core', '3–5 件', '提高基础移动并弥补完全没有 dash 的短板', '与 Mocha、羽毛共同保证轨道技能空窗不会被包围。'),
        pick('tri-tip-dagger', 'recommended', '做到 10 件等效流血率', '利用八颗霰弹的密集判定快速叠流血', '近距大目标能吃满多弹丸触发，是最适合 Captain 的白色输出件之一。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'core', '1–3 件', '把霰弹多次触发转成额外导弹单体伤害', '每次发射包含多颗弹丸，近中距能稳定拉起完整触发链。'),
        pick('shipping-request-form', 'recommended', '1 件起', '每关增加额外货运选择并提高整体经济', '与 Hacking Beacon 共同加速关键物品成型，减少地图停留时间。'),
        pick('hopoo-feather', 'core', '至少 2 件', '补齐无原生位移角色的垂直规避能力', '额外跳跃让 Probe 落点等待和最终旋转墙更安全。'),
      ],
      legendary: [
        pick('57-leaf-clover', 'core', '1 件', '重掷霰弹触发链并放大所有概率物品', '八弹丸提供大量判定，三叶草能稳定提高导弹、连锁与流血总收益。'),
        pick('spare-drone-parts', 'conditional', '已有无人机时 1 件', '强化继承 Defensive Microbots 的无人机队伍', '机械随从既输出又拦截投射物，但 Operator 在队时可能拥有更高优先级。'),
      ],
      boss: [
        pick('empathy-cores', 'recommended', '无人机体系 1 件', '利用无人机和盟友数量提高核心伤害', 'Hacking 能低成本购买无人机，容易扩大盟友规模并兑现收益。'),
        pick('charged-perforator', 'recommended', '1 件起', '把密集霰弹触发转成电击单体与链伤', '多弹丸 proc 提供大量触发机会，适合首领和飞行精英。'),
      ],
      equipment: [
        pick('executive-card', 'core', '经济阶段携带', '放大购买选择并进一步强化每关经济节奏', '与 Hacking 分工：信标免费大目标，卡片提高其余箱子和商店价值。'),
        pick('royal-capacitor', 'recommended', '成型后携带', '点杀高速飞行精英并补 Probe 难命中的目标', '角色成型后不再需要纯经济装备，可换成可靠短冷却战斗爆发。'),
      ],
    },
    coopAdjustments: [
      'Hacking Beacon 为全队省钱，落在传奇箱、无人机商店或密集对象前先沟通，避免浪费每关次数。',
      'Executive Card 全队只需一人；Spare Drone Parts 与 Operator 冲突时优先给无人机主核。',
      'Healing Beacon 是公共站点，Shocking 可保护无位移后排；不要把两枚信标都落在低价值单箱。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'pauls-goat-hoof', 'oddly-shaped-opal', 'lens-makers-glasses'], explanation: 'Mocha 和山羊蹄各两件先修复移动，再补蛋白石和暴击流血基础。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'hopoo-feather', 'shipping-request-form'], explanation: '导弹连锁负责霰弹触发，至少两层羽毛补垂直，货运申请加速经济。' },
      { phase: '后期', picks: ['57-leaf-clover', 'brilliant-behemoth', 'spare-drone-parts'], explanation: '三叶草和巨兽放大触发；已有无人机再取配件，终局前继续补纯物品移动。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '队伍有清群时 1 件', '腐化 Ukulele，把群体连锁换成单体雷击', '八颗霰弹能高频触发，适合首领；自己仍缺清群则保留原件。'),
      pick('lysate-cell', 'recommended', '信标支援流 1 件', '腐化 Fuel Cell，增加特殊信标充能', '额外信标扩大每关支援，但装备流仍应保留燃料电池。'),
      pick('encrusted-key', 'recommended', '经济路线 1 件', '腐化 Rusted Key，每关开启 Void 三选一缓存', '进一步提高每关物品选择质量，但会腐化全部生锈钥匙。'),
      pick('benthic-bloom', 'avoid', '不建议精确经济路线', '腐化 57 Leaf Clover 并随机升级普通物品', '会破坏 Hacking 与 Command 精确选择形成的移动和触发库存。'),
    ],
    lunarItems: [
      pick('strides-of-heresy', 'recommended', '需要机动时 1 件', '替换 Orbital Probe，获得无形移动与治疗', '可直接修复无 dash 短板，代价是失去轨道伤害；Hidden Realm 反而更实用。'),
      pick('focused-convergence', 'conditional', '清场和移速成型后 1 件', '缩小传送器区域并加快充能速度', 'Captain 无原生位移，区域过小会提高风险，只有移动充足时考虑。'),
      pick('brittle-crown', 'avoid', '不建议稳定经济路线', '命中赚金币但受伤会丢失大量金币', '无 dash 角色更容易被擦伤，反而削弱 Hacking 建立的经济优势。'),
    ],
    combatNotes: combat(
      'Hacking 先换资源，Tazer 定精英，Probe 预判落点，再蓄紧 Shotgun 近中距触发。',
      '三次 Probe 交错落点，近距霰弹打满；明显大招前提前远离，因为没有紧急 dash。',
      '蓄力霰弹收紧散布，Royal Capacitor 点杀；Probe 对高速空怪不稳定。',
      '依靠羽毛和移速而非轨道救场；柱子前放可用信标，夺取物品阶段借地形慢打。',
    ),
    sourceIds: ['wiki-captain', 'wiki-proc-coefficient', 'wiki-items', 'wiki-drones'],
    verifiedOn,
  },
]
