# 全中文展示实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将公开网站的所有用户可见内容改为中文，同时保留内部英文名称和英文角色搜索能力。

**Architecture:** 保留现有 `nameZh` / `nameEn` 双语领域数据，只让 React 展示组件渲染 `nameZh`。用数据级与渲染级测试共同约束可见中文字段，精确允许 `MUL-T` 和 `REX` 两个官方拉丁专名；正文翻译直接写回内容数据，不使用 CSS 隐藏或运行时字符串替换。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、Testing Library、GitHub Pages

---

## 文件职责与改动范围

- `src/content/chinesePresentation.test.ts`：集中验证物品、角色攻略和渲染页面的全中文契约。
- `src/components/SurvivorCard.tsx`：首页角色卡只渲染中文展示名和中文替代文本。
- `src/components/SkillLoadout.tsx`：技能只渲染中文名。
- `src/components/ItemGroup.tsx`：物品和腐化原物品只渲染中文名。
- `src/pages/SurvivorPage.tsx`：角色身份、统率路线和角色翻页只渲染中文名。
- `src/components/SearchFilters.tsx`：中文搜索提示和中文扩展内容筛选标签。
- `src/components/SiteFooter.tsx`：中文适用范围、来源与归属说明。
- `src/content/survivors/{base,sotv,sots,ac,special}.ts`：将用户可见攻略正文中的英文术语改写为中文。
- `src/content/siteMetadata.ts`：保留内部英文资料，但页脚只消费中文字段。
- `index.html`、`PRODUCT.md`、`README.md`：公开元数据和产品说明改为全中文展示约定。
- 现有首页、详情页、页脚和文档测试：更新为中文展示断言，同时保留英文搜索回归。

### Task 1: 建立全中文契约的失败测试

**Files:**
- Create: `src/content/chinesePresentation.test.ts`
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/SurvivorPage.test.tsx`
- Modify: `src/components/SiteFooter.test.tsx`

- [ ] **Step 1: 新建可见字段扫描测试**

在 `src/content/chinesePresentation.test.ts` 中加入以下测试工具和数据测试：

```ts
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test } from 'vitest'
import App from '../App'
import { items } from './items'
import { survivors } from './survivors'
import type { BuildSection, ItemPick, SurvivorGuide } from '../domain/guide'

const approvedOfficialLatinNames = ['MUL-T', 'REX'] as const

function withoutApprovedOfficialNames(value: string): string {
  return approvedOfficialLatinNames.reduce(
    (result, name) => result.replaceAll(name, ''),
    value,
  )
}

function expectChineseOnly(value: string, source: string): void {
  expect(
    withoutApprovedOfficialNames(value),
    `${source} 含有未批准的拉丁字母：${value}`,
  ).not.toMatch(/[A-Za-z]/)
}

function itemPickText(pick: ItemPick): string[] {
  return [pick.stacks, pick.role, pick.synergy, pick.alternative ?? '']
}

function buildText(build: BuildSection): string[] {
  return Object.values(build).flatMap((picks) => picks.flatMap(itemPickText))
}

function guideVisibleText(guide: SurvivorGuide): string[] {
  return [
    guide.nameZh,
    guide.role,
    guide.summary,
    ...guide.skills.flatMap((skill) => [skill.nameZh, skill.reason]),
    ...guide.buildLogic,
    ...buildText(guide.solo),
    ...guide.coopAdjustments,
    ...guide.commandRoute.flatMap((route) => [route.phase, route.explanation]),
    ...guide.voidItems.flatMap(itemPickText),
    ...guide.lunarItems.flatMap(itemPickText),
    ...guide.lunarEquipment.flatMap(itemPickText),
    ...guide.combatNotes.flatMap((note) => [note.title, note.body]),
  ]
}

afterEach(cleanup)

