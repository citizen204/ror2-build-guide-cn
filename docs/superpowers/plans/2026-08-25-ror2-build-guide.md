# Risk of Rain 2 Full Survivor Build Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publicly publish a mobile-friendly Chinese Risk of Rain 2 guide covering all 18 selectable survivors plus the special Heretic transformation, with solo and co-op builds, bilingual names, icons, Command routes, Void items, Lunar items, and gameplay explanations.

**Architecture:** A React + TypeScript + Vite static application uses HashRouter so survivor links refresh safely on GitHub Pages. Typed survivor and item modules feed a searchable home page and a shared survivor-detail template; validation tests reject incomplete guides, invalid references, duplicate IDs, and missing local assets before deployment.

**Tech Stack:** React, TypeScript, Vite, React Router, Vitest, Testing Library, CSS, GitHub Actions, GitHub Pages.

---

## File map

Create these focused units:

- `package.json` — scripts and pinned project dependencies.
- `vite.config.ts` — GitHub Pages base path and Vitest configuration.
- `src/main.tsx` — browser entry point and HashRouter.
- `src/App.tsx` — route table and global shell.
- `src/domain/guide.ts` — guide, item, skill, source, and DLC types.
- `src/domain/validateGuideData.ts` — cross-file content validation.
- `src/domain/search.ts` — bilingual search and DLC filtering.
- `src/domain/assets.ts` — base-path-safe local asset URLs.
- `src/content/items.ts` — canonical bilingual item/equipment catalogue.
- `src/content/sources.ts` — visible source list and verification dates.
- `src/content/survivors/base.ts` — 11 base-game survivor guides.
- `src/content/survivors/sotv.ts` — Railgunner and Void Fiend guides.
- `src/content/survivors/sots.ts` — Seeker, CHEF, and False Son guides.
- `src/content/survivors/ac.ts` — Operator and Drifter guides.
- `src/content/survivors/special.ts` — Heretic transformation guide.
- `src/content/survivors/index.ts` — full 19-entry export.
- `src/components/SiteHeader.tsx` — site identity and version badge.
- `src/components/SearchFilters.tsx` — search input and DLC controls.
- `src/components/SurvivorCard.tsx` — home-page survivor summary.
- `src/components/SkillLoadout.tsx` — bilingual skill row and unlock status.
- `src/components/ItemGroup.tsx` — rarity-aware item cards and explanations.
- `src/components/GuideSection.tsx` — consistent section heading and anchor.
- `src/components/SiteFooter.tsx` — scope, version date, and sources.
- `src/pages/HomePage.tsx` — home content, filtering, and empty state.
- `src/pages/SurvivorPage.tsx` — full shared guide template.
- `src/pages/NotFoundPage.tsx` — invalid-route recovery.
- `src/styles/tokens.css` — color, type, spacing, and rarity tokens.
- `src/styles/global.css` — layout, cards, responsive rules, and focus states.
- `scripts/fetch-assets.mjs` — download declared wiki images into local assets.
- `src/content/assets.json` — declared image source names and attribution URLs.
- `src/test/setup.ts` — Testing Library setup.
- `src/domain/*.test.ts` and `src/pages/*.test.tsx` — behavior and completeness tests.
- `public/assets/survivors/**`, `public/assets/skills/**`, `public/assets/items/**` — locally served game icons.
- `.github/workflows/deploy-pages.yml` — build and GitHub Pages deployment.
- `README.md` — usage, maintenance, data source, and attribution notes.

## Task 1: Scaffold the tested static application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Install the application toolchain without running an initializer over the committed docs**

Run from the repository root:

```powershell
npm init --yes
npm install react react-dom react-router-dom
npm install --save-dev typescript vite @vitejs/plugin-react @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `package.json` and `package-lock.json` exist and `docs/` remains unchanged. Create the remaining files in this task exactly as specified rather than accepting generated starter content.

- [ ] **Step 2: Add test scripts and Vitest configuration**

Set the `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "check": "npm run test && npm run build"
  }
}
```

Use this project configuration:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ror2-build-guide-cn/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Write a failing shell test**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the guide title', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: '雨中冒险 2 全角色构筑' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run the test and verify the starter fails**

Run: `npm test -- src/App.test.tsx`  
Expected: FAIL because the starter does not contain the guide heading.

- [ ] **Step 5: Implement the minimal application shell**

```tsx
// src/App.tsx
export default function App() {
  return <main><h1>雨中冒险 2 全角色构筑</h1></main>
}
```

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode><HashRouter><App /></HashRouter></StrictMode>,
)
```

- [ ] **Step 6: Verify and commit the scaffold**

Run: `npm run check`  
Expected: one passing test and a successful production build.

```powershell
git add package.json package-lock.json index.html tsconfig*.json vite.config.ts src
git commit -m "chore: scaffold tested guide application"
```

## Task 2: Define the guide domain and reject incomplete data

**Files:**
- Create: `src/domain/guide.ts`
- Create: `src/domain/validateGuideData.ts`
- Create: `src/domain/validateGuideData.test.ts`

- [ ] **Step 1: Write failing validation tests for the exact roster**

```ts
// src/domain/validateGuideData.test.ts
import { describe, expect, it } from 'vitest'
import { EXPECTED_SURVIVOR_SLUGS, validateGuideData } from './validateGuideData'

describe('validateGuideData', () => {
  it('tracks all 18 selectable survivors and Heretic', () => {
    expect(EXPECTED_SURVIVOR_SLUGS).toEqual([
      'commando', 'huntress', 'bandit', 'mul-t', 'engineer', 'artificer',
      'mercenary', 'rex', 'loader', 'acrid', 'captain', 'railgunner',
      'void-fiend', 'seeker', 'chef', 'false-son', 'operator', 'drifter', 'heretic',
    ])
  })

  it('rejects duplicate survivor slugs and unknown item references', () => {
    const result = validateGuideData([], [])
    expect(result).toContain('缺少 19 名角色的完整攻略')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/domain/validateGuideData.test.ts`  
Expected: FAIL because the domain modules do not exist.

- [ ] **Step 3: Define the complete shared types**

```ts
// src/domain/guide.ts
export type DlcId = 'base' | 'sotv' | 'sots' | 'ac' | 'special'
export type ItemTier = 'common' | 'uncommon' | 'legendary' | 'boss' | 'equipment' | 'lunar' | 'void'
export type Recommendation = 'core' | 'recommended' | 'conditional' | 'avoid'

export interface SkillChoice {
  slot: 'primary' | 'secondary' | 'utility' | 'special' | 'passive'
  nameZh: string
  nameEn: string
  icon: string
  unlock: 'default' | 'unlock-required' | 'transformation'
  reason: string
}

export interface ItemDefinition {
  id: string
  nameZh: string
  nameEn: string
  tier: ItemTier
  icon: string
  corrupts?: string
}

export interface ItemPick {
  itemId: string
  recommendation: Recommendation
  stacks: string
  role: string
  synergy: string
  alternative?: string
}

export interface BuildSection {
  common: ItemPick[]
  uncommon: ItemPick[]
  legendary: ItemPick[]
  boss: ItemPick[]
  equipment: ItemPick[]
}

export interface StageRoute {
  phase: '前期' | '中期' | '后期'
  picks: string[]
  explanation: string
}

export interface SurvivorGuide {
  slug: string
  nameZh: string
  nameEn: string
  dlc: DlcId
  portrait: string
  role: string
  difficulty: 1 | 2 | 3 | 4 | 5
  summary: string
  skills: SkillChoice[]
  buildLogic: string[]
  solo: BuildSection
  coopAdjustments: string[]
  commandRoute: StageRoute[]
  voidItems: ItemPick[]
  lunarItems: ItemPick[]
  combatNotes: { title: string; body: string }[]
  sourceIds: string[]
  verifiedOn: string
}
```

