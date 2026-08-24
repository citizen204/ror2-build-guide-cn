import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GuideSection } from '../components/GuideSection'
import { ItemGroup } from '../components/ItemGroup'
import { SkillLoadout } from '../components/SkillLoadout'
import { items } from '../content/items'
import { survivors } from '../content/survivors'
import { assetUrl } from '../domain/assets'
import type { ItemDefinition, StageRoute, SurvivorGuide } from '../domain/guide'
import { NotFoundPage } from './NotFoundPage'

const chapters = [
  { id: 'skills', label: '推荐技能' },
  { id: 'build-logic', label: '构筑逻辑' },
  { id: 'solo-build', label: '单人构筑' },
  { id: 'coop-build', label: '联机调整' },
  { id: 'command-route', label: '统率神器路线' },
  { id: 'void-items', label: '虚空物品' },
  { id: 'lunar-items', label: '月球物品' },
  { id: 'combat-notes', label: '打法速记' },
] as const

const itemById = new Map(items.map((item) => [item.id, item]))

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scrollToSection(id: string): void {
  const section = document.getElementById(id)
  if (!section) return

  section.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
  section.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
}

function scrollToTop(): void {
  const heading = document.getElementById('guide-top')
  if (!heading) return

  heading.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
  heading.focus({ preventScroll: true })
}

function CommandItem({ item }: { item: ItemDefinition }) {
  return (
    <li className="command-item">
      <img
        src={assetUrl(item.icon)}
        alt={`${item.nameZh}（${item.nameEn}）统率路线图标`}
        loading="lazy"
      />
      <span>
        <strong>{item.nameZh}</strong>
        <span lang="en">{item.nameEn}</span>
      </span>
    </li>
  )
}

function CommandPhase({ route }: { route: StageRoute }) {
  return (
    <li className="command-route__phase">
      <h3>{route.phase}</h3>
      <ul className="command-items" aria-label={`${route.phase}选装`}>
        {route.picks.map((itemId) => {
          const item = itemById.get(itemId)
          return item ? (
            <CommandItem item={item} key={itemId} />
          ) : (
            <li className="command-item command-item--missing" key={itemId}>
              未知物品：{itemId}
            </li>
          )
        })}
      </ul>
      <p>{route.explanation}</p>
    </li>
  )
}

function SurvivorIdentity({ guide }: { guide: SurvivorGuide }) {
  return (
    <header className="survivor-identity">
      <div className="survivor-identity__portrait">
        <img
          src={assetUrl(guide.portrait)}
          alt={`${guide.nameZh}（${guide.nameEn}）角色头像`}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="survivor-identity__content">
        <h1 id="guide-top" tabIndex={-1}>
          <span>{guide.nameZh}</span>{' '}
          <span lang="en">{guide.nameEn}</span>
        </h1>
        <div className="survivor-identity__meta">
          <span>{guide.role}</span>
          <span>操作难度：{guide.difficulty} / 5</span>
        </div>
        <p>{guide.summary}</p>
      </div>
    </header>
  )
}