describe('全中文展示契约', () => {
  test('物品和角色的中文展示字段不含未批准的拉丁字母', () => {
    for (const item of items) expectChineseOnly(item.nameZh, `物品 ${item.id}`)
    for (const guide of survivors) {
      guideVisibleText(guide).forEach((value, index) => {
        expectChineseOnly(value, `角色 ${guide.slug} 可见字段 ${index}`)
      })
    }
  })

  test.each(['/', ...survivors.map(({ slug }) => `/survivors/${slug}`)])(
    '%s 路由只渲染中文和批准的官方专名',
    (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      )
      expectChineseOnly(document.body.textContent ?? '', `路由 ${path}`)
      for (const image of document.images) {
        expectChineseOnly(image.alt, `路由 ${path} 图片替代文本`)
      }
    },
  )
})
```

- [ ] **Step 2: 更新首页行为断言，明确英文只用于输入匹配**

在 `src/pages/HomePage.test.tsx` 中先把 `searches by English name` 测试改成：

```ts
test('英文名称仍可搜索，但结果卡片只显示中文', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  const link = screen.getByRole('link', { name: /呛鼻毒师/ })
  expect(link).toBeInTheDocument()
  expect(link).not.toHaveTextContent('Acrid')
  expect(screen.queryByText('Acrid')).not.toBeInTheDocument()
})
```

把 DLC 测试的按钮名称改成“虚空幸存者”“风暴探寻者”“合金意念”“特殊变身”，并把角色链接断言改为只匹配 `nameZh`。

- [ ] **Step 3: 更新详情页与页脚的中文展示断言**

在 `src/pages/SurvivorPage.test.tsx` 中新增或改写断言：

```ts
expect(screen.getByRole('heading', { level: 1, name: '呛鼻毒师' })).toBeInTheDocument()
expect(screen.getByRole('img', { name: '呛鼻毒师角色头像' })).toBeInTheDocument()
expect(screen.getByRole('img', { name: '神经毒素技能图标' })).toBeInTheDocument()
expect(screen.queryByText('Neurotoxin')).not.toBeInTheDocument()
expect(screen.getByRole('img', { name: '汽油物品图标' })).toBeInTheDocument()
expect(screen.queryByText('Gasoline')).not.toBeInTheDocument()
expect(screen.getByRole('link', { name: '下一个角色：舰长' })).toBeInTheDocument()
```

在 `src/components/SiteFooter.test.tsx` 中把适用范围期望改为：

```ts
expect(scope).toHaveTextContent(
  '本体、虚空幸存者、风暴探寻者、合金意念',
)
expect(scope).not.toHaveTextContent(/Base|Survivors of the Void|SOTV|SOTS|AC/)
```

- [ ] **Step 4: 运行聚焦测试并确认按预期失败**

Run:

```bash
npx vitest run src/content/chinesePresentation.test.ts src/pages/HomePage.test.tsx src/pages/SurvivorPage.test.tsx src/components/SiteFooter.test.tsx
```

Expected: FAIL，失败原因应是现有组件仍渲染 `nameEn`、DLC 缩写和正文英文，不得是导入或语法错误。

- [ ] **Step 5: 提交测试基线**

测试必须保持红色直到 Task 2 开始实现，不单独提交无法通过主分支门禁的提交；将这些测试与 Task 2 的最小实现放在同一提交。

### Task 2: 将展示组件改为只渲染中文

**Files:**
- Modify: `src/components/SurvivorCard.tsx`
- Modify: `src/components/SkillLoadout.tsx`
- Modify: `src/components/ItemGroup.tsx`
- Modify: `src/pages/SurvivorPage.tsx`
- Modify: `src/components/SearchFilters.tsx`
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/SurvivorPage.test.tsx`

- [ ] **Step 1: 删除角色卡、技能和物品的英文渲染节点**

将角色卡标题和替代文本改为：

```tsx
<img
  src={assetUrl(survivor.portrait)}
  alt={`${survivor.nameZh}角色头像`}
  loading="lazy"
/>
<h2>{survivor.nameZh}</h2>
```

将技能名称和替代文本改为：