- [ ] **Step 4: Implement explicit cross-file validation**

```ts
// src/domain/validateGuideData.ts
import type { ItemDefinition, ItemPick, SurvivorGuide } from './guide'

export const EXPECTED_SURVIVOR_SLUGS = [
  'commando', 'huntress', 'bandit', 'mul-t', 'engineer', 'artificer',
  'mercenary', 'rex', 'loader', 'acrid', 'captain', 'railgunner',
  'void-fiend', 'seeker', 'chef', 'false-son', 'operator', 'drifter', 'heretic',
] as const

const allPicks = (guide: SurvivorGuide): ItemPick[] => [
  ...guide.solo.common, ...guide.solo.uncommon, ...guide.solo.legendary,
  ...guide.solo.boss, ...guide.solo.equipment, ...guide.voidItems, ...guide.lunarItems,
]

export function validateGuideData(guides: SurvivorGuide[], items: ItemDefinition[]): string[] {
  const errors: string[] = []
  const guideSlugs = guides.map((guide) => guide.slug)
  const itemIds = new Set(items.map((item) => item.id))

  if (guideSlugs.length !== EXPECTED_SURVIVOR_SLUGS.length) errors.push('缺少 19 名角色的完整攻略')
  if (new Set(guideSlugs).size !== guideSlugs.length) errors.push('角色 slug 重复')
  for (const slug of EXPECTED_SURVIVOR_SLUGS) {
    if (!guideSlugs.includes(slug)) errors.push(`缺少角色：${slug}`)
  }
  for (const guide of guides) {
    if (guide.skills.length < 4) errors.push(`${guide.slug} 的技能配置不完整`)
    if (guide.commandRoute.length !== 3) errors.push(`${guide.slug} 的统率路线必须包含三个阶段`)
    if (!guide.coopAdjustments.length) errors.push(`${guide.slug} 缺少联机调整`)
    if (!guide.voidItems.length || !guide.lunarItems.length) errors.push(`${guide.slug} 缺少虚空或月球物品建议`)
    for (const pick of allPicks(guide)) {
      if (!itemIds.has(pick.itemId)) errors.push(`${guide.slug} 引用了未知物品：${pick.itemId}`)
    }
  }
  return errors
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/domain/validateGuideData.test.ts`  
Expected: both tests pass.

```powershell
git add src/domain
git commit -m "feat: define and validate guide data"
```

## Task 3: Research the current game version and author the canonical item catalogue

**Files:**
- Create: `research/version-and-roster.md`
- Create: `research/build-notes/commando.md`
- Create: `research/build-notes/huntress.md`
- Create: `research/build-notes/bandit.md`
- Create: `research/build-notes/mul-t.md`
- Create: `research/build-notes/engineer.md`
- Create: `research/build-notes/artificer.md`
- Create: `research/build-notes/mercenary.md`
- Create: `research/build-notes/rex.md`
- Create: `research/build-notes/loader.md`
- Create: `research/build-notes/acrid.md`
- Create: `research/build-notes/captain.md`
- Create: `research/build-notes/railgunner.md`
- Create: `research/build-notes/void-fiend.md`
- Create: `research/build-notes/seeker.md`
- Create: `research/build-notes/chef.md`
- Create: `research/build-notes/false-son.md`
- Create: `research/build-notes/operator.md`
- Create: `research/build-notes/drifter.md`
- Create: `research/build-notes/heretic.md`
- Create: `src/content/sources.ts`
- Create: `src/content/items.ts`

- [ ] **Step 1: Lock the supported roster and version date**

Record these verified facts in `research/version-and-roster.md`:

- Supported roster: 11 base survivors, 2 Survivors of the Void survivors, 3 Seekers of the Storm survivors, 2 Alloyed Collective survivors, plus Heretic as a special transformation; total 19 guide entries.
- Hallowed Concepts is excluded because its Steam page says it is not yet available and its release date is unannounced on 2026-08-25.
- Primary release sources: Steam pages and official Steam announcements for app `632360`.
- Detailed mechanics and icon names: `https://riskofrain2.wiki.gg/wiki/Survivors`, individual survivor pages, item pages, and skill pages.
- Each factual claim records a URL and access date; build recommendations are labeled editorial judgments.

