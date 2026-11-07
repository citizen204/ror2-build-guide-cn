import type {
  AlternativeSkill,
  ItemPick,
  SkillChoice,
  SkillSlot,
  SkillUnlock,
  SurvivorGuide,
  TransformationSkill,
} from '../../domain/guide'

const verifiedOn = '2026-11-07'

const skillIcon = (slug: string, nameEn: string) =>
  `assets/skills/${slug}/${nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.png`

function skill(slug: string, slot: SkillSlot, nameZh: string, nameEn: string, unlock: SkillUnlock, reason: string): SkillChoice {
  return { slot, nameZh, nameEn, icon: skillIcon(slug, nameEn), unlock, reason }
}

function alternative(
  slug: string,
  slot: AlternativeSkill['slot'],
  nameZh: string,
  nameEn: string,
  assessment: string,
  unlockCondition?: string,
): AlternativeSkill {
  return { slot, nameZh, nameEn, icon: skillIcon(slug, nameEn), assessment, ...(unlockCondition ? { unlockCondition } : {}) }
}

function transformation(slug: string, slot: SkillSlot, nameZh: string, nameEn: string, facts: string): TransformationSkill {
  return { slot, nameZh, nameEn, icon: skillIcon(slug, nameEn), facts }
}

const pick = (itemId: string, recommendation: ItemPick['recommendation'], stacks: string, role: string, synergy: string): ItemPick =>
  ({ itemId, recommendation, stacks, role, synergy })

const hallowedRoute = '神圣物品不能靠统率直接选：要在神圣神龛的生命之手净化诅咒，约 5 层诅咒起才有接近必出的神圣选项；启用统率时不出现选择界面，改为随机掉落。因此路线不依赖它们。'

