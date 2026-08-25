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

export const sotsSurvivors: SurvivorGuide[] = [
  {
    slug: 'seeker',
    nameZh: '探寻者',
    nameEn: 'Seeker',
    dlc: 'sots',
    portrait: 'assets/survivors/seeker.png',
    role: '近中距连段、屏障治疗与团队复活支援',
    difficulty: 3,
    summary: '通过特殊技能累积七层宁静，强化整套技能，并以冥想提供群体治疗和联机复活；推荐缓刑屏障路线兼顾机动与容错。',
    skills: [
      skill('seeker', 'passive', '内在力量', 'Inner Strength', 'default', '成功使用特殊技能累积最多七层宁静，并强化所有技能。'),
      skill('seeker', 'primary', '灵拳', 'Spirit Punch', 'default', '唯一主攻，三段穿透拳的第三击爆炸，完整连段收益最高。'),
      skill('seeker', 'secondary', '灵魂螺旋', 'Soul Spiral', 'unlock-required', '多次命中提供屏障，满球激励，稳定贴身能力优于远程替代。'),
      skill('seeker', 'utility', '缓刑', 'Reprieve', 'unlock-required', '先获屏障，飞行后生成治疗伤害旋风，比耗血远行更稳。'),
      skill('seeker', 'special', '冥想', 'Meditate', 'default', '稳定叠层并群疗；满层后可在联机复活队友。'),
    ],
    buildLogic: [
      '先在明确安全窗口完成冥想的节奏输入，逐步升到七层宁静；联机复活是救场能力，不应成为队友故意倒地的计划。',
      '灵拳尽量打满三段，让第三击爆炸和层数强化完整兑现；灵魂螺旋负责贴身多命中和屏障。',
      '缓刑立即给约最大生命比例屏障，耗尽或碰撞后生成旋风；穿过怪群后应落到安全侧，而不是停在中心。',
      '支援红装提高团队恢复，但不能只有治疗没有终局伤害；构筑中仍需凝神水晶、触发链、移动和复活保险。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '同步提高灵拳连段攻速与贴身移动能力', '完整连段更流畅，缓刑落地后的重新走位也更安全。'),
        pick('focus-crystal', 'core', '2–4 件', '放大灵拳与灵魂螺旋的近距离伤害', '推荐技能组大部分伤害在贴身范围，能稳定兑现该乘区。'),
        pick('backup-magazine', 'recommended', '2–3 件', '增加灵魂螺旋储备并维持屏障覆盖', '更多灵魂螺旋可轮换进场屏障，也提高单体多命中频率。'),
      ],
      uncommon: [
        pick('rose-buckler', 'recommended', '1–3 件', '移动和冲刺期间提供额外护甲保护前排', '缓刑穿群与持续绕圈能较稳定地维持防御条件。'),
        pick('atg-missile-mk-1', 'recommended', '1–2 件', '把灵拳和灵魂螺旋的多次命中转成额外导弹伤害', '补足支援构筑的单体输出，避免终局只剩治疗没有击杀力。'),
        pick('infusion', 'recommended', '1 件', '提高最大生命并放大屏障与治疗底盘', '缓刑屏障和恢复更稳，但队伍中虚假子嗣可能有更高优先级。'),
      ],
      legendary: [
        pick('rejuvenation-rack', 'core', '1 件', '倍增冥想与旋风的团队治疗量', '直接强化支援身份，联机价值尤其高，但与 REX 需要协调。'),
        pick('aegis', 'recommended', '过量治疗稳定后 1 件', '把过量治疗转成额外屏障维持前排', '与冥想、旋风和回春支架形成治疗转屏障闭环。'),
      ],
      boss: [
        pick('titanic-knurl', 'recommended', '1 件起', '增加最大生命和回复以提高前排底盘', '生命上限同步改善缓刑屏障和多种按最大生命恢复。'),
        pick('mired-urn', 'conditional', '近战需要时 1 件', '只牵引敌人并提供焦油减速、伤害与吸血', '当前不会吸队友；探寻者已有群疗，可让更需要的近战前排先拿。'),
      ],
      equipment: [
        pick('gorags-opus', 'core', '团队爆发携带', '提供全队攻击速度与移动速度爆发窗口', '在首领硬直或传送器高压时开，全队都能利用而非个人赶路。'),
        pick('royal-capacitor', 'recommended', '需要远程点杀时携带', '补足推荐贴身技能组的远程精英处理能力', '不必为飞行或远处目标离开团队治疗范围。'),
      ],
    },
    coopAdjustments: [
      '冥想与旋风承担公共治疗和满层复活，回春支架、庇护与 REX 等治疗角色先协商。',
      '古拉格的杰作只在全队爆发窗使用；满层复活前先清威胁，不在致命区硬读条。',
      '泥沼之瓮当前只吸敌人；探寻者已有自疗，可把它和稀缺个人治疗让给更缺维持的前排。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'focus-crystal', 'backup-magazine', 'oddly-shaped-opal', 'topaz-brooch'], explanation: '先建立灵拳连段手感、近战乘区和灵魂螺旋库存，再补第一下防护与击杀屏障。' },
      { phase: '中期', picks: ['hopoo-feather', 'rose-buckler', 'atg-missile-mk-1', 'infusion'], explanation: '额外跳跃和冲刺护甲保护支援站位，导弹与生命补足伤害和屏障底盘。' },
      { phase: '后期', picks: ['rejuvenation-rack', 'aegis', 'alien-head', 'dios-best-friend'], explanation: '团队治疗先成型，再按过量治疗或技能频率选择红装，并保留复活保险。' },
    ],
    voidItems: [
      pick('lysate-cell', 'recommended', '支援路线 1 件', '腐化燃料电池，增加冥想特殊充能', '更多冥想可补层和救场；若古拉格的杰作是装备核心则保留燃料电池。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供可预测冷却格挡', '与缓刑的主动屏障交替覆盖，保护贴身和冥想空窗。'),
      pick('polylute', 'conditional', '队伍有范围伤害时 1 件', '腐化尤克里里，把群体连锁换成单体雷击', '灵魂螺旋与灵拳多命中能补首领伤害，缺清群则保留原件。'),
      pick('benthic-bloom', 'avoid', '不建议支援构筑拾取', '腐化57片叶子的三叶草并随机升级普通物品', '支援路线需要保留指定治疗、移动和库存件，不接受随机打散。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'conditional', '古拉格的杰作闭环 1 件', '自动释放团队装备并缩短装备冷却', '能持续提供增益，但会失去等待全队首领窗口的时机。'),
      pick('corpsebloom', 'conditional', '低爆发压力时 1 件', '提高总治疗但限制单位时间的恢复速度', '持续恢复可用，团队遭遇爆发伤害时可能因释放过慢而救不回来。'),
      pick('transcendence', 'avoid', '不建议支援身份拾取', '把生命转护盾并让常规治疗对自身失效', '会降低冥想和旋风的自身价值，与治疗支援身份不协调。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '安全累积冥想层数，灵魂螺旋开启屏障，灵拳连段穿群，缓刑穿出并留下旋风。',
      '高宁静层数后维持灵拳和灵魂螺旋；危险招式用缓刑，不用冥想硬读条。',
      '灵拳穿透和第三击爆炸处理，电容器点精英；不为贴身技能跳出安全落点。',
      '缓刑屏障越墙，冥想只放安全窗；联机倒地时先清威胁再完成救援。',
    ),
    sourceIds: ['wiki-seeker', 'wiki-proc-coefficient', 'wiki-items', 'wiki-mired-urn'],
    verifiedOn,
  },
  {
    slug: 'chef',
    nameZh: '大厨',
    nameEn: 'CHEF',
    dlc: 'sots',
    portrait: 'assets/survivors/chef.png',
    role: '油火连段、技能标记与团队餐点治疗',
    difficulty: 3,
    summary: '用不同伤害技能给敌人留下烹饪标记，击杀后生成团队治疗餐点；风暴探寻者 2.0 版本当前最稳强度来自上釉铺油接灼烧四倍点燃。',
    skills: [
      skill('chef', 'passive', '大厨之吻', "CHEF's Kiss", 'default', '至少两种不同伤害技能标记后击杀，会掉落按拾取者最大生命治疗的食物。'),
      skill('chef', 'primary', '切丁', 'Dice', 'default', '三层飞刀飞出与回收都可命中，按住延迟回收提高回程伤害。'),
      skill('chef', 'secondary', '灼烧', 'Sear', 'default', '当前最强稳定副技能；攻击油污目标时产生四倍点燃。'),
      skill('chef', 'utility', '翻滚', 'Roll', 'default', '充能移动、200 护甲并可超级跳，期间仍可使用其他技能。'),
      skill('chef', 'special', '上釉', 'Glaze', 'default', '七次 250% 命中并施加油污与虚弱，直接为灼烧铺好连段。'),
    ],
    buildLogic: [
      '当前核验配置是切丁、灼烧、翻滚、上釉，四项都是默认解锁；替代副技能准确名为冰箱，挑战解锁，游戏不存在名为“冷冻机”的可选技能。',
      '上釉先施加油污和虚弱，后续灼烧的点燃获四倍燃烧；若改冰箱，油污会让冰霜直接冻结。',
      '切丁飞出和回收都能命中，配另一种伤害技能完成大厨之吻标记，再由任意收尾生成团队治疗餐点。',
      '翻滚中可使用其他技能并获得高护甲，跳出能超级跳；天蚀仍有坠落伤害，必须提前选好落点而非盲目升空。',
    ],
    solo: {
      common: [
        pick('backup-magazine', 'core', '2–4 件', '增加灼烧库存并提高油火连段次数', '上釉铺油后能连续引燃，替代冰箱配置也同样获得储备。'),
        pick('mocha', 'core', '3–5 件', '同步改善切丁攻速、回收手感与移动', '翻滚空窗和近中距连段都更安全，是前期双属性核心。'),
        pick('gasoline', 'recommended', '1–3 件', '把餐点击杀和点燃扩展成群体燃烧', '与灼烧和点火罐共用火焰体系，第一件即可改善清群。'),
      ],
      uncommon: [
        pick('ignition-tank', 'core', '灼烧路线 1–3 件', '大幅放大油污目标的四倍点燃伤害', '角色推荐连段天然持续点燃，比泛用绿色触发更直接。'),
        pick('atg-missile-mk-1', 'recommended', '1–2 件', '把切丁与上釉多命中转成额外导弹伤害', '补充首领单体并帮助完成双技能标记后的最终击杀。'),
        pick('death-mark', 'recommended', '减益齐全时 1 件', '利用油污的虚弱、减速和燃烧触发增伤', '角色自带多类减益，队伍补齐四种后能稳定激活独立乘区。'),
      ],
      legendary: [
        pick('brilliant-behemoth', 'core', '1 件', '为多段技能附加范围爆炸并补足清群', '切丁、上釉与灼烧都会把爆炸送入标记怪群，稳定提高收尾。'),
        pick('rejuvenation-rack', 'recommended', '支援路线 1 件', '放大餐点和自身所有治疗效果', '大厨之吻为全队产餐，联机收益明显但需与探寻者协调。'),
      ],
      boss: [
        pick('molten-perforator', 'core', '1 件起', '继续扩大整套火焰连段与强击伤害', '上釉接灼烧的高频火焰体系与钻机触发方向一致。'),
        pick('mired-urn', 'conditional', '近战需要时 1 件', '只牵引敌人并提供焦油减速、伤害和吸血', '当前不会吸队友，能支持近距离灼烧连段并补湮灭标记。'),
      ],
      equipment: [
        pick('royal-capacitor', 'recommended', '通用携带 1 件', '补足切丁之外的远程精英点杀能力', '先完成双技能标记再用装备收尾，仍可触发餐点掉落。'),
        pick('gorags-opus', 'conditional', '团队爆发携带', '提供攻击与移动速度以压缩整套连段', '在全队首领窗口开启，不与个人翻滚赶路混用。'),
      ],
    },
    coopAdjustments: [
      '大厨能给全队产餐；标记过的小怪由自己完成第二技能击杀更稳定，但不要要求队友停火拖时间。',
      '点火罐优先给灼烧或其他火焰主核；回春支架与探寻者等治疗角色先协商。',
      '油污的虚弱是团队减伤，古拉格的杰作在全队爆发窗使用；泥沼之瓮当前只牵引敌人。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'backup-magazine', 'gasoline', 'oddly-shaped-opal'], explanation: '两件摩卡、两层灼烧库存、一层汽油和蛋白石，让标记产餐与安全连段先成立。' },
      { phase: '中期', picks: ['ignition-tank', 'atg-missile-mk-1', 'ukulele', 'hopoo-feather', 'death-mark'], explanation: '点火罐强化上釉接灼烧，触发链、羽毛和湮灭标记补齐输出与生存。' },
      { phase: '后期', picks: ['brilliant-behemoth', 'alien-head', 'rejuvenation-rack', 'dios-best-friend'], explanation: '完美巨兽或外星脑袋先提高终局持续伤害，再按支援需求取治疗红与复活。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '已有火焰清群时 1 件', '腐化尤克里里，把群体连锁换成单体雷击', '切丁与上釉多命中能频繁触发，汽油和灼烧已负责范围伤害。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供可预测冷却格挡', '与翻滚的高护甲进出轮换，保护连段中没有位移的窗口。'),
      pick('needletick', 'conditional', '湮灭标记不缺流血时 1 件', '腐化三尖匕首，把流血改成坍缩爆发', '多段上釉和切丁能快速叠层；需要流血凑减益时保留原件。'),
      pick('plasma-shrimp', 'avoid', '不建议近距连段拾取', '腐化空对地导弹1号，以护盾换每击导弹', '近距离灼烧连段常被擦伤掉盾，可靠性低于普通空对地导弹1号。'),
    ],
    lunarItems: [
      pick('light-flux-pauldron', 'conditional', '技能连段流 1 件', '大幅缩短上釉、灼烧与翻滚冷却', '代价是切丁攻速下降，技能主导路线仍可接受并重新适应回收。'),
      pick('corpsebloom', 'conditional', '持续恢复场景 1 件', '放大餐点总治疗但延迟分批释放恢复', '团队爆发受伤时可能回得太慢，不能把它当无条件治疗提升。'),
      pick('visions-of-heresy', 'avoid', '除完整转化外不拿', '替换切丁并破坏飞刀回收与主技能标记节奏', '单件会削弱大厨之吻的技能组合，只有完整转异端才合理。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '切丁标记，上釉铺油和施加虚弱，灼烧引燃，翻滚穿出并收飞刀，再安全拾取或留餐。',
      '上釉打满后灼烧造成四倍点燃，切丁回程；翻滚留给大招而非纯伤害。',
      '切丁飞回双命中，上釉或电容器点杀；翻滚超级跳后提前处理坠落。',
      '翻滚护甲和超级跳跨旋转墙；油火连段只在首领停顿窗完成，不追餐进危险区。',
    ),
    sourceIds: ['wiki-chef', 'wiki-chef-skills', 'wiki-proc-coefficient', 'wiki-items', 'wiki-mired-urn'],
    verifiedOn,
  },
  {
    slug: 'false-son',
    nameZh: '虚假子嗣',
    nameEn: 'False Son',
    dlc: 'sots',
    portrait: 'assets/survivors/false-son.png',
    role: '成长生命强化、尖刺资源与近中距爆发',
    difficulty: 4,
    summary: '额外最大生命产生成长，增强技能充能与持续时间；月球尖刺层数在未用时提供攻速护甲、用掉后提供移速回复，需要在防守和追击间切换。',
    skills: [
      skill('false-son', 'passive', '月球干预', 'Lunar Tampering', 'default', '未用尖刺层提供攻速护甲，已用层提供移速与生命回复。'),
      skill('false-son', 'primary', '遗弃者之棒', 'Club of the Forsaken', 'default', '唯一主攻，蓄力重砸适合聚怪与硬直窗口。'),
      skill('false-son', 'secondary', '月球尖刺', 'Lunar Spikes', 'default', '具有敏捷特性且库存多，稳定保留被动层，比双计数月球尖桩更易管理。'),
      skill('false-son', 'utility', '子午线之意', "Meridian's Will", 'unlock-required', '瞬移聚怪并短时三倍被动，成长还能延长该窗口。'),
      skill('false-son', 'special', '激光爆发', 'Laser Burst', 'unlock-required', '1250% 瞬发并回填 50% 尖刺，成长还增加库存。'),
    ],
    buildLogic: [
      '只有额外最大生命值贡献成长；浸剂和巨型隆起同时提高肉度与技能，护盾不计入该机制。',
      '留满月球尖刺获得攻速和护甲，进攻时先用子午线之意三倍被动，再花尖刺并使用激光爆发，最后由激光爆发回填。',
      '遗弃者之棒蓄力必须放在聚怪、眩晕或首领硬直窗，不能在远程齐射中站桩；手里剑用于填补近战空窗。',
      '超绝会把除一点外的生命转成护盾并完全移除成长，是明确禁忌；任何护盾流都不能替代最大生命成长。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '同步改善遗弃者之棒蓄力手感和基础移动', '与尖刺未用层攻速叠加，撤离时也能利用已用层的移速。'),
        pick('focus-crystal', 'core', '3–5 件', '放大遗弃者之棒与聚怪后的近距离重击伤害', '推荐循环在子午线之意聚怪后贴身砸击，能稳定兑现近战乘区。'),
        pick('cautious-slug', 'recommended', '1–2 件', '提供高生命角色稳定的脱战回复底盘', '尖刺回复与回春支架成型前，先保证不战斗时回到安全线。'),
      ],
      uncommon: [
        pick('infusion', 'core', '1–3 件', '增加最大生命并直接转化为成长强度', '既提高承压又增加技能库存和持续，是角色最具特化的绿色件。'),
        pick('shuriken', 'recommended', '1–3 件', '为遗弃者之棒攻击空窗补充远程伤害与触发', '近战无法安全蓄力时仍能攻击飞行或远处目标。'),
        pick('rose-buckler', 'recommended', '1–3 件', '冲刺与位移期间增加护甲保护高生命前排', '与子午线之意进出和已用尖刺的移速阶段配合，减少擦伤。'),
      ],
      legendary: [
        pick('alien-head', 'core', '1 件', '缩短技能冷却并提高尖刺、激光爆发循环频率', '成长增强库存后再降低冷却，整套资源时间轴更顺畅。'),
        pick('rejuvenation-rack', 'recommended', '1 件', '放大高生命底盘和已用尖刺的生命回复', '不是成长来源，但能在花掉护甲层后更快恢复安全线。'),
      ],
      boss: [
        pick('titanic-knurl', 'core', '1 件起', '增加最大生命并直接提供更多成长', '同时提高技能与生存，是最明确的角色特化首领物品。'),
        pick('mired-urn', 'recommended', '近战 1 件', '只牵引敌人并提供焦油减速、伤害与自疗', '当前不会牵引队友，能把怪留在遗弃者之棒重砸范围并维持前排。'),
      ],
      equipment: [
        pick('gorags-opus', 'recommended', '团队窗口携带', '提高攻击与移动速度，压缩遗弃者之棒蓄力风险', '与未用尖刺的攻速和子午线之意三倍被动叠加，形成爆发窗。'),
        pick('royal-capacitor', 'recommended', '远程补点携带', '补足对飞行精英和远处威胁的精准伤害', '不必为了远程目标花空尖刺或冒险蓄力遗弃者之棒。'),
      ],
    },
    coopAdjustments: [
      '虚假子嗣是浸剂与巨型隆起的高优先候选，但 REX、探寻者也需要，按谁承担前排协商。',
      '子午线之意聚怪后让队友范围伤害对齐，不把目标拖出范围；泥沼之瓮当前只会牵引敌人。',
      '把高频触发物品让给持续射手，古拉格的杰作开启全队窗口，自己专注最大生命、近战乘区和冷却。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'focus-crystal', 'oddly-shaped-opal', 'cautious-slug'], explanation: '先做基础攻速移动、近战乘区、第一下保护和脱战恢复，保留尖刺层提供护甲。' },
      { phase: '中期', picks: ['infusion', 'shuriken', 'hopoo-feather', 'rose-buckler'], explanation: '两层浸剂建立成长，再用手里剑、羽毛和圆盾补空窗与前排机动。' },
      { phase: '后期', picks: ['alien-head', 'brilliant-behemoth', 'rejuvenation-rack', 'dios-best-friend'], explanation: '冷却与范围伤害先补终局持续伤害，随后用治疗和复活保护高生命底盘。' },
    ],
    voidItems: [
      pick('lysate-cell', 'recommended', '1 件', '腐化燃料电池，增加激光爆发特殊充能', '额外激光爆发能快速回填尖刺；依赖团队装备时应保留燃料电池。'),
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供可预测冷却格挡', '遗弃者之棒蓄力和子午线之意空窗可计划保护，且护盾不被误当成成长。'),
      pick('voidsent-flame', 'conditional', '1 件起', '腐化鬼火，改为满血目标爆炸', '遗弃者之棒和激光爆发的高倍率首击能同步触发，补充聚怪后的清场。'),
      pick('plasma-shrimp', 'avoid', '不建议近战成长路线', '腐化空对地导弹1号，以护盾换每击导弹', '近战频繁掉盾会停用，而且护盾本身完全不贡献成长。'),
    ],
    lunarItems: [
      pick('light-flux-pauldron', 'conditional', '激光爆发技能流 1 件', '缩短技能冷却但降低遗弃者之棒与被动攻速', '偏特殊和位移技能时可接受，依赖遗弃者之棒连打的路线不适合。'),
      pick('shaped-glass', 'conditional', '高熟练 1 件', '倍增伤害但减半最大生命与生存底盘', '一击线提高，却会削弱高生命路线容错，必须已有保险。'),
      pick('transcendence', 'avoid', '强烈避免', '把除一点外的生命转成护盾并使治疗失效', '护盾不计入成长，因此会完全移除成长，并破坏已用尖刺的回复。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '留满尖刺入场，子午线之意聚怪和三倍被动，遗弃者之棒重砸后花尖刺，再用激光爆发回填。',
      '侧面蓄力遗弃者之棒，激光爆发穿透；危险期保留尖刺护甲而不是全部打空。',
      '用尖刺和激光爆发处理，子午线之意瞄准目标时确保传送落点安全。',
      '子午线之意穿过锤击线，遗弃者之棒只放硬直窗；夺取物品阶段靠高生命和尖刺被动慢打。',
    ),
    sourceIds: ['wiki-false-son', 'wiki-false-son-growth', 'wiki-transcendence', 'wiki-proc-coefficient', 'wiki-mired-urn'],
    verifiedOn,
  },
]
