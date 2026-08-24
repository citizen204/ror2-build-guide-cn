# REX

## 版本与来源

核验于 2026-08-25。角色与技能：https://riskofrain2.wiki.gg/wiki/REX ；proc：https://riskofrain2.wiki.gg/wiki/Proc_Coefficient ；物品：https://riskofrain2.wiki.gg/wiki/Items 。推荐是编辑判断；尤其 Eclipse 的永久伤害/治疗限制会显著改变 REX 风险。

## 角色定位

远程控制、Weaken 减伤/减速/减甲与以生命换技能的自愈炮台。默认被动 `Natural Toxins` 让特定技能施加 Weaken。Eclipse 稳定路线尽量减少主动耗血，采用无生命成本的 `DIRECTIVE: Drill`。

## 当前技能与最稳单人配置

| 槽位 | 选择与解锁 | 编辑判断 |
|---|---|---|
| 主技能 | `DIRECTIVE: Inject`（默认、唯一） | 三针，最后一针 Weaken 并按伤害回血；固定 |
| 副技能 | 种子弹幕 `Seed Barrage`（默认，耗 15% HP）；`DIRECTIVE: Drill`（挑战解锁、无耗血） | **DIRECTIVE: Drill**，Eclipse/稳定路线首选 |
| 位移 | `DIRECTIVE: Disperse`（默认）；荆棘齐射 `Bramble Volley`（挑战解锁、耗 20% HP） | **DIRECTIVE: Disperse** 无耗血并可反推位移；普通 Monsoon 可用 Bramble 自愈爆发 |
| 特殊 | 缠绕生长 `Tangling Growth`（默认、耗 25% HP）；`DIRECTIVE: Harvest`（挑战解锁） | **Tangling Growth** 群控+群体回血最强，但 E8 要谨慎；Harvest 无直接自伤、杀敌掉果实更稳但控制弱 |

推荐稳定配置：`DIRECTIVE: Inject / DIRECTIVE: Drill / DIRECTIVE: Disperse / Tangling Growth`；Eclipse 8 对永久伤敏感时可把特殊换 `DIRECTIVE: Harvest`。

## 触发、伤害与生存模式

- Inject 3×0.5 proc；Drill 16 次 0.5 proc，适合范围内持续触发。Drill 不耗血，Backup Magazine 直接增加覆盖层数。
- Weaken 会显著减少敌人伤害/速度并降甲；优先给 Boss/精英保持。
- 自伤技能成本按当前/最大生命机制结算且不能靠“无敌”免除；Eclipse 永久伤让主动压低生命尤其危险。
- Tangling Growth 先拉群，再叠 Drill；Disperse 反向跳推可作机动。

## 构筑逻辑与分层优先级（编辑判断）

### 白色

- `Backup Magazine`：Drill 多层覆盖；**3–5**。
- `Mocha`：Inject 攻速和机动；**2–4**。
- `Cautious Slug`：脱战恢复、不依赖暴击；**1–3**。
- `Armor-Piercing Rounds`：伤害也放大 Inject 按伤害治疗；**1–3**。
- `Oddly-shaped Opal`：在自伤后防第一下；**1**。

### 绿色

- `Death Mark`：REX 自带 Weaken 加特殊技能 debuff，队伍/物品再补即可触发；**1**。
- `AtG Missile Mk. 1`：Drill 多 tick；**1–3**。
- `Infusion`：最大生命和技能承压；**1–2**，但更高最大血也会提高百分比自伤的绝对值。
- `Hopoo Feather`：补垂直移动；**1–2**。

### 红色

- `Rejuvenation Rack`：放大 Inject/Tangling 治疗；Monsoon **1**，E8 因治疗削弱仍低于机动红。
- `Alien Head`：更多控制和 Drill；**1**。
- `Aegis`：AC 后屏障衰减方式改善；大量过量治疗时 **1**，否则不优先。

### 首领与装备

- `Mired Urn`：仅牵引近处敌人，吸血/tar 并补 debuff；**1**。当前机制：https://riskofrain2.wiki.gg/wiki/Mired_Urn 。
- `Titanic Knurl`：生命与回复的稳定底盘；**1+**。
- `Super Massive Leech`：爆发期间把伤害转治疗，危急恢复。
- `Royal Capacitor`：远程点杀，伤害提升也让 proc 链间接更强。

## 单人 Command 路线

- **前期：** Backup Magazine×2、Mocha×2、Slug×1、Opal×1；先用 Drill 替代耗血弹幕。
- **中期：** Death Mark、AtG、羽毛、Infusion；补能提供不同 debuff 的 Chronobauble/Ignition Tank。
- **后期：** Monsoon 取 Rejuvenation Rack/Aegis；Eclipse 更优先 Alien Head、Hardlight Afterburner 与 Dio。

## 联机调整

REX 的 Weaken/缠绕是团队减伤和聚怪工具，应把 Tangling Growth 对准队友 AoE。`Mired Urn` 的当前目标只是敌人；REX 可用它补 tar/近距自疗，Death Mark 可由全队共同补其他 debuff。治疗资源不要全拿，Inject/Tangling 已能自给，优先把急救给无自愈前排。

## Void 转换

- **推荐：** `Weeping Fungus`←`Bustling Fungus`，移动时恢复更符合 REX；固定站圈价值低。
- **推荐：** `Polylute`←`Ukulele`，Drill 对 Boss 高频触发；Tangling 已负责聚群。
- **条件：** `Needletick`←`Tri-Tip Dagger`，Drill 很快叠坍缩；但 Death Mark 需要流血 debuff 时保留原件。
- **条件：** `Lysate Cell`←`Fuel Cell`，额外 Tangling/Harvest；若 Leech 是保命装备则不要腐化燃料电池。
- **避免：** `Plasma Shrimp`，自伤/频繁掉血会打断护盾，可靠性差。

## Lunar 被动与装备

- **避免：** `Transcendence` 会把生命转护盾，使 REX 的生命消耗与治疗核心互动恶化，不作为稳定推荐。
- **条件：** `Corpsebloom` 提高总治疗却限制单位时间治疗；爆发自伤后可能恢复太慢，普通 Monsoon 才考虑，Eclipse 避免。
- **条件：** `Purity` 纯技能/控制流可拿，负幸运会削 Drill 的 proc 链。
- **避免：** `Shaped Glass` 减半最大生命，使每次主动耗血后的安全线极低。

## 战斗循环

- **传送器：** Tangling 聚群→叠放 Drill→Inject 维持 Weaken/回血→Disperse 把近身怪推回控制区。
- **Boss：** 常驻 Weaken，Drill 预判落点；生命低于安全线时停止一切自伤技能。
- **飞行怪：** Inject/Drill 预判，Disperse 推开；Tangling 锁定后集中火力。
- **最终阶段：** 利用 Disperse 反推躲线，避免在永久伤已高时用 Tangling；物品夺取阶段依靠 Weaken 和掩体慢打。