```tsx
<img
  className="skill-row__icon"
  src={assetUrl(skill.icon)}
  alt={`${skill.nameZh}技能图标`}
  loading="lazy"
/>
<p className="skill-row__name"><strong>{skill.nameZh}</strong></p>
```

将 `BilingualItemName` 改名为 `ItemName`，只返回：

```tsx
function ItemName({ item }: { item: ItemDefinition }) {
  return <strong className="item-row__name">{item.nameZh}</strong>
}
```

物品替代文本使用 `${item.nameZh}物品图标`；腐化原物品只渲染 `originalItem.nameZh`。

- [ ] **Step 2: 删除详情页身份、统率路线和翻页中的英文节点**

`SurvivorIdentity` 使用：

```tsx
<img src={assetUrl(guide.portrait)} alt={`${guide.nameZh}角色头像`} />
<h1 id="guide-top" data-page-title="" tabIndex={-1}>{guide.nameZh}</h1>
```

`CommandItem` 使用 `${item.nameZh}统率路线图标` 并只显示 `item.nameZh`。翻页链接的可见文字和 `aria-label` 都只使用 `previous.nameZh` / `next.nameZh`。

- [ ] **Step 3: 将筛选控件改为中文全称**

`SearchFilters.tsx` 中使用：

```ts
const dlcOptions: { value: DlcFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'base', label: '本体' },
  { value: 'sotv', label: '虚空幸存者' },
  { value: 'sots', label: '风暴探寻者' },
  { value: 'ac', label: '合金意念' },
  { value: 'special', label: '特殊变身' },
]
```

输入框提示改为“输入中文名；也支持英文搜索”，`fieldset` 图例改为“按扩展内容筛选”，移除可见的 `DLC` 和 `ID`。

- [ ] **Step 4: 运行组件测试，确认组件级断言转绿**

Run:

```bash
npx vitest run src/pages/HomePage.test.tsx src/pages/SurvivorPage.test.tsx
```

Expected: 与角色、技能、物品、筛选和翻页有关的测试 PASS；全中文数据扫描仍因正文英文而 FAIL。

- [ ] **Step 5: 提交组件改动与 Task 1 测试**

```bash
git add src/content/chinesePresentation.test.ts src/components/SurvivorCard.tsx src/components/SkillLoadout.tsx src/components/ItemGroup.tsx src/components/SearchFilters.tsx src/pages/SurvivorPage.tsx src/pages/HomePage.test.tsx src/pages/SurvivorPage.test.tsx
git commit -m "feat: switch guide presentation to Chinese"
```

### Task 3: 中文化本体角色攻略正文

**Files:**
- Modify: `src/content/survivors/base.ts`
- Test: `src/content/chinesePresentation.test.ts`
- Test: `src/content/survivors/survivors.test.ts`

- [ ] **Step 1: 用数据测试列出本体角色的英文残留**

Run:

```bash
npx vitest run src/content/chinesePresentation.test.ts
```

Expected: FAIL，并逐项报告 `commando`、`huntress`、`bandit`、`mul-t`、`engineer`、`artificer`、`mercenary`、`rex`、`loader`、`acrid`、`captain` 的可见字段英文残留。

- [ ] **Step 2: 按既有中文名替换技能和物品引用**

编辑 `base.ts` 的 `role`、`summary`、技能理由、构筑逻辑、物品作用/联动/替代、联机建议、统率解释和战斗速记。出现技能或物品英文名时，从同一角色的 `skills[].nameZh` 或 `items.ts` 的 `nameZh` 取值，不自行创造第二译名。

统一机制词：

| 原文 | 中文展示 |
| --- | --- |
| `Expose` | `暴露` |
| `Weaken` | `削弱` |
| `Heavy` | `重型攻击` |
| `Poison` | `中毒` |
| `proc` / `on-hit` | `触发` / `命中触发` |
| `crit` | `暴击` |
| `cooldown` | `冷却` |
| `DPS` | `持续伤害` |
| `HP` | `生命值` |
| `RNG` | `随机性` |

