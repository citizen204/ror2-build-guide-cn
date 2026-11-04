import type { ItemPick, SurvivorGuideDraft } from '../../domain/guide'

const pick = (itemId: string, recommendation: ItemPick['recommendation'], stacks: string, role: string, synergy: string): ItemPick =>
  ({ itemId, recommendation, stacks, role, synergy })

const releaseBlockers = [
  '用正式版简体中文语言文件或带版本号的游戏截图核对角色、技能与物品名称。',
  '获取真实角色及技能图标，登记来源与哈希，不复用其他角色的图标。',
  '复核社区机制与游戏文本差异，并完成单人、联机、统率路线实测；推荐件数是编辑建议而非实测最优值。',
  '复核诅咒实现差异，补齐新增普通物品的效果、数值、叠加和获取条件；确认统率能否直接选择各新物品。',
]

/** Reviewable proposals, NOT included in the public survivor index or roster count. */
export const hcSurvivorDrafts: SurvivorGuideDraft[] = [
  {
    slug: 'enforcer', nameEn: 'Enforcer', proposedNameZh: '执行者', dlc: 'hc',
    status: 'draft', researchedOn: '2026-11-04', localizationStatus: 'pending-game-text',
    role: '正面防御、近距多段命中与守点支援', difficulty: 3,
    summary: '以默认盾牌和信标建立安全射界，用机动修正盾牌朝向；这些建议是基于公开机制的待实测方案，不能把正面格挡当作全方向无敌。',
    skills: [
      { slot: 'primary', nameEn: 'Trenchbroom', unlock: 'default', reason: '默认主攻兼顾远射和举盾后的多弹丸；先用同一套武器处理远近目标，避免开局额外解锁依赖。', sourceIds: ['wiki-enforcer'] },
      { slot: 'secondary', nameEn: 'Steel Protection', unlock: 'default', reason: '正面对敌举盾，适时再激活招架；推荐作为基础防御，收盾前先确认侧后方与退路。', sourceIds: ['official-hc-survivors-diary', 'wiki-enforcer'] },
      { slot: 'utility', nameEn: 'Shield Tackle', unlock: 'default', reason: '自带两次充能，可合并用于长距离移动。平时保留撤退机会，避免全部投入进场。', sourceIds: ['official-hc-survivors-diary'] },
      { slot: 'special', nameEn: 'Rally Point', unlock: 'default', reason: '用守点信标提供击杀屏障，适合传送器与团队聚集；一件技能不能代替移动和治疗。', sourceIds: ['official-hc-survivors-diary', 'wiki-enforcer'] },
    ],
    alternatives: [
      { slot: 'primary', nameEn: 'Shrapnel Grenade', assessment: '需要额外解锁；可作为范围清群分支，远程飞怪仍需装备或队友补位。', sourceIds: ['wiki-enforcer'] },
      { slot: 'secondary', nameEn: 'Surge Protection', assessment: '限时举盾后消耗护盾及屏障爆炸；与需要持续护盾的物品可能冲突，暂不作为稳定默认。', sourceIds: ['wiki-enforcer'] },
      { slot: 'utility', nameEn: 'Ripcord', assessment: '遥控爆炸可聚怪并反推自身；先练习空中落点，不把描述中的嘲讽当作稳定吸住所有敌人。', sourceIds: ['wiki-enforcer'] },
      { slot: 'special', nameEn: 'Crash Point', assessment: '落地一击为 700%，可研究手环爆发分支；牺牲团队信标后必须重做守点方案。', sourceIds: ['wiki-enforcer'] },
    ],
    buildLogic: [
      '以下选装与件数是编辑推导：优先普通移动速度、撤退工具与近距输出，再补多段命中的触发收益。',
      '举盾会限制移动；不要把冲刺物品当成举盾时永久生效的防御。保持敌人在同一侧比单纯堆伤害更重要。',
      '默认主攻普通单发为 350%，举盾后为六发各 70%；总和超过 400% 并不表示任何一颗都能触发手环。',
      '信标给予的是临时屏障，不是护盾；不能仅凭信标就认定等离子虾能持续工作。',
    ],
    solo: {
      common: [
        pick('pauls-goat-hoof', 'core', '先 2–3 件', '改善一般移动', '进入交叉火力时优先换位置，普通移速不需要先维持冲刺。'),
        pick('soldiers-syringe', 'recommended', '先 2–3 件', '改善射击与装填节奏', '先确认可以安全命中，再增加输出；不要为了攻速放弃移动。'),
        pick('focus-crystal', 'recommended', '先 1–3 件', '近距离增伤', '举盾近距输出时容易利用；远射或必须拉开距离时降低优先级。'),
        pick('oddly-shaped-opal', 'recommended', '先 1 件', '减少第一下失误风险', '保护换位空窗，不能补救被包围后的持续受击。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'recommended', '先 1 件，再按单体缺口补', '命中触发伤害', '多弹丸提供尝试触发的机会，但各击触发系数必须分别计算。'),
        pick('ukulele', 'recommended', '先 1 件', '补清群', '敌人分散时比强迫自己贴身更安全。'),
        pick('hopoo-feather', 'core', '先 1 件', '地形容错', '收盾移动时保留越障路线，举盾的跳跃替代动作不能当普通跳跃。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'recommended', '先 1 件', '增加机动余量', '充能留作撤退；更多进场距离本身不是安全收益。'),
        pick('57-leaf-clover', 'conditional', '已有触发组件时 1 件', '放大概率物品', '尚未凑齐触发物时，先修复机动与清群短板。'),
      ],
      boss: [pick('titanic-knurl', 'recommended', '先 1 件', '生命与回复', '提高基础容错；不需要为堆血牺牲关键移动。')],
      equipment: [pick('royal-capacitor', 'recommended', '对空不足时携带', '远程点杀', '飞怪从侧面绕盾时优先处理，避免只盯地面近敌。')],
    },
    coopAdjustments: [
      '信标放在队友能安全进入的位置，先沟通聚集方向；盾牌朝向主威胁，让队友处理侧后方。',
      '信标只移动自身固定随从，不会自动搬来队友工程师的炮台。',
      '不要把屏障当治疗或护盾分配依据；治疗给受伤队友，移速和羽毛优先补足前排换位。',
      '诅咒可能改变全队传送器难度；接取前沟通，不为个人神圣奖励擅自加压。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['pauls-goat-hoof', 'oddly-shaped-opal', 'soldiers-syringe'], explanation: '建议先移动和容错，再改善射击。件数不是硬上限；地图不熟时继续补生存。' },
      { phase: '中期', picks: ['hopoo-feather', 'ukulele', 'atg-missile-mk-1', 'focus-crystal'], explanation: '先补越障与清群，再补单体触发和近距伤害；保持能收盾撤离。' },
      { phase: '后期', picks: ['hardlight-afterburner', '57-leaf-clover', 'dios-best-friend'], explanation: '为最终战预留机动和保险；神圣物品获取与统率选择规则未核实，不写进必得路线。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '先 1 件', '替换更艰难的时光', '用于收盾、换位的短暂空窗，不把格挡当站桩许可。'),
      pick('plasma-shrimp', 'conditional', '实际护盾稳定时 1 件', '替换空对地导弹1号', '信标屏障不满足护盾条件；采用会消耗护盾的备选盾时降低优先级。'),
    ],
    lunarItems: [
      pick('shaped-glass', 'avoid', '基础路线不取', '牺牲生命换伤害', '盾牌覆盖有方向限制，侧面失误成本过高。'),
      pick('gesture-of-the-drowned', 'conditional', '装备无需保留时 1 件', '自动装备循环', '需要点杀飞怪或留给首领时，手动释放更可控。'),
    ],
    lunarEquipment: [],
    hallowedItems: [
      pick('corpse-lily', 'conditional', '有机会时先 1 件', '守点清群候选', '可研究与信标的守点区域联动；收益范围和实际覆盖率仍待实测，不能替代对空。'),
      pick('vile-censer', 'conditional', '有机会时先 1 件', '控制清群候选', '技能眩晕接命中值得测试；对免疫眩晕首领的机制另算，暂不作为唯一单体来源。'),
      pick('ritual-helmet', 'conditional', '机动分支再考虑', '冲刺伤害候选', '举盾不能冲刺，持续举盾方案优先其他掉落。'),
    ],
    combatNotes: [
      { title: '传送器事件', body: '先清侧后方，再在队友可进入的位置放信标；被包围就收盾转移，不用屏障硬换整片伤害。' },
      { title: '首领处理', body: '正面对盾、侧向留路。默认多弹丸不等于手环触发器；切爆发分支后再重新选择手环。' },
      { title: '飞行敌人', body: '使用远射和装备优先点杀；不为追一个飞怪把背部露给整群敌人。' },
      { title: '最终阶段 / 米斯历克斯', body: '少杂兵阶段不要依赖击杀屏障续航。预留冲刺躲锤击与交叉攻击；业力开启后的额外机制需另行验证。' },
    ],
    sourceIds: ['steam-hallowed-concepts', 'official-hc-release', 'official-hc-hotfix', 'official-hc-survivors-diary', 'wiki-enforcer'],
    releaseBlockers,
  },
  {
    slug: 'acolyte', nameEn: 'Acolyte', proposedNameZh: '侍僧', dlc: 'hc',
    status: 'draft', researchedOn: '2026-11-04', localizationStatus: 'pending-game-text',
    role: '近战连段、可恢复生命与变身爆发', difficulty: 5,
    summary: '通过技能命中兑现可恢复生命，以特殊技能建立变身窗口。下面是默认被动与变身的待实测路线，不把普通治疗当作即时救命。',
    skills: [
      { slot: 'passive', nameEn: "N'kuhana's Grace", unlock: 'default', reason: '治疗进入可恢复生命储备，再通过战斗恢复；基础路线优先保留这条恢复渠道。', sourceIds: ['official-hc-survivors-diary', 'wiki-acolyte'] },
      { slot: 'primary', nameEn: 'Blade Slice', unlock: 'default', reason: '普通斩击配合冲刺或跳跃形成快击；保留一次快击处理进出场，不把全部资源用在追击。', sourceIds: ['official-hc-survivors-diary', 'wiki-acolyte'] },
      { slot: 'secondary', nameEn: 'Bola Throw', unlock: 'default', reason: '拉出敌人灵魂，建立可近身攻击的目标；远程敌人较多时先用它创造安全进攻窗口。', sourceIds: ['official-hc-survivors-diary', 'wiki-acolyte'] },
      { slot: 'utility', nameEn: 'Blade Sling', unlock: 'default', reason: '先投刃再决定是否突进。描述的眩晕与社区实现不一致，暂不依赖它保证控制。', sourceIds: ['wiki-acolyte'] },
      { slot: 'special', nameEn: 'Sacrifice', unlock: 'default', reason: '命中积累两层信念，击杀额外一层，七层开启咏祷。把高伤单击留给关键目标或可靠尾刀。', sourceIds: ['wiki-hc-skills'] },
    ],
    alternatives: [
      { slot: 'passive', nameEn: "N'kuhana's Favor", assessment: '治疗偏向转化为攻速，常态恢复更受限；熟悉咏祷窗口前不选。默认解锁状态仍待游戏核验。', sourceIds: ['wiki-acolyte'] },
      { slot: 'secondary', nameEn: 'Soul Jar', assessment: '需要解锁的范围持续伤害分支；失去抽魂路线，不能照搬默认连段。', sourceIds: ['wiki-hc-skills'] },
      { slot: 'utility', nameEn: 'Javelin', assessment: '需要解锁，可作为远距位移分支；只在看清落点后再激活。', sourceIds: ['wiki-hc-skills'] },
      { slot: 'litany', nameEn: 'Dark Summons', assessment: '默认咏祷候选；变身时优先兑现恢复并清群，结束前找到安全位置。', sourceIds: ['wiki-hc-skills', 'wiki-acolyte'] },
      { slot: 'litany', nameEn: 'Anima Echo', assessment: '解锁后的近战回响分支，仍需主动维持攻击；不把理论持续咏祷写成无条件永续。', sourceIds: ['wiki-hc-skills', 'wiki-acolyte'] },
    ],
    buildLogic: [
      '推荐件数是编辑起步建议，不是实测最优解。先让进场、输出、退出成立，再考虑压低血量追求攻速。',
      '治疗进入储备后仍需命中兑现；低血时躲到没有目标的角落不等于能靠治疗立即恢复。',
      '特殊技能的 1000% 单击适合作为手环触发点；不要把多段总伤害当成一次命中的倍率。',
      '吸血和流血治疗值得研究，但新物品与特殊被动的交互尚未实测；优先保持移动和可命中的目标。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '先 2–3 件', '移动与攻击节奏', '追求更短的暴露窗口；不要为了连续攻击停在首领正面。'),
        pick('focus-crystal', 'recommended', '先 1–3 件', '近距伤害', '主攻与近战连段容易利用，远距阶段不强迫贴脸。'),
        pick('oddly-shaped-opal', 'core', '先 1 件', '第一次受击保护', '低血时恢复并非即时，先防止进场被一击打乱。'),
        pick('backup-magazine', 'recommended', '先 1 件', '抽魂技能储备', '可为下个目标保留一次副技能，不用等冷却再找切入点。'),
      ],
      uncommon: [
        pick('hopoo-feather', 'core', '先 1 件', '脱离地面威胁', '降低用完快击后的地形风险。'),
        pick('kjaro-band', 'recommended', '先 1 件', '高伤单击后续输出', '围绕特殊技能的高倍率命中安排爆发，不依赖普通多段凑阈值。'),
        pick('runald-band', 'recommended', '先 1 件', '高伤单击与减速', '和火手环分别补齐；没有可靠触发机会时优先移动。'),
        pick('harvesters-scythe', 'conditional', '已有暴击基础时 1 件', '治疗储备候选', '默认被动会改变治疗流向，不应认为暴击即刻补满生命。'),
      ],
      legendary: [
        pick('alien-head', 'recommended', '先 1 件', '减少技能空窗', '提高连段可用性，但不能保证无目标时仍能维持恢复。'),
        pick('dios-best-friend', 'recommended', '先 1 件', '近战失误保险', '对不熟悉变身结束时机的阶段，比继续压低生命更稳妥。'),
      ],
      boss: [pick('titanic-knurl', 'recommended', '先 1 件', '提高生命底盘', '回复仍受被动规则影响；防御价值来自更大的失误空间。')],
      equipment: [pick('royal-capacitor', 'recommended', '对空困难时携带', '补远程点杀', '不必为了碰到空中敌人用完全部位移。')],
    },
    coopAdjustments: [
      '说明自己不能靠普通治疗立刻回血；队友提供控制和安全目标，往往比催促立即进场更有帮助。',
      '特殊技能尾刀有资源收益，但不要求队友停止输出；团队安全优先于个人信念效率。',
      '让出多余清群物，优先补自己缺少的羽毛和移动。治疗物分配要考虑队友能否即时利用。',
      '不要在联机中未经沟通拾取改变首领强度的诅咒；低血恢复循环更怕突然提高战斗压力。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'oddly-shaped-opal', 'focus-crystal'], explanation: '先建立机动和首次受击保护，再补近战伤害；没有目标时不要靠低血换攻速。' },
      { phase: '中期', picks: ['hopoo-feather', 'backup-magazine', 'kjaro-band', 'runald-band'], explanation: '先能撤离，再围绕特殊技能建立手环爆发；副技能多一次充能是容错，不是必须用完。' },
      { phase: '后期', picks: ['alien-head', 'dios-best-friend', 'brilliant-behemoth'], explanation: '补技能周转、保险与清群。神圣奖励不计作统率必得；未核实获取规则前保留普通物品路线。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '先 1 件', '替换更艰难的时光', '保护近战进出场的空窗。'),
      pick('needletick', 'conditional', '没有流血治疗计划时再取', '替换三尖匕首', '若后续研究流血治疗联动，先保留原匕首；不要把崩溃当流血。'),
    ],
    lunarItems: [
      pick('shaped-glass', 'avoid', '基础路线不取', '生命减半换伤害', '恢复需要攻击窗口，低血失误更难挽回。'),
      pick('transcendence', 'avoid', '默认恢复路线不取', '改为护盾体系', '会改变当前生命与治疗逻辑；未验证整套护盾分支前不要拼接。'),
      pick('light-flux-pauldron', 'avoid', '基础路线不取', '冷却换攻速', '攻速影响快击及快速技能收益，不能只看冷却下降。'),
    ],
    lunarEquipment: [],
    hallowedItems: [
      pick('sanguine-chalice', 'conditional', '有流血来源时先 1 件', '治疗储备候选', '治疗仍进入角色被动逻辑；是否足以稳定续航需要实测，不能写为永生。'),
      pick('stained-scimitar', 'conditional', '实测交互后再定件数', '吸血与刀刃候选', '其刀刃要求治疗累计，侍僧的储备转换是否按普通治疗计数尚未确认。'),
      pick('nightmare-demon', 'conditional', '有机会时先 1 件', '单体战中的击杀效果候选', '需要技能蓄能后引爆，不能仅靠持有就认定击杀链持续生效。'),
    ],
    combatNotes: [
      { title: '传送器事件', body: '先找能连续命中的目标，抽魂再投刃，确认安全后突进。保留退出路径，不用剩余生命赌变身。' },
      { title: '首领处理', body: '围绕特殊技能与手环冷却安排爆发；变身用于输出和恢复窗口，结束前撤离首领脚下。' },
      { title: '飞行敌人', body: '先用抽魂与装备创造可命中机会；不要把全部快击用于追到无法安全落地的位置。' },
      { title: '最终阶段 / 米斯历克斯', body: '少杂兵时减少尾刀预期，留位移躲锤击。被夺物品后不要假设成型吸血仍在；业力机制单独验证。' },
    ],
    sourceIds: ['steam-hallowed-concepts', 'official-hc-release', 'official-hc-survivors-diary', 'wiki-acolyte', 'wiki-hc-skills'],
    releaseBlockers,
  },
]
