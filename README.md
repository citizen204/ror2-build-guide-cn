# 雨中冒险 2 全角色中文构筑攻略

这是一个只读的《雨中冒险 2》中文粉丝攻略站。它覆盖 18 名可选角色与异端（Heretic）特殊变身，集中说明推荐技能、物品作用与件数、单人和联机调整、统率神器路线、虚空与月球物品，以及常见战斗场景。

当前内容核对日期为 2026-08-25，适用范围包括：

- 本体（Base）
- Survivors of the Void（SOTV）
- Seekers of the Storm（SOTS）
- 合金意念（Alloyed Collective，AC）

Hallowed Concepts 尚未纳入已发布攻略范围。

## 本地开发与检查

需要符合 `package.json` 中 `engines` 要求的 Node.js 和 npm。

```bash
npm install
npm run dev
```

提交前运行：

```bash
npm run assets:check
npm run check
```

也可以分别运行 `npm run test` 和 `npm run build`。开发服务器使用根路径 `/`；生产构建使用 GitHub Pages 仓库子路径 `/ror2-build-guide-cn/`，并在构建结束时检查 `dist/index.html` 的本地资源 URL 和对应文件。

## 更新攻略内容

1. 在 `src/content/survivors/` 中更新对应 DLC 的角色资料。角色顺序由 `src/content/survivors/index.ts` 统一维护。
2. 新增或修改物品时同步更新 `src/content/items.ts`，所有攻略引用都使用物品 ID，并由领域校验拦截未知引用。
3. 在 `src/content/sources.ts` 中登记直接资料链接，并在 `src/content/siteMetadata.ts` 更新公开核对日期与 DLC 范围；同时更新受影响角色资料中的 `verifiedOn` 和来源 ID。首页与页脚会读取共享元数据，`index.html` 与本 README 的静态范围说明也需要同步检查。
4. 更新角色、技能或物品图标时，先修改 `src/content/assets.json` 中的本地路径与 wiki.gg 文件来源，再运行 `npm run assets:update`。不要直接替换 `public/assets/` 中的文件。
5. 运行 `npm run assets:check` 和 `npm run check`，确认资源哈希、内容结构、测试和生产构建全部通过。

## 攻略数据结构

每个 `SurvivorGuide` 以 `slug` 为稳定路由键，并包含 `nameZh`、`nameEn`、`dlc`、`portrait`、`role`、`difficulty` 与 `summary`。正文由 `skills`、`buildLogic`、`coopAdjustments`、三个阶段的 `commandRoute`、`combatNotes`、`sourceIds` 和 `verifiedOn` 组成。

物品按用途分组：`solo` 内含白、绿、红、首领与普通主动装备；`voidItems` 存放虚空物品；`lunarItems` 只存被动月球物品；`lunarEquipment` 只存月球主动装备。每条 `ItemPick` 使用 `itemId` 连接 `src/content/items.ts`，并写明 `recommendation`、`stacks`、`role`、`synergy`，需要时再提供 `alternative`。

`validateGuideData` 会检查 19 篇攻略的完整性、必需技能槽位、三阶段统率路线、非空公开内容、来源和所有物品引用，并验证每个分组对应的 `tier`；规范顺序由签名测试固定。新增字段或分组时，应先扩展类型、领域校验和签名测试，再更新全部角色数据。

## 资料、素材与声明

攻略结论参考官方 Steam 商店、官方更新公告和 [Risk of Rain 2 Wiki](https://riskofrain2.wiki.gg/wiki/Risk_of_Rain_2_Wiki)。主要直接来源记录在 `src/content/sources.ts`。

角色、技能和物品图标取自 Risk of Rain 2 Wiki 的对应文件页。[完整图标来源清单](https://github.com/citizen204/ror2-build-guide-cn/blob/main/src/content/assets.json)为每个本地 PNG 记录原文件名、直接来源页、文件大小和 SHA-256。游戏名称与图像的权利及许可归各权利方；本仓库不对这些素材作再授权，复用前请查阅对应文件来源页及 [Wiki 权利与许可说明](https://riskofrain2.wiki.gg/wiki/Risk_of_Rain_2_Wiki:Copyrights)。

本项目是公开的非官方粉丝攻略，与《雨中冒险 2》的开发商、发行商及平台方没有隶属、赞助或认可关系。仓库当前标记为 `UNLICENSED`，未另行授予站点代码或攻略文字的复用许可。

## GitHub Pages

在线地址：<https://citizen204.github.io/ror2-build-guide-cn/>

本仓库已配置 GitHub Actions Pages，站点已通过 HTTPS 在上述地址上线。`main` 分支更新或手动触发工作流时，会安装锁定依赖、运行 `npm run check`、上传 `dist/`，再使用官方 Pages action 发布。

项目使用 Vite 仓库子路径，路由由 `HashRouter` 管理；页面地址位于 `/#/…`，因此不需要另设 `404.html` SPA 回退。