`MUL-T` 与 `REX` 可保留；其他技能名如 `Laser Sword`、`Whirlwind`、`Eviscerate`、`Blinding Assault`、`Beacon: Hacking` 必须使用各自 `nameZh`。

- [ ] **Step 3: 保持构筑语义不变**

逐条对照修改前后的同一字段，确认推荐等级、建议件数、条件、风险和替代选择没有改变。只翻译名称与机制词，不重写构筑结论。

- [ ] **Step 4: 运行本体数据测试**

Run:

```bash
npx vitest run src/content/chinesePresentation.test.ts src/content/survivors/survivors.test.ts
```

Expected: 本体角色不再出现在英文残留失败消息中；签名、角色数量和物品引用测试 PASS。

- [ ] **Step 5: 提交本体正文翻译**

```bash
git add src/content/survivors/base.ts src/content/chinesePresentation.test.ts src/content/survivors/survivors.test.ts
git commit -m "content: translate base survivor guides to Chinese"
```

### Task 4: 中文化扩展内容与特殊角色攻略正文

**Files:**
- Modify: `src/content/survivors/sotv.ts`
- Modify: `src/content/survivors/sots.ts`
- Modify: `src/content/survivors/ac.ts`
- Modify: `src/content/survivors/special.ts`
- Test: `src/content/chinesePresentation.test.ts`
- Test: `src/content/survivors/survivors.test.ts`

- [ ] **Step 1: 运行数据测试确认剩余八名角色**

Run:

```bash
npx vitest run src/content/chinesePresentation.test.ts
```

Expected: FAIL，只剩 `railgunner`、`void-fiend`、`seeker`、`chef`、`false-son`、`operator`、`drifter`、`heretic` 及公共页面文案的英文残留。

- [ ] **Step 2: 翻译扩展内容机制词与技能引用**

沿用 Task 3 的字段范围，并统一以下术语：

| 原文 | 中文展示 |
| --- | --- |
| `Corruption` | `腐化值` |
| `Growth` | `成长` |
| `Junk` | `垃圾资源` |
| `Weak Point` | `弱点` |
| `Supercharge` | `超级充能` |
| `Meditate` | 使用对应技能的 `nameZh` |
| `Drone` | `无人机` |
| `Visions / Hooks / Strides / Essence` | 四件异端系列物品的 `nameZh` |

`CHEF` 在角色可见名称中使用既有 `nameZh`“大厨”；`False Son`、`Operator`、`Drifter`、`Heretic` 均只显示各自中文名。

- [ ] **Step 3: 运行内容与签名测试**

Run:

```bash
npx vitest run src/content/chinesePresentation.test.ts src/content/survivors/survivors.test.ts
```

Expected: 所有 19 份攻略的数据级中文扫描 PASS；角色顺序、技能签名、统率路线和物品分类测试 PASS。

- [ ] **Step 4: 提交扩展内容翻译**

```bash
git add src/content/survivors/sotv.ts src/content/survivors/sots.ts src/content/survivors/ac.ts src/content/survivors/special.ts src/content/chinesePresentation.test.ts src/content/survivors/survivors.test.ts
git commit -m "content: translate DLC survivor guides to Chinese"
```

### Task 5: 中文化页脚、元数据和项目说明

