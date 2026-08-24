# 虚空恶鬼 Void Fiend

## 版本与来源

核验于 2026-08-25。腐化/治疗/技能：https://riskofrain2.wiki.gg/wiki/Void_Fiend ；proc：https://riskofrain2.wiki.gg/wiki/Proc_Coefficient ；Void 物品：https://riskofrain2.wiki.gg/wiki/Items#Void_Items 。推荐为编辑判断。

## 角色定位

在远程控制形态与近距高 DPS 腐化形态间自动切换的资源角色。核心不是“治疗越多越好”，而是按战况操纵 Corruption：未腐化时每秒上升；暴击/受伤提高，**收到治疗会降低**；每件 Void 物品把最低 Corruption 提高 2%。变身瞬间有短暂无敌并刷新自身技能冷却。

## 当前技能与推荐配置

Void Fiend 没有可换的常规技能，均默认解锁；腐化时自动换成对应版本：

| 槽位 | 普通形态 | 腐化形态 | 用途 |
|---|---|---|---|
| 被动 | `Void Corruption` | 同一资源系统 | 100% 自动变身，耗尽后恢复 |
| 主技能 | `Drown` | `Corrupted Drown` | 前者远程精准；后者近距持续束流 |
| 副技能 | `Flood` | `Corrupted Flood` | 蓄力强击；腐化版快速 AoE |
| 位移 | `Trespass` | `Corrupted Trespass` | 都清 debuff/移除 hitbox；普通向上，腐化向前 |
| 特殊 | `Suppress` | `Corrupted Suppress` | 普通消耗 25% Corruption 治 25% 最大生命；腐化版消耗 25% 最大生命换 25% Corruption |

最稳配置即默认全套；编辑判断是把 Corruption 当第二条资源，不追求永久锁腐化。

## 伤害、移动与生存

- 暴击按攻击 proc coefficient 增加 Corruption；治疗按合并最大生命比例扣 Corruption。治疗型 proc（镰刀、真菌、尸花）可能提前结束爆发。
- 每件 Void 物品提高最低值 2%，令更快变身且腐化衰减更慢；50 件会锁在 100%，通常非短局目标。
- 普通 Trespass 向上、腐化 Trespass 横向且无敌更短；接近 100% 时别先交普通位移，以免变身刷新被浪费。

## 物品优先级（编辑判断）

- **白：** `Lens-Maker's Glasses` **5–10**（伤害+加腐化）；`Mocha` **3–5**；`Backup Magazine` **2–4**；`Oddly-shaped Opal` **1**；`Armor-Piercing Rounds` **1–3**。
- **绿：** `Predatory Instincts` **1–3**；`AtG Missile Mk. 1`/`Ukulele` 各 **1–3**；`Hopoo Feather` **1–2**；`Fuel Cell` **1–2**。`Harvester's Scythe` 仅 **0–1**，它的治疗会降腐化。
- **红：** `57 Leaf Clover` **1**；`Brilliant Behemoth` **1**；`Alien Head` **1**。避免把 `Rejuvenation Rack` 当无条件强红。
- **首领：** `Shatterspleen` **1**（暴击流）；`Charged Perforator` **1+**。
- **装备：** `Ocular HUD` 在腐化期维持暴击/Corruption 并爆发；`Royal Capacitor` 通用点杀。

## 单人 Command 路线

- **前期：** Mocha×2→眼镜×3→Backup Magazine×1→Opal；用 Suppress 主动保持可控区间。
- **中期：** AtG/Ukulele、Predatory、羽毛；只拿确实需要的 Void 转换，观察最低 Corruption。
- **后期：** Clover/Behemoth/Alien Head，补 Dio/Safer Spaces；终场前避免突然加入大量被动治疗。

## 联机调整

告诉队友不要在计划腐化爆发时强制喂大额治疗；Healing Beacon/Seeker 治疗会降低 Corruption。Void Fiend 适合拿暴击和部分 Void 物品，但不要独占全部，因为最低 Corruption 过高会失去普通形态远程/自疗。近距腐化期处理 Boss，普通期清远端威胁。

## Void 转换

- **推荐：** `Safer Spaces`←`Tougher Times`，格挡不算治疗，不会主动降 Corruption。
- **推荐：** `Polylute`←`Ukulele`，腐化束流强化单体。
- **条件：** `Plasma Shrimp`←`AtG Missile Mk. 1`，用个人护盾/不受击维持；Suppress 治疗本身不补普通护盾。
- **条件：** `Needletick`←`Tri-Tip Dagger`，束流快速叠坍缩；长战保留流血。
- **避免/谨慎：** `Weeping Fungus`←`Bustling Fungus`，奔跑治疗会持续压 Corruption；只有明确偏普通形态才换。

## Lunar 被动与装备

- **推荐（腐化倾向）：** `Transcendence` 将生命转护盾、减少常规治疗需求；但 Suppress 的生命/治疗互动要实战管理。
- **条件：** `Gesture of the Drowned` + Ocular HUD 自动开暴击窗，无法留给指定腐化期是代价。
- **避免：** `Corpsebloom` 会先立即扣 Corruption，再随延迟治疗继续扣，极难变身。
- **条件：** `Shaped Glass` 提伤但减半资源容错；Corrupted Suppress 的生命代价更危险。

## 战斗循环

- **传送器：** 普通 Drown/Flood 远程铺伤→90% 附近靠位移入场→变身刷新→束流+Flood 爆发→Trespass 撤出。
- **Boss：** 用 Suppress 控制变身时点；腐化期贴到束流有效距离，结束前预留退路。
- **飞行怪：** 普通 Drown 精准处理；腐化束流射程短，宁可清近敌等形态回转。
- **最终阶段：** 普通 Trespass 越过旋转墙、腐化 Trespass 横移锤击；物品夺取阶段不要用 Corrupted Suppress 把生命压到处决线。
