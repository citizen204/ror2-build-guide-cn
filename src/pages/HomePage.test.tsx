import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import App from '../App'
import { survivors } from '../content/survivors'
import { HomePage } from './HomePage'

afterEach(cleanup)

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

function SurvivorRouteProbe() {
  const { slug } = useParams()

  return <p>已打开角色：{slug}</p>
}

function renderHomePageWithRouteProbe() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survivors/:slug" element={<SurvivorRouteProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

test('introduces the guide and reports the full survivor roster', () => {
  renderHomePage()

  const title = screen.getByRole('heading', { name: '雨中冒险 2 全角色构筑' })
  const header = title.closest('header')
  expect(title).toBeInTheDocument()
  expect(header).not.toBeNull()
  expect(
    within(header!).getByText(/按中文名或英文名搜索角色/),
  ).toBeInTheDocument()
  expect(within(header!).getByText('最后核对：2026-08-25')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('explains how Command and normal-run players should read recommendations', () => {
  renderHomePage()

  const guidance = screen.getByRole('region', { name: '如何使用构筑建议' })
  expect(within(guidance).getByRole('heading', { level: 2, name: '如何使用构筑建议' })).toBeInTheDocument()
  const [commandGuidance, normalRunGuidance] = guidance.querySelectorAll('p')
  expect(commandGuidance).toHaveTextContent(/统率神器.*前期、中期、后期/)
  expect(normalRunGuidance).toHaveTextContent(/普通流程.*作用.*联动.*替代选择/)
})

test('英文名称仍可搜索，但结果卡片只显示中文', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  const link = screen.getByRole('link', { name: /呛鼻毒师/ })
  expect(link).toBeInTheDocument()
  expect(link).not.toHaveTextContent('Acrid')
  expect(link).not.toHaveAccessibleName(/Acrid/)
  expect(screen.queryByText('Acrid')).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /突击队员/ })).not.toBeInTheDocument()
})

test('searches by Chinese name and can clear the search', async () => {
  const user = userEvent.setup()
  renderHomePage()
  const searchbox = screen.getByRole('searchbox', { name: '搜索角色' })

  await user.type(searchbox, '呛鼻')

  const link = screen.getByRole('link', { name: /呛鼻毒师/ })
  expect(link).toBeInTheDocument()
  expect(link).not.toHaveTextContent('Acrid')
  await user.click(screen.getByRole('button', { name: '清空搜索' }))

  expect(searchbox).toHaveValue('')
  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('官方简中名“虚假子嗣”可以唯一搜索且不再展示旧称', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), '虚假子嗣')

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  const link = screen.getByRole('link', { name: /虚假子嗣/ })
  expect(link).toHaveAttribute('href', '/survivors/false-son')
  expect(document.body).not.toHaveTextContent('伪子')
})

test('按虚空幸存者和特殊变身筛选角色', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.click(screen.getByRole('button', { name: '虚空幸存者' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 2 名角色')
  expect(screen.getByRole('link', { name: /磁轨炮手/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /虚空恶鬼/ })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /突击队员/ })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '特殊变身' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  expect(screen.getByRole('link', { name: /异端/ })).toBeInTheDocument()
})

test('按本体、风暴探寻者和合金意念筛选角色', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.click(screen.getByRole('button', { name: '本体' }))
  expect(screen.getByRole('status')).toHaveTextContent('找到 11 名角色')
  expect(
    within(screen.getByRole('list', { name: '角色筛选结果' })).getAllByRole(
      'listitem',
    ),
  ).toHaveLength(11)
  expect(screen.getByRole('link', { name: /突击队员/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /呛鼻毒师/ })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /探寻者/ })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '风暴探寻者' }))
  expect(screen.getByRole('status')).toHaveTextContent('找到 3 名角色')
  expect(
    within(screen.getByRole('list', { name: '角色筛选结果' })).getAllByRole(
      'listitem',
    ),
  ).toHaveLength(3)
  expect(screen.getByRole('heading', { level: 2, name: '探寻者' }).closest('a')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /大厨/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /虚假子嗣/ })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '合金意念' }))
  expect(screen.getByRole('status')).toHaveTextContent('找到 2 名角色')
  expect(
    within(screen.getByRole('list', { name: '角色筛选结果' })).getAllByRole(
      'listitem',
    ),
  ).toHaveLength(2)
  expect(screen.getByRole('link', { name: /操作员/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /漂泊者/ })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /探寻者/ })).not.toBeInTheDocument()
})