/** Published with a visible untested label by maintainer decision on 2026-11-07. */
export const hcSurvivors: SurvivorGuide[] = [
  {
    slug: 'enforcer',
    nameZh: '执行者',
    nameEn: 'Enforcer',
    dlc: 'hc',
    portrait: 'assets/survivors/enforcer.png',
    playtestStatus: 'untested',
    role: '正面防御、近距多段命中与守点支援',
    difficulty: 3,
    summary: '默认解锁。以钢铁防护和集结据点建立安全射界，用护盾擒拿修正盾牌朝向；这些建议基于游戏文本与社区机制，尚未实测，不能把正面格挡当作全方向无敌。',
    skills: [
      skill('enforcer', 'passive', '大块头', 'Big Man', 'default', '高速落地造成范围伤害，社区记录下落速度超过 35 米每秒才触发；它不免除跌落伤害，别把跳崖当成常规输出。'),
      skill('enforcer', 'primary', '战壕扫帚', 'Trenchbroom', 'default', '普通状态单发 350%，防御姿态下每发 6×70%；弹匣有限，退出防御姿态会立即装满。先用同一套武器处理远近目标，避免开局依赖解锁。'),
      skill('enforcer', 'secondary', '钢铁防护', 'Steel Protection', 'default', '正面对敌举盾，再次激活时盾击并招架；招架可反弹 6 倍伤害，但盾牌不能上下瞄准，举盾时只有 32% 移速且不能奔跑。'),
      skill('enforcer', 'utility', '护盾擒拿', 'Shield Tackle', 'default', '自带两次充能，按住可合并用于长距离冲锋，前摇和冲锋期间能挡正面攻击。平时保留一次撤退，避免全部投入进场。'),
      skill('enforcer', 'special', '集结据点', 'Rally Point', 'default', '30 米信标持续 16 秒、冷却 24 秒：放置给 20% 屏障，区域内每次击杀再给 10%（按执行者最大生命）。适合传送器与团队聚集，但不能代替移动和治疗。'),
    ],
    alternativeSkills: [
      alternative('enforcer', 'primary', '破片手雷', 'Shrapnel Grenade', '普通 500%、防御姿态 3×300% 的范围清群分支；远程飞怪仍需装备或队友补位。', '执行者：燃烧铅弹——12 秒内射击岩浆蠕虫 24 次'),
      alternative('enforcer', 'secondary', '浪涌防护', 'Surge Protection', '格挡可得屏障，姿态结束时消耗全部护盾与屏障爆炸。社区记录伤害并不封顶在描述的 1800%；与需要持续护盾的物品冲突，暂不作为稳定默认。', '执行者：+招架——招架漫游者的超新星爆发'),
      alternative('enforcer', 'utility', '震爆拉索', 'Ripcord', '遥控爆炸可聚怪并嘲讽，空中引爆还会反推自身；先练习落点，不把嘲讽当作稳定吸住所有敌人。', '执行者：安然无恙——一场传送器事件中格挡 12 名敌人的攻击'),
      alternative('enforcer', 'special', '冲击据点', 'Crash Point', '落地 700%、冷却 7 秒，下落期间免跌落伤害，可研究手环爆发分支；社区记录落地伤害算作辅助技能。牺牲团队信标后必须重做守点方案。', '执行者：不屈意志——不格挡且完整承受一次石泰坦激光并存活'),
    ],
    buildLogic: [
      '以下选装与件数是编辑推导，尚未实测：优先普通移动速度、撤退工具与近距输出，再补多段命中的触发收益。',
      '举盾只有 32% 移速且不能奔跑；不要把奔跑物品当成举盾时持续生效的防御。保持敌人在同一侧比单纯堆伤害更重要。',
      '普通单发 350% 低于 400%，防御姿态每枚只有 70%；总和超过 400% 不表示任何一枚能触发手环，稳定触发要靠高倍率技能。',
      '信标给予的是临时屏障，不是护盾；不能仅凭信标就认定等离子虾能持续工作。',
      '菌丝帽可免疫跌落伤害，和大块头、冲击据点的落地玩法值得一试；是否同时触发尚未实测。',
      hallowedRoute,
    ],
    solo: {
      common: [
        pick('pauls-goat-hoof', 'core', '先 2–3 件', '提高常态移速，弥补举盾后的机动损失', '进入交叉火力时优先换位置，普通移速不需要先维持奔跑。'),
        pick('soldiers-syringe', 'recommended', '先 2–3 件', '同时加快射击节奏并缩短换弹时间', '攻速同时缩短换弹，先确认可以安全命中，再增加输出。'),
        pick('focus-crystal', 'recommended', '先 1–3 件', '放大举盾时的近距离多弹丸伤害', '举盾近距输出时容易利用；远射或必须拉开距离时降低优先级。'),
        pick('oddly-shaped-opal', 'recommended', '先 1 件', '减少换位空窗中吃到第一下的损失', '保护换位空窗，不能补救被包围后的持续受击。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'recommended', '先 1 件，再按单体缺口补', '补充对单体和对空的命中触发伤害', '多弹丸提供尝试触发的机会，但防御姿态弹丸的触发系数只有 0.7。'),
        pick('ukulele', 'recommended', '先 1 件', '在不贴身的情况下补足分散敌人的清群', '敌人分散时比强迫自己贴身更安全，也能配合近距多弹丸。'),
        pick('hopoo-feather', 'core', '先 1 件', '收盾后提供越障和脱离地面火力的路线', '收盾移动时保留越障路线，防御姿态的跳跃会换成短距突进，不能当普通跳跃。'),
      ],
      legendary: [
        pick('hardlight-afterburner', 'recommended', '先 1 件', '增加护盾擒拿充能，留出更多撤退余量', '充能留作撤退；更多进场距离本身不是安全收益。'),
        pick('57-leaf-clover', 'conditional', '已有触发组件时 1 件', '放大已有概率物品和多弹丸的触发收益', '尚未凑齐触发物时，先修复机动与清群短板。'),
      ],
      boss: [pick('titanic-knurl', 'recommended', '先 1 件', '提高生命与回复，同时抬高信标屏障量', '提高基础容错，也抬高信标屏障量；不需要为堆血牺牲关键移动。')],
      equipment: [pick('royal-capacitor', 'recommended', '对空不足时携带', '点杀绕过盾牌的飞行敌人和远程单位', '飞怪从侧面绕盾时优先处理，避免只盯地面近敌。')],
    },
    coopAdjustments: [
      '信标放在队友能安全进入的位置，先沟通聚集方向；盾牌朝向主威胁，让队友处理侧后方。',
      '信标只移动自身固定随从，不会搬来队友工程师的炮台。屏障发给区域内所有队友，队友的击杀也算。',
      '不要把屏障当治疗或护盾分配依据；治疗给受伤队友，移速和羽毛优先补足前排换位。',
      '诅咒可能改变全队传送器难度；接取前沟通，不为个人神圣奖励擅自加压。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['pauls-goat-hoof', 'oddly-shaped-opal', 'soldiers-syringe'], explanation: '建议先移动和容错，再改善射击。件数不是硬上限；地图不熟时继续补生存。' },
      { phase: '中期', picks: ['hopoo-feather', 'ukulele', 'atg-missile-mk-1', 'focus-crystal'], explanation: '先补越障与清群，再补单体触发和近距伤害；保持能收盾撤离。' },
      { phase: '后期', picks: ['hardlight-afterburner', '57-leaf-clover', 'dios-best-friend'], explanation: '为最终战预留机动和保险。启用统率时神圣神龛只会随机掉落，所以神圣物品不写进必得路线。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '先 1 件', '为收盾和换位的空窗挡下一次伤害', '用于收盾、换位的短暂空窗，不把格挡当站桩许可。'),
      pick('plasma-shrimp', 'conditional', '实际护盾稳定时 1 件', '在有稳定护盾时替代导弹提供命中伤害', '信标屏障不满足护盾条件；采用会消耗护盾的浪涌防护时降低优先级。'),
    ],
    lunarItems: [
      pick('shaped-glass', 'avoid', '基础路线不取', '牺牲一半生命换取成倍的基础伤害', '盾牌覆盖有方向限制，侧面失误成本过高。'),
      pick('gesture-of-the-drowned', 'conditional', '装备无需保留时 1 件', '让主动装备自动循环，换取持续输出', '需要点杀飞怪或留给首领时，手动释放更可控。'),
    ],
    lunarEquipment: [],
    hallowedItems: [
      pick('corpse-lily', 'conditional', '有机会时先 1 件', '在传送器和信标区域内持续清理杂兵', '社区记录集结据点会激活自身守点类物品，尸骸百合在此列，可围绕信标清群；范围随充能扩大，不能替代对空。'),
      pick('vile-censer', 'conditional', '有机会时先 1 件', '把眩晕目标变成向周围扩散的连锁伤害', '盾击与冲撞的眩晕接技能命中可引发连锁；社区记录免疫眩晕的目标按缺失生命另算概率，暂不作为唯一单体来源。'),
      pick('ritual-helmet', 'conditional', '机动分支再考虑', '只在奔跑路线中提供移速和颅骨伤害', '防御姿态不能奔跑，持续举盾方案优先其他掉落。'),
    ],
    combatNotes: [
      { title: '传送器事件', body: '先清侧后方，再在队友可进入的位置放信标；被包围就收盾转移，不用屏障硬换整片伤害。' },
      { title: '首领处理', body: '正面对盾、侧向留路，看准投射物招架。默认多弹丸不等于手环触发器；切爆发分支后再重新选择手环。' },
      { title: '飞行敌人', body: '盾牌不能上下瞄准，空中目标用普通状态远射和装备优先点杀；不为追一个飞怪把背部露给整群敌人。' },
      { title: '最终阶段 / 米斯历克斯', body: '少杂兵阶段不要依赖击杀屏障续航。预留冲锋躲锤击与交叉攻击；业力开启后的额外机制需另行验证。' },
    ],
    sourceIds: ['steam-hallowed-concepts', 'official-hc-release', 'official-hc-hotfix', 'game-language-files', 'wiki-enforcer', 'wiki-challenges-data', 'wiki-hallowed-shrine'],
    verifiedOn,
  },
  {
    slug: 'acolyte',
    nameZh: '侍僧',
    nameEn: 'Acolyte',
    dlc: 'hc',
    portrait: 'assets/survivors/acolyte.png',
    playtestStatus: 'untested',
    role: '近战连段、可恢复生命与化身爆发',
    difficulty: 5,
    summary: '需完成挑战“破碎的仪式”解锁：在灵魂绑定界碑击败灵魂收割者后，把一件治疗或食物类物品交给倒地的侍僧。她通过技能命中兑现可恢复生命，以特殊技能建立诵祷窗口；普通治疗不能即时救命。',
    skills: [
      skill('acolyte', 'passive', '恩库哈娜的恩典', "N'kuhana's Grace", 'default', '治疗与 40% 所受伤害进入可恢复生命，技能命中再兑现；储备越多攻速越高。基础路线优先保留这条恢复渠道。'),
      skill('acolyte', 'primary', '刃切', 'Blade Slice', 'default', '斩击 150%，按住主技能时跳跃或奔跑触发迅捷突刺 200%，最多 3 次。保留一两次突刺处理进出场，不把全部资源用在追击。'),
      skill('acolyte', 'secondary', '流星索投掷', 'Bola Throw', 'default', '聚集最多 5 名敌人并榨取灵魂，打灵魂的伤害会传给本体。首领不会被拉动，但灵魂照样被拉出，适合在安全距离输出。'),
      skill('acolyte', 'utility', '月刃投掷', 'Blade Sling', 'default', '先投刃再决定是否突进。文本标注眩晕，但社区页未记录稳定眩晕，暂不依赖它保证控制。'),
      skill('acolyte', 'special', '牺牲', 'Sacrifice', 'default', '1000% 单击，命中得 2 层信念，击杀多 1 层，7 层开启诵祷，信念可跨关保留。把它留给关键目标或可靠尾刀。'),
    ],
    alternativeSkills: [
      alternative('acolyte', 'passive', '恩库哈娜的眷顾', "N'kuhana's Favor", '治疗只转化为攻速，不再有可恢复生命；社区记录隐藏 +20 护甲。熟悉诵祷窗口前不选。'),
      alternative('acolyte', 'secondary', '灵魂瓮', 'Soul Jar', '范围持续伤害分支，死亡时释放追踪怨灵；失去抽魂路线，不能照搬默认连段。', '侍僧：血色盛宴——单次化身灵魂收割者期间击杀 15 名敌人'),
      alternative('acolyte', 'utility', '月刃标枪', 'Javelin', '穿透 400%、撞大型敌人或地形再爆炸 400%，可作远距位移；只在看清落点后再激活。', '侍僧：远远不够——使利莫里亚长者滞空 11 秒'),
      alternative('acolyte', 'utility', '利刃突袭', 'Blade Dash', '月刃投掷和月刃标枪再次激活时的突进，不占技能栏。游戏文本同时写有 300% 与 400%，具体数值待实测。'),
      alternative('acolyte', 'litany', '黑暗召唤', 'Dark Summons', '默认诵祷：化身灵魂收割者。社区记录化身期间生命不会低于 1；优先兑现恢复并清群，结束后回到原形态并重置冷却。'),
      alternative('acolyte', 'litany', '灵魂回响', 'Anima Echo', '近战额外命中一次且不改变属性，仍可使用牺牲续层；不把理论持续诵祷写成无条件永续。', '侍僧：猎杀名单——一局内用牺牲击杀 20 种怪物'),
    ],
    transformationSkills: [
      transformation('acolyte', 'primary', '狂暴斩击', 'Torrential Slash', '发射能量波 300%；生命低于 25% 的敌人被一击毙命。'),
      transformation('acolyte', 'secondary', '折磨锁链', 'Harrowing Chains', '最多 5 条追踪锁链 250%，拉回撞击再 250%；首领不会被拉动。'),
      transformation('acolyte', 'utility', '灵魂风暴', 'Soul Storm', '风暴每秒 300%，再次激活强化为每秒 1200%。'),
      transformation('acolyte', 'special', '放逐', 'Banish', '提前结束化身，眩晕周围敌人并重置技能冷却。'),
    ],
    buildLogic: [
      '推荐件数是编辑起步建议，尚未实测。先让进场、输出、退出成立，再考虑压低血量追求攻速。',
      '社区记录技能伤害按 6.5%×触发系数兑现储备，每 1% 储备加 1% 攻速，并每秒衰减 1%。躲到没有目标的角落不等于能靠治疗恢复。',
      '牺牲的 1000% 单击适合作为手环触发点；不要把多段总伤害当成一次命中的倍率。',
      '吸血和流血治疗值得研究，但新物品与特殊被动的交互尚未实测；优先保持移动和可命中的目标。',
      '凝神水晶等条件增伤按实际命中的目标判断；打灵魂时若本体不满足条件，传过去的伤害不享受加成。击杀灵魂本身不触发击杀效果。',
      hallowedRoute,
    ],
    solo: {
      common: [
        pick('mocha', 'core', '先 2–3 件', '同时提高移速和攻速，缩短暴露窗口', '追求更短的暴露窗口；不要为了连续攻击停在首领正面。'),
        pick('focus-crystal', 'recommended', '先 1–3 件', '放大贴身斩击和突刺的近距离伤害', '主攻与近战连段容易利用，远距阶段不强迫贴脸。'),
        pick('oddly-shaped-opal', 'core', '先 1 件', '进场前挡住第一下，弥补恢复不即时', '低血时恢复并非即时，先防止进场被一击打乱。'),
        pick('backup-magazine', 'recommended', '先 1 件', '多一次流星索，方便连续抽出多个灵魂', '可为下个目标保留一次副技能，不用等冷却再找切入点。'),
      ],
      uncommon: [
        pick('hopoo-feather', 'core', '先 1 件', '突刺用完后仍能脱离地面威胁和地形', '降低用完突刺后的地形风险，也方便追到高处的目标。'),
        pick('kjaro-band', 'recommended', '先 1 件', '让牺牲的高倍率单击接上火焰爆发', '围绕牺牲的高倍率命中安排爆发，不依赖普通多段凑阈值。'),
        pick('runald-band', 'recommended', '先 1 件', '让牺牲的高倍率单击接上冰冻减速', '和火手环分别补齐；没有可靠触发机会时优先移动。'),
        pick('harvesters-scythe', 'conditional', '已有暴击基础时 1 件', '暴击治疗进入储备，补充可兑现的生命', '默认被动会改变治疗流向，不应认为暴击即刻补满生命。'),
      ],
      legendary: [
        pick('alien-head', 'recommended', '先 1 件', '缩短牺牲和位移冷却，减少技能空窗', '提高连段可用性，但不能保证无目标时仍能维持恢复。'),
        pick('dios-best-friend', 'recommended', '先 1 件', '为近战失误和化身结束时机提供保险', '对不熟悉化身结束时机的阶段，比继续压低生命更稳妥。'),
      ],
      boss: [pick('titanic-knurl', 'recommended', '先 1 件', '提高生命上限，换取更大的失误空间', '回复仍受被动规则影响；防御价值来自更大的失误空间。')],
      equipment: [pick('royal-capacitor', 'recommended', '对空困难时携带', '远程点杀近战碰不到的飞行敌人', '不必为了碰到空中敌人用完全部位移。')],
    },
    coopAdjustments: [
      '说明自己不能靠普通治疗立刻回血；队友提供控制和安全目标，往往比催促立即进场更有帮助。',
      '牺牲尾刀有资源收益，但不要求队友停止输出：目标在落刀前被别人击杀仍有 2 层信念。',
      '让出多余清群物，优先补自己缺少的羽毛和移动。治疗物分配要考虑队友能否即时利用。',
      '不要在联机中未经沟通拾取改变首领强度的诅咒；低血恢复循环更怕突然提高战斗压力。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'oddly-shaped-opal', 'focus-crystal'], explanation: '先建立机动和首次受击保护，再补近战伤害；没有目标时不要靠低血换攻速。' },
      { phase: '中期', picks: ['hopoo-feather', 'backup-magazine', 'kjaro-band', 'runald-band'], explanation: '先能撤离，再围绕牺牲建立手环爆发；副技能多一次充能是容错，不是必须用完。' },
      { phase: '后期', picks: ['alien-head', 'dios-best-friend', 'brilliant-behemoth'], explanation: '补技能周转、保险与清群。启用统率时神圣神龛只会随机掉落，因此保留普通物品路线。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '先 1 件', '为近战进出场的空窗挡下一次伤害', '保护近战进出场的空窗，恢复不即时时尤其有用。'),
      pick('needletick', 'conditional', '没有流血治疗计划时再取', '用崩溃替代流血，换取更稳定的持续伤害', '若后续研究流血治疗联动，先保留原匕首；不要把崩溃当流血。'),
    ],
    lunarItems: [
      pick('shaped-glass', 'avoid', '基础路线不取', '牺牲一半生命换取成倍的基础伤害', '恢复需要攻击窗口，低血失误更难挽回。'),
      pick('transcendence', 'avoid', '默认恢复路线不取', '把生命转为护盾，改变整套恢复体系', '会改变当前生命与治疗逻辑；未验证整套护盾分支前不要拼接。'),
      pick('light-flux-pauldron', 'avoid', '基础路线不取', '以降低攻速为代价换取更短的技能冷却', '攻速影响突刺及快速技能收益，不能只看冷却下降。'),
    ],
    lunarEquipment: [],
    hallowedItems: [
      pick('sanguine-chalice', 'conditional', '有流血来源时先 1 件', '把自身流血伤害转化为大量治疗储备', '社区记录每跳治疗按目标身上的流血层数相乘，来量可观；治疗仍进入被动逻辑，不能写为永生。'),
      pick('stained-scimitar', 'conditional', '实测交互后再定件数', '提供吸血，并按治疗累计生成环绕刀刃', '其刀刃要求治疗累计，侍僧的储备转换是否按普通治疗计数尚未确认。'),
      pick('nightmare-demon', 'conditional', '有机会时先 1 件', '在首领战中通过引爆恶魔触发击杀效果', '只有技能伤害能附着和蓄能，800% 起可半伤引爆；持有本身不会让击杀链持续生效。'),
    ],
    combatNotes: [
      { title: '传送器事件', body: '先找能连续命中的目标，抽魂再投刃，确认安全后突进。保留退出路径，不用剩余生命赌化身。' },
      { title: '首领处理', body: '围绕牺牲与手环冷却安排爆发；首领不会被拉动，但可同时打灵魂与本体。化身用于输出和恢复窗口，结束前撤离首领脚下。' },
      { title: '飞行敌人', body: '先用抽魂与装备创造可命中机会；不要把全部突刺用于追到无法安全落地的位置。' },
      { title: '最终阶段 / 米斯历克斯', body: '少杂兵时减少尾刀预期，留位移躲锤击。被夺物品后不要假设成型吸血仍在；业力机制单独验证。' },
    ],
    sourceIds: ['steam-hallowed-concepts', 'official-hc-release', 'game-language-files', 'wiki-acolyte', 'wiki-a-broken-ritual', 'wiki-challenges-data', 'wiki-hallowed-shrine'],
    verifiedOn,
  },
]