- [ ] **Step 2: Research every survivor using one fixed evidence template**

Each `research/build-notes/<slug>.md` must contain these completed headings: current skills and unlocks, proc behavior, damage pattern, movement/survival, item interactions, solo plan, co-op conflicts, Command route, Void conversions, Lunar trade-offs, equipment, combat loop, and source URLs. Verify skills and item effects against the current wiki and cross-check patch-sensitive claims against official notes.

- [ ] **Step 3: Write the canonical source and item modules**

```ts
// src/content/sources.ts
export const sources = [
  { id: 'steam-base', label: 'Risk of Rain 2 Steam', url: 'https://store.steampowered.com/app/632360/', verifiedOn: '2026-08-25' },
  { id: 'steam-ac', label: 'Alloyed Collective Steam', url: 'https://store.steampowered.com/app/2781620/', verifiedOn: '2026-08-25' },
  { id: 'wiki-survivors', label: 'Risk of Rain 2 Wiki — Survivors', url: 'https://riskofrain2.wiki.gg/wiki/Survivors', verifiedOn: '2026-08-25' },
  { id: 'steam-hallowed', label: 'Hallowed Concepts Steam', url: 'https://store.steampowered.com/app/3055670/', verifiedOn: '2026-08-25' },
] as const
```

Populate `src/content/items.ts` with one `ItemDefinition` for every item referenced by any of the 19 guides. Use stable kebab-case IDs, verified Chinese and English names, rarity, local icon path, and `corrupts` for each Void item. Do not add unused catalogue entries.

- [ ] **Step 4: Add a catalogue integrity test**

```ts
// src/content/items.test.ts
import { describe, expect, it } from 'vitest'
import { items } from './items'

describe('item catalogue', () => {
  it('uses unique IDs and bilingual names', () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
    for (const item of items) {
      expect(item.nameZh.trim()).not.toBe('')
      expect(item.nameEn.trim()).not.toBe('')
      expect(item.icon).toMatch(/^assets\/items\/.+\.png$/)
    }
  })
})
```

- [ ] **Step 5: Verify research artifacts and commit**

Run: `npm test -- src/content/items.test.ts`  
Expected: the catalogue integrity test passes.

```powershell
git add research src/content/items.ts src/content/items.test.ts src/content/sources.ts
git commit -m "content: verify roster and item catalogue"
```

## Task 4: Author all 19 survivor guides in DLC-sized batches

**Files:**
- Create: `src/content/survivors/base.ts`
- Create: `src/content/survivors/sotv.ts`
- Create: `src/content/survivors/sots.ts`
- Create: `src/content/survivors/ac.ts`
- Create: `src/content/survivors/special.ts`
- Create: `src/content/survivors/index.ts`
- Create: `src/content/survivors/survivors.test.ts`

- [ ] **Step 1: Write the failing completeness test**

```ts
// src/content/survivors/survivors.test.ts
import { describe, expect, it } from 'vitest'
import { items } from '../items'
import { survivors } from './index'
import { EXPECTED_SURVIVOR_SLUGS, validateGuideData } from '../../domain/validateGuideData'

describe('survivor guides', () => {
  it('contains the complete current roster in stable order', () => {
    expect(survivors.map((guide) => guide.slug)).toEqual(EXPECTED_SURVIVOR_SLUGS)
  })

  it('has no incomplete sections or invalid item references', () => {
    expect(validateGuideData(survivors, items)).toEqual([])
  })

  it('contains readable explanations instead of bare item lists', () => {
    for (const guide of survivors) {
      expect(guide.summary.length).toBeGreaterThan(30)
      expect(guide.buildLogic.join('').length).toBeGreaterThan(120)
      expect(guide.combatNotes.length).toBeGreaterThanOrEqual(4)
      for (const pick of [...guide.solo.common, ...guide.solo.uncommon, ...guide.solo.legendary, ...guide.solo.boss]) {
        expect(pick.role.length).toBeGreaterThan(10)
        expect(pick.synergy.length).toBeGreaterThan(10)
      }
    }
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/content/survivors/survivors.test.ts`  
Expected: FAIL because the survivor modules do not exist.

