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

export const acSurvivors: SurvivorGuide[] = [
  {
    slug: 'operator',
    nameZh: '操作员',
    nameEn: 'Operator',
    dlc: 'ac',
    portrait: 'assets/survivors/operator.png',
    role: '无人机经济、命令库存与前线机械指挥',
    difficulty: 4,
    summary: '每关自带两台可选 Mk 2 无人机，购买和合并更多无人机会扩大 ADMIN-OVERRIDE 命令库存与质量；金币路线本身就是战斗成长。',
    skills: [
      skill('operator', 'passive', '无人机技术', 'Drone Tech', 'default', '每关携带 Gunner 与 Healing Mk 2，无人机倒地自动修复并进入隐藏领域。'),
      skill('operator', 'passive', '机枪无人机 Mk 2', 'Gunner Drone Mk 2', 'default', '推荐的第一台初始无人机，提供稳定远程火力并参与专属命令队列。'),
      skill('operator', 'passive', '治疗无人机 Mk 2', 'Healing Drone Mk 2', 'default', '推荐的第二台初始无人机，提供稳定恢复和支援型专属命令。'),
      skill('operator', 'primary', 'H3-11 OCR 定制枪', 'H3-11 OCR Custom', 'default', '唯一主攻，150%–600% 充能弹击杀后跳弹。'),
      skill('operator', 'secondary', '管理员覆写', 'ADMIN-OVERRIDE', 'default', '触发每种无人机专属命令，通常继承 Operator 的伤害和触发物品。'),
      skill('operator', 'utility', '升空协议', 'Ascent Protocol', 'default', '由多台无人机接力飞行，是 Eclipse 推荐机动技能。'),
      skill('operator', 'special', '弹射核心', 'Ejection Core', 'default', '击飞并施加 Nano-Bug 增伤，比需蓄伤的 Amp Core 稳定。'),
    ],
    buildLogic: [
      '默认 Gunner Drone Mk 2 加 Healing Drone Mk 2 最稳；购买每台新无人机既增加队伍火力，也给 ADMIN-OVERRIDE 增加一层命令储备。',
      'ADMIN-OVERRIDE 会调用不同机种专属技能，通常使用 Operator 的伤害与 on-hit、on-kill 物品；Boss 前应储满而非清杂时花空。',
      'Drone Combiner 合并同类无人机后保留或增加库存，并让命令效果按 tier 线性提高；不要无限修低级机而忽略合并质量。',
      '无人机经济需要控制时间：前期买便宜功能型，持 Executive Card 的队友处理三联店，不能为了远处昂贵无人机拖慢整关。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '同步提高 H3-11 射击手感与本体移动', '无人机承担部分火力，但 Operator 本体仍需移动和稳定充能射击。'),
        pick('lens-makers-glasses', 'core', '目标满暴击等效', '建立通用暴击并支撑命令触发和替代 SWARM', '暴击提高本体与多数继承命令的伤害，后续 Clover 也更稳定。'),
        pick('delicate-watch', 'recommended', '1–3 件', '提供通用伤害乘区并放大命令攻击', '远程飞行和无人机分担火力有助于保表，但低血时仍要撤离。'),
      ],
      uncommon: [
        pick('box-of-dynamite', 'core', '1–3 件', '让无人机周期投炸药并提供专属命令收益', 'Operator 拥有大量机械随从，能稳定把周期范围伤害送入怪群。'),
        pick('shipping-request-form', 'recommended', '1 件', '每关增加物品经济并腾出金币购买无人机', '减少箱子开支后可以扩充机队，同时控制整关时间。'),
        pick('fuel-cell', 'recommended', '1–2 件', '提高 The Back-up 等装备的储备与使用频率', '无人机装备流获益明显，但转 Lysate Cell 时必须明确取舍。'),
      ],
      legendary: [
        pick('spare-drone-parts', 'core', '1 件', '全面强化无人机队伍的核心机械红装', 'AC 官方削弱后仍明确强，机队规模让单件持续高价值。'),
        pick('pocket-icbm', 'recommended', 'Missile Drone 体系 1 件', '倍增导弹与已修复的 Missile Drone 命令', '1.4.1 已修复命令互动，配 AtG 和导弹机种时质变。'),
      ],
      boss: [
        pick('empathy-cores', 'core', '1 件起', '利用大量无人机盟友提高核心伤害', 'Operator 最容易维持高盟友数量，是该首领物品的天然适配者。'),
        pick('defense-nucleus', 'recommended', '1 件', '击杀精英生成 Alpha Construct 扩大军团', '本体和命令负责精英尾刀，构造体继续提供输出与吸引火力。'),
      ],
      equipment: [
        pick('the-back-up', 'core', '无人机体系携带', '召唤 Strike Drones 并扩大传送器机队规模', '与 Spare Drone Parts、Fuel Cell 和 Gesture 可形成扩军闭环。'),
        pick('executive-card', 'conditional', '经济阶段携带', '提高三联无人机商店的购买价值与选择', '队伍只需一人持有；后期经济完成后换 Royal Capacitor。'),
      ],
    },
    coopAdjustments: [
      'Operator 与 Engineer 对 Spare Drone Parts、Box of Dynamite 和无人机购买冲突最大，开局约定机械主核或平均分配。',
      '无人机商店用个人金币但火力服务全队，让 Executive Card 持有者购买三联店，不重复浪费经济。',
      'Healing Drone 命令为队友加速治疗，Mk 2 DOC 命令提供屏障；命令队列不能只追个人 DPS。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'lens-makers-glasses', 'oddly-shaped-opal', 'box-of-dynamite'], explanation: '先做移动、暴击和第一下保护，再取炸药箱；只购买二到四台功能无人机。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'fuel-cell', 'shipping-request-form'], explanation: '触发链、装备库存和货运经济同步成长，Boss 前合并机种并储满命令。' },
      { phase: '后期', picks: ['spare-drone-parts', 'pocket-icbm', '57-leaf-clover', 'dios-best-friend'], explanation: '配件先强化全机队，导弹机种成型再取 ICBM，最后补幸运和复活。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '炸药已有 AoE 时 1 件', '腐化 Ukulele，把群体连锁换成单体雷击', 'ADMIN 多命令能频繁触发，Box of Dynamite 已承担范围清群。'),
      pick('plasma-shrimp', 'recommended', 'DOC 屏障稳定时 1 件', '腐化 AtG Missile Mk. 1，以护盾换每次命中导弹', 'DOC 屏障和远程飞行帮助维持；掉盾环境仍保留普通 AtG。'),
      pick('lysate-cell', 'conditional', '特殊技能流 1 件', '腐化 Fuel Cell，增加 Ejection Core 特殊充能', '多核心控制很强；The Back-up 是主核时不要牺牲装备储备。'),
      pick('benthic-bloom', 'avoid', '不建议机械精确路线', '腐化 57 Leaf Clover 并随机升级普通物品', '可能升级掉经济、移动和无人机指定组件，破坏机队规划。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'conditional', 'The Back-up 闭环 1 件', '自动释放无人机装备并缩短装备冷却', '可持续扩军但不能为 Boss 留波次，进入终场前必须接受自动时机。'),
      pick('transcendence', 'conditional', 'DOC 护盾路线 1 件', '把生命转护盾并让常规 Healing Drone 治疗失效', '远程飞行适合回盾，但会降低治疗无人机对自身的价值。'),
      pick('brittle-crown', 'avoid', '不建议无人机经济路线', '命中赚金币但受伤会丢失大量金币', '飞行指挥时被擦伤会直接拖慢购买和合并无人机的核心经济。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '储满 ADMIN，Ejection Core 上 Nano-Bug，依队列连续命令，再用 H3-11 充能点杀和 Ascent 躲线。',
      '先调用控制和增益机种，再放伤害机种；高 tier 合并命令留给首领硬直窗。',
      'H3-11 满充点杀，Gunner 与 Missile 命令追击；Ascent 保持制高但留安全落点。',
      '无人机可进入 Hidden Realms；Ascent 跨旋转墙，夺取物品阶段靠命令控制而非追进锤击中心。',
    ),
    sourceIds: ['wiki-operator', 'wiki-operator-admin-override', 'official-operator-diary', 'official-ac-release-notes', 'official-ac-patch-1-4-1', 'wiki-drone-combiner'],
    verifiedOn,
  },
  {
    slug: 'drifter',
    nameZh: '漂泊者',
    nameEn: 'Drifter',
    dlc: 'ac',
    portrait: 'assets/survivors/drifter.png',
    role: 'Junk 资源、临时物品改造与近战拾荒支援',
    difficulty: 5,
    summary: '命中产生角色资源 Junk，用它绕过技能冷却或改造临时物品；同时 Item Scrap 会触发 Trash to Treasure 增益，两类资源绝不能混为一谈。',
    skills: [
      skill('drifter', 'passive', '变废为宝', 'Trash to Treasure', 'default', '持有不同稀有度 Item Scrap 获得可叠增益，它与技能 Junk 是两种资源。'),
      skill('drifter', 'primary', '钝器打击', 'Blunt Force', 'default', '三连 170%、170%、350% 眩晕，并有概率掉落 Junk。'),
      skill('drifter', 'secondary', '垃圾立方', 'Junk Cube', 'unlock-required', '可由主攻推动三次后高额终爆，四 Junk 可绕过冷却。'),
      skill('drifter', 'utility', '龙卷猛击', 'Tornado Slam', 'unlock-required', '1.4.1 后多段伤害与 Junk 产量提高，是稳定战斗经济引擎。'),
      skill('drifter', 'special', '巧匠', 'Tinker', 'unlock-required', '花八 Junk 重掷互动体或把未拾永久物改成临时同物与废料。'),
    ],
    buildLogic: [
      'Junk 是角色技能资源，Item Scrap 是物品废料；前者绕过技能冷却和支付 Tinker，后者由 Trash to Treasure 提供持续增益。',
      'Tornado Slam 对大目标多次命中并产生 Junk，1.4.1 后是推荐经济引擎；可以跳跃取消，先确认安全落点。',
      'Junk Cube 可由 Blunt Force 推动三次再终爆，花四 Junk 可跳过冷却；不要花到不足八点而失去 Tinker 选择。',
      'Tinker 生成的临时物有时限，不是永久库存；应在传送器前改造并立刻开战，而不是拿到临时红后继续逛图。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '提高三连攻击手感和近战移动能力', '更快 Blunt Force 推 Cube，Tornado 结束后也更容易脱离。'),
        pick('focus-crystal', 'core', '3–5 件', '放大主攻、Cube 与 Tornado 的近距离伤害', '推荐技能组几乎全部在贴身范围内命中，能稳定兑现乘区。'),
        pick('backup-magazine', 'core', '2–4 件', '增加 Junk Cube 储备并减少资源空窗', '可以少花 Junk 绕冷却，把八点资源保留给 Tinker 改造。'),
        pick('item-scrap-white', 'conditional', '保留 1–3 件', '通过 Trash to Treasure 提供可叠移动增益', '不要把所有白废料投打印机；保留少量能长期改善近战机动。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'recommended', '1–2 件', '把 Cube 与 Tornado 多段命中转成导弹伤害', '补足近战技能的首领单体，并减少必须花 Junk 绕冷却的压力。'),
        pick('collectors-compulsion', 'recommended', '1–3 件', '通过拾取物、临时物和 Junk 维持叠层增益', 'Drifter 的战斗循环持续拾取资源，能比多数角色稳定维持层数。'),
        pick('item-scrap-green', 'conditional', '保留 1–2 件', '通过 Trash to Treasure 提供持续生命回复', '与打印机需求权衡，留少量废料提高近战续航而不牺牲关键成装。'),
      ],
      legendary: [
        pick('substandard-duplicator', 'core', '1 件', '拾永久物时复制临时版本并延长临时物时限', '与 Tinker 临时库存直接协同，是 Drifter 最具角色特化的红装。'),
        pick('brilliant-behemoth', 'recommended', '1 件', '为 Cube、Tornado 与主攻附加范围爆炸', '近战多段技能把爆炸持续送入怪群，补足终局清场。'),
      ],
      boss: [
        pick('titanic-knurl', 'recommended', '1 件', '增加最大生命和回复以保护近战经济循环', '需要贴身产 Junk，高生命底盘能减少因一次失误失去节奏。'),
        pick('mired-urn', 'recommended', '1 件', '只牵引敌人并提供 tar、伤害与吸血', '当前不会吸队友，适合把目标留在 Tornado 和 Cube 范围。'),
      ],
      equipment: [
        pick('recycler', 'core', '选择阶段携带', '与 Tinker 共同改善永久掉落的选择质量', '先回收低价值掉落，再决定是否用八 Junk 制作临时版本和废料。'),
        pick('gorags-opus', 'conditional', '爆发阶段携带', '提高近战攻击和移动速度，压缩产 Junk 时间', '成型后可替换 Recycler，在传送器临时物爆发窗开启。'),
      ],
    },
    coopAdjustments: [
      'Tinker 会改造未拾取永久掉落并改变团队资源，红色和黄色尤其必须先获得全队同意。',
      'Salvage 产生的四个临时物可以分给队友；临时物有时限，团队应立刻进入传送器爆发窗。',
      'Repossess 不得擅自搬 Engineer 炮台、Captain 信标或队友；Item Scrap 在打印机前仍按全队需求分配。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'focus-crystal', 'lens-makers-glasses', 'oddly-shaped-opal', 'item-scrap-white'], explanation: '先做移动近战与暴击基础，保留首个白废料测试被动，但不牺牲关键成装。' },
      { phase: '中期', picks: ['backup-magazine', 'atg-missile-mk-1', 'collectors-compulsion', 'item-scrap-green'], explanation: '弹匣减少 Junk 消耗，触发链和收藏冲动放大拾取循环，酌情保留绿废料。' },
      { phase: '后期', picks: ['substandard-duplicator', '57-leaf-clover', 'brilliant-behemoth', 'dios-best-friend'], explanation: '复制器先放大临时库存，再补幸运、范围与复活；临时红黄直接带进 Boss。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化 Tougher Times，提供可预测冷却格挡', '近战出入和 Tornado 落点之间能计划保护，比随机格挡更易管理。'),
      pick('polylute', 'recommended', 'Behemoth 有 AoE 时 1 件', '腐化 Ukulele，把群体连锁换成单体雷击', 'Cube 与 Tornado 多段命中能强化首领，巨兽已承担范围清群。'),
      pick('lysate-cell', 'conditional', '装备不关键时 1 件', '腐化 Fuel Cell，增加 Tinker 或 Salvage 特殊充能', '更多改造机会很强；Recycler 是核心选择工具时仍保留燃料电池。'),
      pick('benthic-bloom', 'avoid', '不建议 Trash 路线', '腐化 57 Leaf Clover 并随机升级普通物品', '会打散想保留的特定白绿物与废料被动，也破坏 Command 路线。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'conditional', '纯伤害装备闭环 1 件', '自动释放装备并缩短装备冷却时间', 'Recycler 会自动重掷视线目标而极不可控，只有换纯伤害装备后才考虑。'),
      pick('light-flux-pauldron', 'conditional', 'Cube/Tinker 技能流 1 件', '缩短技能冷却但降低 Blunt Force 攻速', '资源技能主导时可接受，依赖主攻快速推 Cube 的手感会变慢。'),
      pick('shaped-glass', 'conditional', '临时物爆发成熟后 1 件', '倍增传送器临时库存的爆发伤害', '同时减半近战和 Tornado 容错，只有位移与保险充分时承担。'),
      pick('brittle-crown', 'avoid', '不建议近战经济路线', '命中赚金币但受伤会损失大量金币', 'Tornado 贴身多段环境容易被擦伤，反而拖慢箱子和无人机经济。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      'Tornado 穿大怪产 Junk，落 Cube 后用 Blunt Force 推三次，再用 Tinker 临时物开爆发。',
      '大体型让 Tornado 多次命中；Cube 推在首领路线，不站在落点硬吃攻击。',
      '条件换 Cleanup 比 Cube 和主攻更稳；Tornado 只在有安全落点时撞，装备补点杀。',
      'Tornado 可取消修正落点；月球前把临时红留到战斗生成，不为捡 Junk 走进锤击区。',
    ),
    sourceIds: ['wiki-drifter', 'wiki-drifter-tinker', 'official-drifter-diary', 'official-ac-patch-1-4-1', 'wiki-mired-urn'],
    verifiedOn,
  },
]