test('explains how to recover from an empty combined search and filter', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.click(screen.getByRole('button', { name: '虚空幸存者' }))
  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')

  expect(screen.getByRole('status')).toHaveTextContent('找到 0 名角色')
  const emptyHeading = screen.getByRole('heading', { name: '没有找到符合条件的角色' })
  const emptyResults = emptyHeading.closest<HTMLElement>('.empty-results')
  expect(emptyResults).not.toBeNull()
  expect(within(emptyResults!).getByText('试试清空搜索，或把扩展内容改为“全部”。')).toBeInTheDocument()
  expect(emptyResults).not.toHaveTextContent(/[A-Za-z]/)

  await user.click(screen.getByRole('button', { name: '显示全部角色' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('每张角色卡只用中文展示名称链接详情并描述头像', () => {
  renderHomePage()

  for (const survivor of survivors) {
    const heading = screen.getByRole('heading', { level: 2, name: survivor.nameZh })
    const link = heading.closest('a')
    expect(link).not.toBeNull()
    expect(link).toHaveAttribute('href', `/survivors/${survivor.slug}`)
    expect(heading).toHaveTextContent(
      new RegExp(`^${survivor.nameZh}$`),
    )
    if (survivor.nameEn !== survivor.nameZh) {
      expect(link!).not.toHaveTextContent(survivor.nameEn)
      expect(link!).not.toHaveAccessibleName(new RegExp(survivor.nameEn))
    }
    expect(
      screen.getByRole('img', {
        name: `${survivor.nameZh}角色头像`,
      }),
    ).toBeInTheDocument()
  }
})

test('builds base-safe asset URLs with or without a leading slash', async () => {
  const { assetUrl } = await import('../domain/assets')
  const expected = `${import.meta.env.BASE_URL}assets/survivors/acrid.png`

  expect(assetUrl('assets/survivors/acrid.png')).toBe(expected)
  expect(assetUrl('/assets/survivors/acrid.png')).toBe(expected)
  expect(assetUrl('assets/survivors/acrid.png', '/')).toBe(
    '/assets/survivors/acrid.png',
  )
  expect(assetUrl('/assets/survivors/acrid.png', '/ror2-build-guide-cn')).toBe(
    '/ror2-build-guide-cn/assets/survivors/acrid.png',
  )
})

test('shows recognizable card metadata and difficulty in text and marks', async () => {
  const user = userEvent.setup()
  renderHomePage()
  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')
  const card = screen.getByRole('article')

  expect(within(card).getByText('呛鼻毒师')).toBeInTheDocument()
  expect(within(card).queryByText('Acrid')).not.toBeInTheDocument()
  expect(within(card).getByText('本体')).toBeInTheDocument()
  expect(within(card).getByText(/百分比中毒削血/)).toBeInTheDocument()
  expect(within(card).getByText('操作难度：3 / 5')).toBeInTheDocument()
  expect(card.querySelector('[aria-hidden="true"]')).toHaveTextContent('●●●○○')
})

test('显示每个扩展内容筛选控件并支持键盘选择', async () => {
  const user = userEvent.setup()
  renderHomePage()
  expect(screen.getByRole('searchbox', { name: '搜索角色' })).toHaveAttribute(
    'placeholder',
    '输入中文名；也支持英文搜索',
  )
  const filterGroup = screen.getByRole('group', { name: '按扩展内容筛选' })
  const allButton = within(filterGroup).getByRole('button', { name: '全部' })
  const sotvButton = within(filterGroup).getByRole('button', { name: '虚空幸存者' })

  for (const label of ['全部', '本体', '虚空幸存者', '风暴探寻者', '合金意念', '特殊变身']) {
    expect(within(filterGroup).getByRole('button', { name: label })).toBeEnabled()
  }
  expect(allButton).toHaveAttribute('aria-pressed', 'true')
  expect(sotvButton).toHaveAttribute('aria-pressed', 'false')

  sotvButton.focus()
  await user.keyboard('{Enter}')

  expect(sotvButton).toHaveFocus()
  expect(sotvButton).toHaveAttribute('aria-pressed', 'true')
  expect(allButton).toHaveAttribute('aria-pressed', 'false')
})

test('traverses and activates search, filters, reset, and a card link by keyboard', async () => {
  const user = userEvent.setup()
  renderHomePageWithRouteProbe()
  const searchbox = screen.getByRole('searchbox', { name: '搜索角色' })

  await user.tab()
  expect(searchbox).toHaveFocus()
  await user.type(searchbox, 'Acrid')

  for (const label of ['全部', '本体', '虚空幸存者', '风暴探寻者', '合金意念', '特殊变身']) {
    await user.tab()
    const filterButton = screen.getByRole('button', { name: label })
    expect(filterButton).toHaveFocus()

    if (label === '本体') {
      await user.keyboard('{Enter}')
      expect(filterButton).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
    }
  }

  await user.tab()
  const resetButton = screen.getByRole('button', { name: '重置搜索和筛选' })
  expect(resetButton).toHaveFocus()
  await user.keyboard('{Enter}')

  expect(searchbox).toHaveValue('')
  expect(screen.getByRole('button', { name: '全部' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  await user.tab()
  expect(searchbox).toHaveFocus()
  for (const label of ['全部', '本体', '虚空幸存者', '风暴探寻者', '合金意念', '特殊变身']) {
    await user.tab()
    expect(screen.getByRole('button', { name: label })).toHaveFocus()
  }

  await user.tab()
  const firstCardLink = screen.getByRole('link', { name: /突击队员/ })
  expect(firstCardLink).toHaveFocus()
  await user.keyboard('{Enter}')

  expect(screen.getByText('已打开角色：commando')).toBeInTheDocument()
})
