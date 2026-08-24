import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from '../App'
import { ItemGroup } from '../components/ItemGroup'
import { EXPECTED_SURVIVOR_SLUGS } from '../domain/validateGuideData'

const scrollIntoView = vi.fn()

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: scrollIntoView,
})

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

function expectedAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

afterEach(cleanup)

beforeEach(() => {
  scrollIntoView.mockClear()
})

describe('complete survivor guide route', () => {
  test('renders Acrid identity and the fixed guide chapter sequence', () => {
    renderRoute('/survivors/acrid')

    expect(
      screen.getByRole('heading', { level: 1, name: '呛鼻毒师 Acrid' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '呛鼻毒师（Acrid）角色头像' }),
    ).toHaveAttribute('src', expectedAsset('assets/survivors/acrid.png'))
    expect(screen.getByText('百分比 Poison 削血、传播与外部伤害收尾')).toBeInTheDocument()
    expect(screen.getByText('操作难度：3 / 5')).toBeInTheDocument()
    expect(screen.getByText(/Poison 本身不能击杀，因此收尾能力比堆近战更关键/)).toBeInTheDocument()

    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      '推荐技能',
      '构筑逻辑',
      '单人构筑',
      '联机调整',
      '统率神器路线',
      '虚空物品',
      '月球物品',
      '打法速记',
    ])
  })

  test('renders skill icons, slots, bilingual names, unlock state, and reasons', () => {
    renderRoute('/survivors/acrid')

    const skillIcon = screen.getByRole('img', { name: '神经毒素（Neurotoxin）技能图标' })
    const skillRow = skillIcon.closest('li')

    expect(skillRow).not.toBeNull()
    expect(skillIcon).toHaveAttribute(
      'src',
      expectedAsset('assets/skills/acrid/neurotoxin.png'),
    )
    expect(within(skillRow!).getByText('副技能')).toBeInTheDocument()
    expect(within(skillRow!).getByText('神经毒素')).toBeInTheDocument()
    expect(within(skillRow!).getByText('Neurotoxin')).toBeInTheDocument()
    expect(within(skillRow!).getByText('默认拥有')).toBeInTheDocument()
    expect(within(skillRow!).getByText(/远程施毒且不强迫贴脸/)).toBeInTheDocument()
  })

  test('joins solo, Void, and Lunar picks to canonical item details', () => {
    renderRoute('/survivors/acrid')

    for (const group of ['白色物品', '绿色物品', '红色物品', '首领物品', '主动装备']) {
      expect(screen.getByRole('heading', { level: 3, name: group })).toBeInTheDocument()
    }

    const gasolineIcon = screen.getByRole('img', { name: '汽油（Gasoline）物品图标' })
    const gasolineRow = gasolineIcon.closest('li')
    expect(gasolineRow).not.toBeNull()
    expect(gasolineIcon).toHaveAttribute(
      'src',
      expectedAsset('assets/items/gasoline.png'),
    )
    expect(gasolineIcon).toHaveAttribute('loading', 'lazy')
    expect(within(gasolineRow!).getByText('汽油')).toBeInTheDocument()
    expect(within(gasolineRow!).getByText('Gasoline')).toBeInTheDocument()
    expect(within(gasolineRow!).getByText('普通')).toBeInTheDocument()
    expect(within(gasolineRow!).getByText('核心')).toBeInTheDocument()
    expect(within(gasolineRow!).getByText('1–3 件')).toBeInTheDocument()
    expect(within(gasolineRow!).getByText(/解决 Poison 不能击杀/)).toBeInTheDocument()
    expect(within(gasolineRow!).getByText(/汽油会连锁引爆/)).toBeInTheDocument()

    const voidRow = screen
      .getByRole('img', { name: '虚空源焰（Voidsent Flame）物品图标' })
      .closest('li')
    expect(voidRow).not.toBeNull()
    expect(within(voidRow!).getByText('虚空')).toBeInTheDocument()
    expect(within(voidRow!).getByText(/腐化原物品/)).toBeInTheDocument()
    expect(within(voidRow!).getByText('鬼火')).toBeInTheDocument()
    expect(within(voidRow!).getByText("Will-o'-the-wisp")).toBeInTheDocument()

    const conditionalVoidRow = screen
      .getByRole('img', { name: '聚合鲁特琴（Polylute）物品图标' })
      .closest('li')
    expect(within(conditionalVoidRow!).getByText(/自己缺清群则保留原件/)).toBeInTheDocument()

    const avoidedLunarRow = screen
      .getByRole('img', { name: '塑形玻璃（Shaped Glass）物品图标' })
      .closest('li')
    expect(within(avoidedLunarRow!).getByText('月球')).toBeInTheDocument()
    expect(within(avoidedLunarRow!).getByText('避免')).toBeInTheDocument()
  })

  test('renders co-op guidance, ordered Command phases, and four combat scenarios', () => {
    renderRoute('/survivors/acrid')

    const coop = screen.getByRole('list', { name: '呛鼻毒师联机调整' })
    expect(within(coop).getAllByRole('listitem')).toHaveLength(3)
    expect(within(coop).getByText(/队友负责尾刀/)).toBeInTheDocument()

    const route = screen.getByRole('list', { name: '统率神器选装顺序' })
    expect(within(route).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      '前期',
      '中期',
      '后期',
    ])
    expect(within(route).getByText('外星脑袋')).toBeInTheDocument()
    expect(within(route).getByText('Alien Head')).toBeInTheDocument()

    const combat = screen.getByRole('list', { name: '呛鼻毒师战斗场景' })
    expect(within(combat).getAllByRole('listitem')).toHaveLength(4)
    for (const scenario of ['传送器事件', '首领处理', '飞行敌人', '最终阶段 / 米斯历克斯']) {
      expect(within(combat).getByRole('heading', { level: 3, name: scenario })).toBeInTheDocument()
    }
  })

  test('renders an alternative when a canonical item pick provides one', () => {
    renderRoute('/survivors/commando')

    const recyclerRow = screen
      .getByRole('img', { name: '回收机（Recycler）物品图标' })
      .closest('li')
    expect(recyclerRow).not.toBeNull()
    expect(within(recyclerRow!).getByText('替代选择')).toBeInTheDocument()
    expect(within(recyclerRow!).getByText('成型后换回 Royal Capacitor。')).toBeInTheDocument()
  })

  test('renders Heretic transformation requirements and all transformed skills', () => {
    renderRoute('/survivors/heretic')

    expect(screen.getByRole('heading', { level: 1, name: '异端 Heretic' })).toBeInTheDocument()
    expect(screen.getByText(/不能在角色选择界面直接选择/)).toBeInTheDocument()
    expect(screen.getByText(/同时持有 Visions、Hooks、Strides 和 Essence 才立即变身/)).toBeInTheDocument()
    expect(screen.getAllByText('特殊变身组件')).toHaveLength(4)
    for (const skill of ['Hungering Gaze', 'Slicing Maelstrom', 'Shadowfade', 'Ruin']) {
      expect(screen.getByText(skill)).toBeInTheDocument()
    }
  })

  test('makes Captain beacon and Operator drone selections explicit', () => {
    const captain = renderRoute('/survivors/captain')
    const hacking = screen.getByText('Beacon: Hacking').closest('li')
    expect(hacking).not.toBeNull()
    expect(within(hacking!).getByText(/两格都选择 Hacking/)).toBeInTheDocument()
    expect(within(hacking!).getByText('需要解锁')).toBeInTheDocument()
    captain.unmount()

    renderRoute('/survivors/operator')
    for (const drone of ['Drone Tech', 'Gunner Drone Mk 2', 'Healing Drone Mk 2']) {
      const row = screen.getByText(drone).closest('li')
      expect(row).not.toBeNull()
      expect(within(row!).getByText('被动')).toBeInTheDocument()
      expect(within(row!).getByText('默认拥有')).toBeInTheDocument()
    }
  })

  test('uses buttons for chapter navigation and moves focus to the selected heading', async () => {
    const user = userEvent.setup()
    renderRoute('/survivors/acrid')

    expect(screen.queryByRole('link', { name: '虚空物品' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '前往虚空物品' }))

    const heading = screen.getByRole('heading', { level: 2, name: '虚空物品' })
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(document.activeElement).toBe(heading)

    await user.click(screen.getByRole('button', { name: '回到顶部' }))
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { level: 1, name: '呛鼻毒师 Acrid' }),
    )
  })

  test('follows canonical previous and next navigation with boundary behavior', () => {
    const first = renderRoute('/survivors/commando')
    expect(screen.queryByRole('link', { name: /上一个角色/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '下一个角色：女猎人 Huntress' })).toHaveAttribute(
      'href',
      '/survivors/huntress',
    )
    first.unmount()

    const middle = renderRoute('/survivors/acrid')
    expect(screen.getByRole('link', { name: '上一个角色：装载机 Loader' })).toHaveAttribute(
      'href',
      '/survivors/loader',
    )
    expect(screen.getByRole('link', { name: '返回角色首页' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '下一个角色：舰长 Captain' })).toHaveAttribute(
      'href',
      '/survivors/captain',
    )
    middle.unmount()

    renderRoute('/survivors/heretic')
    expect(screen.getByRole('link', { name: '上一个角色：漂泊者 Drifter' })).toHaveAttribute(
      'href',
      '/survivors/drifter',
    )
    expect(screen.queryByRole('link', { name: /下一个角色/ })).not.toBeInTheDocument()
  })

  test('renders every canonical survivor route from the shared guide data', () => {
    for (const slug of EXPECTED_SURVIVOR_SLUGS) {
      const view = renderRoute(`/survivors/${slug}`)
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8)
      view.unmount()
    }
  })
})

describe('guide route failure states', () => {
  test.each(['/survivors/not-a-survivor', '/missing'])('renders a useful not-found page for %s', (path) => {
    renderRoute(path)

    expect(screen.getByRole('heading', { level: 1, name: '没有找到这份角色攻略' })).toBeInTheDocument()
    expect(screen.getByText(/链接可能已经失效/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回角色首页' })).toHaveAttribute('href', '/')
  })

  test('does not silently hide an unknown item reference', () => {
    expect(() => render(
      <ItemGroup
        title="测试物品"
        picks={[{
          itemId: 'missing-item',
          recommendation: 'core',
          stacks: '1 件',
          role: '测试未知物品的可见错误行为',
          synergy: '测试时必须抛出而不是静默忽略引用',
        }]}
      />,
    )).toThrow('未知物品：missing-item')
  })
})