**Files:**
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/SiteFooter.test.tsx`
- Modify: `index.html`
- Modify: `src/document.test.ts`
- Modify: `PRODUCT.md`
- Modify: `README.md`
- Modify: `scripts/documentation.test.ts`

- [ ] **Step 1: 写页脚和文档的失败断言**

在页脚测试中要求适用范围只显示四个中文名称，来源标签使用“合金意念官方页面”“维基权利与许可说明”，归属说明使用“《雨中冒险 2》维基”。

在 `src/document.test.ts` 中加入：

```ts
expect(indexHtml).not.toContain('Alloyed Collective')
expect(indexHtml).toContain('合金意念')
```

在 `scripts/documentation.test.ts` 中要求 `PRODUCT.md` 明确包含“页面只显示中文”和“英文搜索”，README 同样描述该行为。

- [ ] **Step 2: 运行聚焦测试并确认失败**

Run:

```bash
npx vitest run src/components/SiteFooter.test.tsx src/document.test.ts scripts/documentation.test.ts
```

Expected: FAIL，原因是页脚仍显示英文 DLC 名、缩写和英文维基品牌文字，HTML 与产品说明尚未更新。

- [ ] **Step 3: 实现中文页脚与元数据**

`SiteFooter.tsx` 的适用范围只渲染 `dlc.nameZh`：

```tsx
{siteMetadata.dlcScope.map((dlc, index) => (
  <Fragment key={dlc.id}>
    {index > 0 ? '、' : null}
    {dlc.nameZh}
  </Fragment>
))}
```

将 `Alloyed Collective 官方页面` 改成“合金意念官方页面”，`Wiki 权利与许可说明` 改成“维基权利与许可说明”，归属说明改为“图标取自《雨中冒险 2》维基的对应文件页”。外部 URL 保持不变。

从 `index.html` 的描述中移除 `（Alloyed Collective）`。

- [ ] **Step 4: 更新产品说明**

`PRODUCT.md` 的用户与设计原则改为：页面只显示中文，内部英文名称用于英文搜索、资源匹配和维护；删除“中文名、英文名总是共同出现”。README 增加“页面为全中文展示，输入英文角色名仍可搜索”的使用说明。

- [ ] **Step 5: 运行聚焦测试并提交**

Run:

```bash
npx vitest run src/components/SiteFooter.test.tsx src/document.test.ts scripts/documentation.test.ts src/content/chinesePresentation.test.ts
```

Expected: PASS。

```bash
git add src/components/SiteFooter.tsx src/components/SiteFooter.test.tsx index.html src/document.test.ts PRODUCT.md README.md scripts/documentation.test.ts
git commit -m "docs: align metadata with Chinese-only presentation"
```

### Task 6: 整站检查、代码复核与公开发布

**Files:**
- Verify: all modified files
- Verify: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: 运行完整本地门禁**

Run:

```bash
npm run check
npm run assets:check
git diff --check
git status --short
```

Expected: 所有测试、类型检查、Vite 生产构建和 Pages 子路径校验 PASS；221 个图标通过；没有空白错误；工作区只包含预期提交或完全干净。

- [ ] **Step 2: 检查英文搜索与全部路由**

运行开发服务器后，在 1440 像素和 320 像素视口验证：

```text
首页：输入 Acrid → 只显示“呛鼻毒师”，页面不显示 Acrid
筛选：中文全称按钮返回正确角色数量
详情：呛鼻毒师页保持 8 个主章节，技能、物品、统率、月球分组只显示中文
官方专名：MUL-T 与 REX 各只显示一次，不并列第二名称
资源：无断图、无横向溢出、浏览器控制台无警告或错误
```

- [ ] **Step 3: 请求独立代码复核**

复核范围为设计提交 `ba1ffd3` 之后的全部实现提交。审阅者必须检查：可见英文白名单是否过宽、19 份正文是否保持原构筑语义、英文搜索是否保留、无障碍名称是否中文、移动端布局和 Pages 配置是否未回归。

Expected: 无 Critical 或 Important；发现的问题修复后重新运行完整门禁。

- [ ] **Step 4: 推送并等待 GitHub Pages**

```bash
git push origin main
$latestRunId = gh run list --repo citizen204/ror2-build-guide-cn --workflow deploy-pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch $latestRunId --repo citizen204/ror2-build-guide-cn --exit-status --interval 5
```

Expected: build 与 deploy 两个任务均成功。

- [ ] **Step 5: 验证公开网站**

检查：

```text
https://citizen204.github.io/ror2-build-guide-cn/
```

Expected: HTTP 200；真实浏览器中的首页和角色详情符合中文展示契约；英文搜索仍有效；公开仓库与本地 `HEAD` 一致。
