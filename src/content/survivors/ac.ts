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
    summary: '每关自带两台可选二型无人机，购买和合并更多无人机会扩大管理员覆写的命令库存与质量；金币路线本身就是战斗成长。',
    skills: [
      skill('operator', 'passive', '无人机技术', 'Drone Tech', 'default', '每关携带二型炮手无人机与二型治疗无人机，无人机倒地自动修复并进入隐藏领域。'),
      skill('operator', 'passive', '二型炮手无人机', 'Gunner Drone Mk 2', 'default', '推荐的第一台初始无人机，提供稳定远程火力并参与专属命令队列。'),
      skill('operator', 'passive', '二型治疗无人机', 'Healing Drone Mk 2', 'default', '推荐的第二台初始无人机，提供稳定恢复和支援型专属命令。'),
      skill('operator', 'primary', '定制充能步枪', 'H3-11 OCR Custom', 'default', '唯一主攻，150%–600% 充能弹击杀后跳弹。'),
      skill('operator', 'secondary', '管理员覆写', 'ADMIN-OVERRIDE', 'default', '触发每种无人机专属命令，通常继承操作员的伤害和触发物品。'),
      skill('operator', 'utility', '升空协议', 'Ascent Protocol', 'default', '由多台无人机接力飞行，是天蚀推荐机动技能。'),
      skill('operator', 'special', '弹射核心', 'Ejection Core', 'default', '击飞并施加纳米虫增伤，比需要承受伤害蓄能的增幅核心稳定。'),
    ],
    buildLogic: [
      '默认二型炮手无人机加二型治疗无人机最稳；购买每台新无人机既增加队伍火力，也给管理员覆写增加一层命令储备。',
      '管理员覆写会调用不同机种专属技能，通常使用操作员的伤害与命中触发、击杀触发物品；首领前应储满而非清杂时花空。',
      '无人机合并器合并同类无人机后保留或增加库存，并让命令效果按等级线性提高；不要无限修低级机而忽略合并质量。',
      '无人机经济需要控制时间：前期买便宜功能型，持钻石会员卡的队友处理三联店，不能为了远处昂贵无人机拖慢整关。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '同步提高定制充能步枪的射击手感与本体移动', '无人机承担部分火力，但操作员本体仍需移动和稳定充能射击。'),
        pick('lens-makers-glasses', 'core', '目标满暴击等效', '建立通用暴击并支撑命令触发和集群命令', '暴击提高本体与多数继承命令的伤害，后续三叶草也更稳定。'),
        pick('delicate-watch', 'recommended', '1–3 件', '提供通用伤害乘区并放大命令攻击', '远程飞行和无人机分担火力有助于保表，但低血时仍要撤离。'),
      ],
      uncommon: [
        pick('box-of-dynamite', 'core', '1–3 件', '让无人机周期投炸药并提供专属命令收益', '操作员拥有大量机械随从，能稳定把周期范围伤害送入怪群。'),
        pick('shipping-request-form', 'recommended', '1 件', '每关增加物品经济并腾出金币购买无人机', '减少箱子开支后可以扩充机队，同时控制整关时间。'),
        pick('fuel-cell', 'recommended', '1–2 件', '提高对讲机等装备的储备与使用频率', '无人机装备流获益明显，但转溶菌电池时必须明确取舍。'),
      ],
      legendary: [
        pick('spare-drone-parts', 'core', '1 件', '全面强化无人机队伍的核心机械红装', '合金意念官方削弱后仍明确强，机队规模让单件持续高价值。'),
        pick('pocket-icbm', 'recommended', '导弹无人机体系 1 件', '倍增导弹与已修复的导弹无人机命令', '1.4.1 已修复命令互动，配空对地导弹1号和导弹机种时质变。'),
      ],
      boss: [
        pick('empathy-cores', 'core', '1 件起', '利用大量无人机盟友提高核心伤害', '操作员最容易维持高盟友数量，是该首领物品的天然适配者。'),
        pick('defense-nucleus', 'recommended', '1 件', '击杀精英生成阿尔法构造体扩大军团', '本体和命令负责精英尾刀，构造体继续提供输出与吸引火力。'),
      ],
      equipment: [
        pick('the-back-up', 'core', '无人机体系携带', '召唤攻击无人机并扩大传送器机队规模', '与无人机配件、燃料电池和溺亡者的心意可形成扩军闭环。'),
        pick('executive-card', 'conditional', '经济阶段携带', '提高三联无人机商店的购买价值与选择', '队伍只需一人持有；后期经济完成后换皇家电容器。'),
      ],
    },
    coopAdjustments: [
      '操作员与工程师对无人机配件、一箱炸药和无人机购买冲突最大，开局约定机械主核或平均分配。',
      '无人机商店用个人金币但火力服务全队，让钻石会员卡持有者购买三联店，不重复浪费经济。',
      '治疗无人机命令为队友加速治疗，二型治疗无人机的屏障命令提供屏障；命令队列不能只追个人持续伤害。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'lens-makers-glasses', 'oddly-shaped-opal', 'box-of-dynamite'], explanation: '先做移动、暴击和第一下保护，再取炸药箱；只购买二到四台功能无人机。' },
      { phase: '中期', picks: ['atg-missile-mk-1', 'ukulele', 'fuel-cell', 'shipping-request-form'], explanation: '触发链、装备库存和货运经济同步成长，首领前合并机种并储满命令。' },
      { phase: '后期', picks: ['spare-drone-parts', 'pocket-icbm', '57-leaf-clover', 'dios-best-friend'], explanation: '配件先强化全机队，导弹机种成型再取袖珍型洲际导弹，最后补幸运和复活。' },
    ],
    voidItems: [
      pick('polylute', 'recommended', '炸药已有范围伤害时 1 件', '腐化尤克里里，把群体连锁换成单体雷击', '管理员覆写的多种命令能频繁触发，一箱炸药已承担范围清群。'),
      pick('plasma-shrimp', 'recommended', '二型治疗无人机屏障稳定时 1 件', '腐化空对地导弹1号，以护盾换每次命中导弹', '二型治疗无人机的屏障和远程飞行帮助维持；掉盾环境仍保留普通空对地导弹1号。'),
      pick('lysate-cell', 'conditional', '特殊技能流 1 件', '腐化燃料电池，增加弹射核心特殊充能', '多核心控制很强；对讲机是主核时不要牺牲装备储备。'),
      pick('benthic-bloom', 'avoid', '不建议机械精确路线', '腐化57片叶子的三叶草并随机升级普通物品', '可能升级掉经济、移动和无人机指定组件，破坏机队规划。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'conditional', '对讲机闭环 1 件', '自动释放无人机装备并缩短装备冷却', '可持续扩军但不能为首领留波次，进入终场前必须接受自动时机。'),
      pick('transcendence', 'conditional', '二型治疗无人机屏障路线 1 件', '把生命转护盾并让常规治疗无人机治疗失效', '远程飞行适合回盾，但会降低治疗无人机对自身的价值。'),
      pick('brittle-crown', 'avoid', '不建议无人机经济路线', '命中赚金币但受伤会丢失大量金币', '飞行指挥时被擦伤会直接拖慢购买和合并无人机的核心经济。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '储满管理员覆写命令，弹射核心施加纳米虫，依队列连续命令，再用定制充能步枪点杀和升空协议躲避攻击线。',
      '先调用控制和增益机种，再放伤害机种；高等级合并命令留给首领硬直窗。',
      '定制充能步枪满充点杀，二型炮手无人机与导弹无人机命令追击；升空协议保持制高但留安全落点。',
      '无人机可进入隐藏领域；升空协议跨旋转墙，夺取物品阶段靠命令控制而非追进锤击中心。',
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
    role: '垃圾资源、临时物品改造与近战拾荒支援',
    difficulty: 5,
    summary: '命中产生角色垃圾资源，用它绕过技能冷却或改造临时物品；同时物品碎片会触发变废为宝增益，两类资源绝不能混为一谈。',
    skills: [
      skill('drifter', 'passive', '变废为宝', 'Trash to Treasure', 'default', '持有不同稀有度物品碎片获得可叠增益，它与技能垃圾资源是两种资源。'),
      skill('drifter', 'primary', '钝器打击', 'Blunt Force', 'default', '三连 170%、170%、350% 眩晕，并有概率掉落垃圾资源。'),
      skill('drifter', 'secondary', '垃圾立方', 'Junk Cube', 'unlock-required', '可由主攻推动三次后高额终爆，四点垃圾资源可绕过冷却。'),
      skill('drifter', 'utility', '龙卷猛击', 'Tornado Slam', 'unlock-required', '1.4.1 后多段伤害与垃圾资源产量提高，是稳定战斗经济引擎。'),
      skill('drifter', 'special', '巧匠', 'Tinker', 'unlock-required', '花八点垃圾资源重掷互动体或把未拾永久物改成临时同物与废料。'),
    ],
    buildLogic: [
      '垃圾资源是角色技能资源，物品碎片是物品废料；前者绕过技能冷却和支付巧匠，后者由变废为宝提供持续增益。',
      '龙卷猛击对大目标多次命中并产生垃圾资源，1.4.1 后是推荐经济引擎；可以跳跃取消，先确认安全落点。',
      '垃圾立方可由钝器打击推动三次再终爆，花四点垃圾资源可跳过冷却；不要花到不足八点而失去巧匠选择。',
      '巧匠生成的临时物有时限，不是永久库存；应在传送器前改造并立刻开战，而不是拿到临时红后继续逛图。',
    ],
    solo: {
      common: [
        pick('mocha', 'core', '3–5 件', '提高三连攻击手感和近战移动能力', '更快用钝器打击推动垃圾立方，龙卷猛击结束后也更容易脱离。'),
        pick('focus-crystal', 'core', '3–5 件', '放大主攻、垃圾立方与龙卷猛击的近距离伤害', '推荐技能组几乎全部在贴身范围内命中，能稳定兑现乘区。'),
        pick('backup-magazine', 'core', '2–4 件', '增加垃圾立方储备并减少资源空窗', '可以少花垃圾资源绕冷却，把八点资源保留给巧匠改造。'),
        pick('item-scrap-white', 'conditional', '保留 1–3 件', '通过变废为宝提供可叠移动增益', '不要把所有白废料投打印机；保留少量能长期改善近战机动。'),
      ],
      uncommon: [
        pick('atg-missile-mk-1', 'recommended', '1–2 件', '把垃圾立方与龙卷猛击多段命中转成导弹伤害', '补足近战技能的首领单体，并减少必须花垃圾资源绕冷却的压力。'),
        pick('collectors-compulsion', 'recommended', '1–3 件', '通过拾取物、临时物和垃圾资源维持叠层增益', '漂泊者的战斗循环持续拾取资源，能比多数角色稳定维持层数。'),
        pick('item-scrap-green', 'conditional', '保留 1–2 件', '通过变废为宝提供持续生命回复', '与打印机需求权衡，留少量废料提高近战续航而不牺牲关键成装。'),
      ],
      legendary: [
        pick('substandard-duplicator', 'core', '1 件', '拾永久物时复制临时版本并延长临时物时限', '与巧匠临时库存直接协同，是漂泊者最具角色特化的红装。'),
        pick('brilliant-behemoth', 'recommended', '1 件', '为垃圾立方、龙卷猛击与主攻附加范围爆炸', '近战多段技能把爆炸持续送入怪群，补足终局清场。'),
      ],
      boss: [
        pick('titanic-knurl', 'recommended', '1 件', '增加最大生命和回复以保护近战经济循环', '需要贴身产垃圾资源，高生命底盘能减少因一次失误失去节奏。'),
        pick('mired-urn', 'recommended', '1 件', '只牵引敌人并提供焦油减速、伤害与吸血', '当前不会吸队友，适合把目标留在龙卷猛击和垃圾立方范围。'),
      ],
      equipment: [
        pick('recycler', 'core', '选择阶段携带', '与巧匠共同改善永久掉落的选择质量', '先回收低价值掉落，再决定是否用八点垃圾资源制作临时版本和废料。'),
        pick('gorags-opus', 'conditional', '爆发阶段携带', '提高近战攻击和移动速度，压缩产垃圾资源时间', '成型后可替换回收机，在传送器临时物爆发窗开启。'),
      ],
    },
    coopAdjustments: [
      '巧匠会改造未拾取永久掉落并改变团队资源，红色和黄色尤其必须先获得全队同意。',
      '打捞产生的四个临时物可以分给队友；临时物有时限，团队应立刻进入传送器爆发窗。',
      '收回不得擅自搬工程师炮台、舰长信标或队友；物品碎片在打印机前仍按全队需求分配。',
    ],
    commandRoute: [
      { phase: '前期', picks: ['mocha', 'focus-crystal', 'lens-makers-glasses', 'oddly-shaped-opal', 'item-scrap-white'], explanation: '先做移动近战与暴击基础，保留首个白废料测试被动，但不牺牲关键成装。' },
      { phase: '中期', picks: ['backup-magazine', 'atg-missile-mk-1', 'collectors-compulsion', 'item-scrap-green'], explanation: '弹匣减少垃圾资源消耗，触发链和收藏冲动放大拾取循环，酌情保留绿废料。' },
      { phase: '后期', picks: ['substandard-duplicator', '57-leaf-clover', 'brilliant-behemoth', 'dios-best-friend'], explanation: '复制器先放大临时库存，再补幸运、范围与复活；临时红黄直接带进首领战。' },
    ],
    voidItems: [
      pick('safer-spaces', 'recommended', '1 件起', '腐化更艰难的时光，提供可预测冷却格挡', '近战出入和龙卷猛击落点之间能计划保护，比随机格挡更易管理。'),
      pick('polylute', 'recommended', '完美巨兽提供范围伤害时 1 件', '腐化尤克里里，把群体连锁换成单体雷击', '垃圾立方与龙卷猛击多段命中能强化首领，完美巨兽已承担范围清群。'),
      pick('lysate-cell', 'conditional', '装备不关键时 1 件', '腐化燃料电池，增加巧匠或回收特殊充能', '更多改造机会很强；回收机是核心选择工具时仍保留燃料电池。'),
      pick('benthic-bloom', 'avoid', '不建议变废为宝路线', '腐化57片叶子的三叶草并随机升级普通物品', '会打散想保留的特定白绿物与废料被动，也破坏统率路线。'),
    ],
    lunarItems: [
      pick('gesture-of-the-drowned', 'conditional', '纯伤害装备闭环 1 件', '自动释放装备并缩短装备冷却时间', '回收机会自动重掷视线目标而极不可控，只有换纯伤害装备后才考虑。'),
      pick('light-flux-pauldron', 'conditional', '垃圾立方与巧匠技能流 1 件', '缩短技能冷却但降低钝器打击攻速', '资源技能主导时可接受，依赖主攻快速推动垃圾立方的手感会变慢。'),
      pick('shaped-glass', 'conditional', '临时物爆发成熟后 1 件', '倍增传送器临时库存的爆发伤害', '同时减半近战和龙卷猛击容错，只有位移与保险充分时承担。'),
      pick('brittle-crown', 'avoid', '不建议近战经济路线', '命中赚金币但受伤会损失大量金币', '龙卷猛击贴身多段环境容易被擦伤，反而拖慢箱子和无人机经济。'),
    ],
    lunarEquipment: [],
    combatNotes: combat(
      '龙卷猛击穿过大怪产生垃圾资源，落下垃圾立方后用钝器打击推动三次，再用巧匠临时物开爆发。',
      '大体型让龙卷猛击多次命中；垃圾立方推在首领路线，不站在落点硬吃攻击。',
      '条件允许时换清理比垃圾立方和主攻更稳；龙卷猛击只在有安全落点时撞，装备补点杀。',
      '龙卷猛击可取消以修正落点；月球前把临时红留到战斗生成，不为捡垃圾资源走进锤击区。',
    ),
    sourceIds: ['wiki-drifter', 'wiki-drifter-tinker', 'official-drifter-diary', 'official-ac-patch-1-4-1', 'wiki-mired-urn'],
    verifiedOn,
  },
]