- [ ] **Step 3: Write the base-game batch**

Add complete typed entries, in this exact order, for Commando, Huntress, Bandit, MUL-T, Engineer, Artificer, Mercenary, REX, Loader, Acrid, and Captain. Every entry must use the research note for its skills and reasoning, contain solo and co-op advice, three Command phases, explicit Void and Lunar recommendations, four combat situations, bilingual names, local image paths, and source IDs.

Run: `npm test -- src/content/survivors/survivors.test.ts`  
Expected: FAIL only for the eight not-yet-authored non-base entries.

- [ ] **Step 4: Write the Survivors of the Void batch**

Add complete Railgunner and Void Fiend entries. Explicitly distinguish Void Fiend corruption management from ordinary Void-item recommendations, and document conversions that change healing behavior.

- [ ] **Step 5: Write the Seekers of the Storm batch**

Add complete Seeker, CHEF, and False Son entries. CHEF uses a strongest-current-patch loadout rather than assuming the previously discussed alternate “Freezer” skill; each required alternate skill is clearly marked for Rainshift search.

- [ ] **Step 6: Write the Alloyed Collective batch**

Add complete Operator and Drifter entries using current post-release mechanics and patch notes. Operator’s drone economy and Drifter’s Junk/temporary-item mechanics each receive dedicated co-op resource-conflict notes.

- [ ] **Step 7: Write the special Heretic guide and final export**

Add Heretic as `dlc: 'special'`, explain that she is formed by collecting all four Heresy items rather than selected normally, and treat those transformation items separately from optional Lunar recommendations.

```ts
// src/content/survivors/index.ts
import { baseSurvivors } from './base'
import { sotvSurvivors } from './sotv'
import { sotsSurvivors } from './sots'
import { acSurvivors } from './ac'
import { specialSurvivors } from './special'

export const survivors = [
  ...baseSurvivors,
  ...sotvSurvivors,
  ...sotsSurvivors,
  ...acSurvivors,
  ...specialSurvivors,
]
```

- [ ] **Step 8: Run the complete content suite and commit**

Run: `npm test -- src/content`  
Expected: roster, guide completeness, explanation-depth, and catalogue tests all pass.

```powershell
git add src/content/survivors
git commit -m "content: add all survivor build guides"
```

## Task 5: Fetch and verify local portraits, skills, and item icons

**Files:**
- Create: `src/content/assets.json`
- Create: `scripts/fetch-assets.mjs`
- Create: `src/content/assets.test.ts`
- Create: `public/assets/survivors/**`
- Create: `public/assets/skills/**`
- Create: `public/assets/items/**`

- [ ] **Step 1: Declare every image and its attribution**

`src/content/assets.json` contains records with `localPath`, the exact wiki file name, `sourcePage`, and `kind`. Include one PNG portrait per guide, every selected skill icon, and every item in `items.ts`.

- [ ] **Step 2: Implement the deterministic downloader**