function ChapterNavigation() {
  return (
    <nav className="chapter-nav" aria-label="攻略章节">
      <p className="chapter-nav__title">章节导航</p>
      <ol className="chapter-nav__list">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              aria-label={`前往${chapter.label}`}
              onClick={() => scrollToSection(chapter.id)}
            >
              {chapter.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function SurvivorPagination({ index }: { index: number }) {
  const previous = survivors[index - 1]
  const next = survivors[index + 1]

  return (
    <nav className="survivor-pagination" aria-label="角色翻页">
      <div className="survivor-pagination__edge survivor-pagination__edge--previous">
        {previous ? (
          <Link
            to={`/survivors/${previous.slug}`}
            aria-label={`上一个角色：${previous.nameZh} ${previous.nameEn}`}
          >
            <span>← 上一个角色</span>
            <strong>{previous.nameZh} · <span lang="en">{previous.nameEn}</span></strong>
          </Link>
        ) : null}
      </div>
      <Link className="survivor-pagination__home" to="/">返回角色首页</Link>
      <div className="survivor-pagination__edge survivor-pagination__edge--next">
        {next ? (
          <Link
            to={`/survivors/${next.slug}`}
            aria-label={`下一个角色：${next.nameZh} ${next.nameEn}`}
          >
            <span>下一个角色 →</span>
            <strong>{next.nameZh} · <span lang="en">{next.nameEn}</span></strong>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

export function SurvivorPage() {
  const { slug } = useParams()
  const guideIndex = survivors.findIndex((candidate) => candidate.slug === slug)
  const guide = survivors[guideIndex]

  useEffect(() => {
    if (!guide) return

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.getElementById('guide-top')?.focus({ preventScroll: true })
  }, [slug])

  if (!guide) return <NotFoundPage />

  return (
    <main className="guide-page page-shell">
      <Link className="guide-page__home" to="/">← 角色首页</Link>
      <SurvivorIdentity guide={guide} />
      <div className="guide-layout">
        <ChapterNavigation />
        <article className="guide-content" aria-label={`${guide.nameZh}完整构筑攻略`}>
          <GuideSection
            id="skills"
            title="推荐技能"
            intro={<p>优先采用下列稳定配置；标记为需要解锁或变身的选择会注明原因。</p>}
          >
            <SkillLoadout skills={guide.skills} />
          </GuideSection>

          <GuideSection id="build-logic" title="构筑逻辑">
            <ol className="logic-list">
              {guide.buildLogic.map((entry) => <li key={entry}>{entry}</li>)}
            </ol>
          </GuideSection>

          <GuideSection
            id="solo-build"
            title="单人构筑"
            intro={<p>以季风与天蚀的稳定通关为基准，数量是优先目标而非硬性上限。</p>}
          >
            <div className="item-groups">
              <ItemGroup title="白色物品" picks={guide.solo.common} />
              <ItemGroup title="绿色物品" picks={guide.solo.uncommon} />
              <ItemGroup title="红色物品" picks={guide.solo.legendary} />
              <ItemGroup title="首领物品" picks={guide.solo.boss} />
              <ItemGroup title="主动装备" picks={guide.solo.equipment} />
            </div>
          </GuideSection>

          <GuideSection
            id="coop-build"
            title="联机调整"
            intro={<p>保留角色必需品，同时把收益更高的资源交给合适队友。</p>}
          >
            <ul className="guidance-list" aria-label={`${guide.nameZh}联机调整`}>
              {guide.coopAdjustments.map((adjustment) => (
                <li key={adjustment}>{adjustment}</li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection
            id="command-route"
            title="统率神器路线"
            intro={<p>按阶段执行，先让角色循环成立，再放大触发与终局容错。</p>}
          >
            <ol className="command-route" aria-label="统率神器选装顺序">
              {guide.commandRoute.map((route) => <CommandPhase route={route} key={route.phase} />)}
            </ol>
          </GuideSection>

          <GuideSection
            id="void-items"
            title="虚空物品"
            intro={<p>虚空物品会永久腐化对应原物品；每项都写明被替换对象与取舍。</p>}
          >
            <ItemGroup title="虚空选择" picks={guide.voidItems} />
          </GuideSection>

          <GuideSection
            id="lunar-items"
            title="月球物品"
            intro={<p>先确认副作用能够被当前路线承受，再决定是否拾取。</p>}
          >
            <ItemGroup title="月球选择" picks={guide.lunarItems} />
          </GuideSection>

          <GuideSection id="combat-notes" title="打法速记">
            <ul className="combat-notes" aria-label={`${guide.nameZh}战斗场景`}>
              {guide.combatNotes.map((note) => (
                <li key={note.title}>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </li>
              ))}
            </ul>
          </GuideSection>

          <button
            className="back-to-top"
            type="button"
            aria-label="回到顶部"
            onClick={scrollToTop}
          >
            ↑ 回到顶部
          </button>
        </article>
      </div>
      <SurvivorPagination index={guideIndex} />
    </main>
  )
}