```js
// scripts/fetch-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const manifestUrl = new URL('../src/content/assets.json', import.meta.url)
const assets = JSON.parse(await readFile(manifestUrl, 'utf8'))

for (const asset of assets) {
  const redirect = `https://riskofrain2.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(asset.wikiFile)}`
  const response = await fetch(redirect, { headers: { 'user-agent': 'ror2-build-guide-cn/1.0 asset fetcher' } })
  if (!response.ok) throw new Error(`${asset.localPath}: HTTP ${response.status}`)
  const output = path.join('public', asset.localPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, Buffer.from(await response.arrayBuffer()))
}
```

- [ ] **Step 3: Fetch the assets**

Run: `npm run assets:fetch`  
Expected: every declared image is downloaded under `public/assets` and no HTTP error occurs.

- [ ] **Step 4: Write and run the missing-file test**

```ts
// src/content/assets.test.ts
// @vitest-environment node
import { existsSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const assets = JSON.parse(readFileSync('src/content/assets.json', 'utf8')) as { localPath: string }[]

describe('local guide assets', () => {
  it('has every declared asset on disk', () => {
    for (const asset of assets) expect(existsSync(`public/${asset.localPath}`), asset.localPath).toBe(true)
  })
})
```

Run: `npm test -- src/content/assets.test.ts`  
Expected: all declared local files exist.

- [ ] **Step 5: Commit assets and attribution data**

```powershell
git add src/content/assets.json src/content/assets.test.ts scripts public/assets package.json package-lock.json
git commit -m "assets: add attributed local game icons"
```

## Task 6: Build bilingual search and DLC filtering with tests

**Files:**
- Create: `src/domain/search.ts`
- Create: `src/domain/search.test.ts`

- [ ] **Step 1: Write failing bilingual search tests**

```ts
// src/domain/search.test.ts
import { describe, expect, it } from 'vitest'
import { filterSurvivors } from './search'
import type { SurvivorGuide } from './guide'

const sample = [
  { slug: 'acrid', nameZh: '呛鼻毒师', nameEn: 'Acrid', dlc: 'base' },
  { slug: 'void-fiend', nameZh: '虚空恶鬼', nameEn: 'Void Fiend', dlc: 'sotv' },
] as SurvivorGuide[]

describe('filterSurvivors', () => {
  it('matches Chinese and case-insensitive English', () => {
    expect(filterSurvivors(sample, '毒师', 'all').map((x) => x.slug)).toEqual(['acrid'])
    expect(filterSurvivors(sample, 'VOID', 'all').map((x) => x.slug)).toEqual(['void-fiend'])
  })

  it('combines text and DLC filters', () => {
    expect(filterSurvivors(sample, '', 'sotv').map((x) => x.slug)).toEqual(['void-fiend'])
  })
})
```

- [ ] **Step 2: Verify failure, implement, and re-run**

Run: `npm test -- src/domain/search.test.ts`  
Expected: FAIL because `filterSurvivors` does not exist.

```ts
// src/domain/search.ts
import type { DlcId, SurvivorGuide } from './guide'

export type DlcFilter = DlcId | 'all'

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim()

export function filterSurvivors(guides: SurvivorGuide[], query: string, dlc: DlcFilter) {
  const needle = normalize(query)
  return guides.filter((guide) => {
    const matchesDlc = dlc === 'all' || guide.dlc === dlc
    const haystack = normalize(`${guide.nameZh} ${guide.nameEn} ${guide.slug}`)
    return matchesDlc && haystack.includes(needle)
  })
}
```

Run: `npm test -- src/domain/search.test.ts`  
Expected: both search tests pass.

- [ ] **Step 3: Commit**

```powershell
git add src/domain/search.ts src/domain/search.test.ts
git commit -m "feat: add bilingual survivor filtering"
```

## Task 7: Build the recognizable home page slice

**Files:**
- Create: `src/domain/assets.ts`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SearchFilters.tsx`
- Create: `src/components/SurvivorCard.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/HomePage.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the failing home interaction test**

```tsx
// src/pages/HomePage.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('searches by English name and reports the result count', async () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    await userEvent.type(screen.getByRole('searchbox'), 'Acrid')
    expect(screen.getByRole('link', { name: /呛鼻毒师.*Acrid/i })).toBeInTheDocument()
    expect(screen.getByText('找到 1 名角色')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Verify failure and implement components**

Run: `npm test -- src/pages/HomePage.test.tsx`  
Expected: FAIL because `HomePage` does not exist.

Implement controlled search and DLC buttons in `SearchFilters`, render filtered `SurvivorCard` links to `/survivors/<slug>`, show a result count, and show a clear-search empty state. Use this base-safe helper:

```ts
// src/domain/assets.ts
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
```

- [ ] **Step 3: Add the home route**

```tsx
// src/App.tsx
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './styles/tokens.css'
import './styles/global.css'

export default function App() {
  return <Routes><Route path="/" element={<HomePage />} /></Routes>
}
```

- [ ] **Step 4: Apply the visual foundation**

Start `tokens.css` with explicit accessible tokens:

```css
:root {
  color-scheme: dark;
  --bg: #090d12;
  --surface: #111923;
  --surface-2: #182431;
  --text: #f3f7fa;
  --muted: #a8b6c3;
  --accent: #f3b64b;
  --focus: #72d5ff;
  --common: #d8e1e8;
  --uncommon: #72c58c;
  --legendary: #ff706c;
  --boss: #ffd16d;
  --lunar: #72c7ff;
  --void: #d878ff;
  --radius: 14px;
}
```

Use responsive CSS grid with one column below 620px, two columns on medium screens, and four columns on wide screens. Preserve a visible `:focus-visible` outline and support `prefers-reduced-motion`.

- [ ] **Step 5: Verify, build, and commit**

Run: `npm test -- src/pages/HomePage.test.tsx`  
Expected: search interaction passes.

Run: `npm run build`  
Expected: successful production build with the configured base path.

```powershell
git add src
git commit -m "feat: add searchable survivor home page"
```

## Task 8: Build the complete survivor detail template

**Files:**
- Create: `src/components/GuideSection.tsx`
- Create: `src/components/SkillLoadout.tsx`
- Create: `src/components/ItemGroup.tsx`
- Create: `src/pages/SurvivorPage.tsx`
- Create: `src/pages/SurvivorPage.test.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing detail-page tests**

```tsx
// src/pages/SurvivorPage.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import SurvivorPage from './SurvivorPage'

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes><Route path="/survivors/:slug" element={<SurvivorPage />} /></Routes>
  </MemoryRouter>,
)

describe('SurvivorPage', () => {
  it('renders skills, solo, co-op, Command, Void, and Lunar sections', () => {
    renderAt('/survivors/acrid')
    for (const name of ['推荐技能', '构筑逻辑', '单人构筑', '联机调整', '统率神器路线', '虚空物品', '月球物品', '打法速记']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('offers recovery for an unknown survivor', () => {
    renderAt('/survivors/not-a-survivor')
    expect(screen.getByRole('link', { name: '返回角色首页' })).toHaveAttribute('href', '/')
  })
})
```

- [ ] **Step 2: Verify failure and implement the shared template**

Run: `npm test -- src/pages/SurvivorPage.test.tsx`  
Expected: FAIL because the detail page does not exist.

Implement `SkillLoadout` with icon, bilingual names, slot, unlock badge, and reason. Implement `ItemGroup` by joining each `ItemPick.itemId` to `items.ts`; display rarity, stacks, role, synergy, and alternative. `SurvivorPage` finds the guide from `useParams`, renders all required sections in the approved order, and creates previous/home/next navigation from the stable survivor array.

- [ ] **Step 3: Add HashRouter-compatible routes**

```tsx
// src/App.tsx route body
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/survivors/:slug" element={<SurvivorPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

- [ ] **Step 4: Add mobile navigation and rarity-aware styling**

Use sticky desktop chapter navigation only when enough horizontal space exists. On narrow screens, render a horizontally scrollable chapter strip and a fixed-size back-to-top button that does not cover body text. Every rarity card includes both a color treatment and a textual tier label.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/pages/SurvivorPage.test.tsx`  
Expected: required sections and unknown-route recovery pass.

```powershell
git add src/components src/pages src/App.tsx src/styles/global.css
git commit -m "feat: add complete survivor guide pages"
```

## Task 9: Add metadata, sources, accessibility checks, and documentation

**Files:**
- Create: `src/components/SiteFooter.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html`
- Create: `src/App.accessibility.test.tsx`
- Create: `README.md`

- [ ] **Step 1: Write failing public-information tests**

```tsx
// src/App.accessibility.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('public guide information', () => {
  it('shows verification date and source links without exposing email', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByText(/最后核对：2026-08-25/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /资料来源/ })).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('@outlook.com')
  })
})
```

- [ ] **Step 2: Verify failure and implement site-wide information**

Run: `npm test -- src/App.accessibility.test.tsx`  
Expected: FAIL before the footer exists.

Add a site footer with last verification date, DLC scope, source links, fan-guide disclaimer, and game-asset attribution. Set `lang="zh-CN"`, page title, description, theme color, canonical GitHub Pages URL, and Open Graph text in `index.html`; do not include the provided email.

- [ ] **Step 3: Write the maintenance README**

Document the live URL, supported 19-entry roster, local commands, guide data schema, asset refresh workflow, version update workflow, citations, and the fact that Hallowed Concepts is excluded until public release.

- [ ] **Step 4: Verify and commit**

Run: `npm run check`  
Expected: all tests pass and the production build completes.

```powershell
git add src index.html README.md
git commit -m "docs: add sources accessibility and maintenance guide"
```

## Task 10: Configure and verify GitHub Pages deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Add the Pages workflow**

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run check
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Run the final local acceptance suite**

Run: `npm run check`  
Expected: all behavior, content, asset, and accessibility tests pass; production build succeeds.

Run: `git status --short`  
Expected: only the new workflow is uncommitted.

- [ ] **Step 3: Commit deployment configuration**

```powershell
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy guide to GitHub Pages"
```

- [ ] **Step 4: Verify the requested GitHub identity**

Run: `gh auth status`  
Expected: logged in to GitHub as `citizen204`. If a different account is active, stop before creating a repository and ask the user to switch accounts.

- [ ] **Step 5: Create the requested public repository and push**

Run:

```powershell
gh repo create citizen204/ror2-build-guide-cn --public --source . --remote origin --push
```

Expected: public repository `https://github.com/citizen204/ror2-build-guide-cn` exists and `main` is pushed.

- [ ] **Step 6: Enable and monitor GitHub Pages**

Run:

```powershell
gh api --method POST repos/citizen204/ror2-build-guide-cn/pages -f build_type=workflow
gh run list --repo citizen204/ror2-build-guide-cn --workflow deploy-pages.yml --limit 1
gh run watch --repo citizen204/ror2-build-guide-cn --exit-status
```

Expected: the Pages workflow succeeds. If Pages already exists, treat the enable call's “already exists” response as non-fatal and continue to workflow monitoring.

- [ ] **Step 7: Verify public URLs**

Open and verify:

- `https://citizen204.github.io/ror2-build-guide-cn/`
- `https://citizen204.github.io/ror2-build-guide-cn/#/survivors/acrid`
- `https://citizen204.github.io/ror2-build-guide-cn/#/survivors/operator`

Expected: home, base-game detail, and AC detail pages load with local images; refreshing both Hash routes remains on the same guide.

- [ ] **Step 8: Record the deployed URL**

If the live URL was not already included, add it to `README.md`, run `npm run check`, commit with `docs: add live guide URL`, and push `main`. Confirm the follow-up Pages workflow succeeds.

## Final acceptance checklist

- [ ] Exactly 19 guide entries: 18 currently selectable survivors plus Heretic.
- [ ] Every guide contains bilingual skills, unlock status, build logic, item effects, solo build, co-op adjustments, Command route, Void items, Lunar items, equipment, and combat notes.
- [ ] Every used item and skill has a local icon and source attribution.
- [ ] Search matches Chinese and English; DLC filtering includes base, SOTV, SOTS, AC, and special.
- [ ] No user email appears in rendered pages, metadata, or README.
- [ ] All automated tests and production build pass locally and in GitHub Actions.
- [ ] Public repository and GitHub Pages URL are reachable without signing in.
