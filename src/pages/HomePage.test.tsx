import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import App from '../App'
import { survivors } from '../content/survivors'

afterEach(cleanup)

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

test('introduces the guide and reports the full survivor roster', () => {
  renderHomePage()

  expect(
    screen.getByRole('heading', { name: '雨中冒险 2 全角色构筑' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText(/按中文名或英文名搜索角色/),
  ).toBeInTheDocument()
  expect(screen.getByText('最后核对：2026-08-25')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('searches by English name and updates the result count', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  expect(
    screen.getByRole('link', { name: /呛鼻毒师.*Acrid/ }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /Commando/ })).not.toBeInTheDocument()
})

test('searches by Chinese name and can clear the search', async () => {
  const user = userEvent.setup()
  renderHomePage()
  const searchbox = screen.getByRole('searchbox', { name: '搜索角色' })

  await user.type(searchbox, '呛鼻')

  expect(
    screen.getByRole('link', { name: /呛鼻毒师.*Acrid/ }),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '清空搜索' }))

  expect(searchbox).toHaveValue('')
  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('filters the roster by SOTV and the special transformation', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.click(screen.getByRole('button', { name: 'SOTV' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 2 名角色')
  expect(screen.getByRole('link', { name: /Railgunner/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Void Fiend/ })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /Commando/ })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '特殊' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 1 名角色')
  expect(screen.getByRole('link', { name: /Heretic/ })).toBeInTheDocument()
})

test('explains how to recover from an empty combined search and filter', async () => {
  const user = userEvent.setup()
  renderHomePage()

  await user.click(screen.getByRole('button', { name: 'SOTV' }))
  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')

  expect(screen.getByRole('status')).toHaveTextContent('找到 0 名角色')
  expect(
    screen.getByRole('heading', { name: '没有找到符合条件的角色' }),
  ).toBeInTheDocument()
  expect(screen.getByText(/清空搜索.*全部/)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '显示全部角色' }))

  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
})

test('links every card to its detail route and gives portraits meaningful alt text', () => {
  renderHomePage()

  for (const survivor of survivors) {
    expect(
      screen.getByRole('link', {
        name: new RegExp(`${survivor.nameZh}.*${survivor.nameEn}`),
      }),
    ).toHaveAttribute('href', `/survivors/${survivor.slug}`)
    expect(
      screen.getByRole('img', {
        name: `${survivor.nameZh}（${survivor.nameEn}）角色头像`,
      }),
    ).toBeInTheDocument()
  }
})

test('builds base-safe asset URLs with or without a leading slash', async () => {
  const { assetUrl } = await import('../domain/assets')
  const expected = `${import.meta.env.BASE_URL}assets/survivors/acrid.png`

  expect(assetUrl('assets/survivors/acrid.png')).toBe(expected)
  expect(assetUrl('/assets/survivors/acrid.png')).toBe(expected)
})

test('shows recognizable card metadata and difficulty in text and marks', async () => {
  const user = userEvent.setup()
  renderHomePage()
  await user.type(screen.getByRole('searchbox', { name: '搜索角色' }), 'Acrid')
  const card = screen.getByRole('article')

  expect(within(card).getByText('呛鼻毒师')).toBeInTheDocument()
  expect(within(card).getByText('Acrid')).toBeInTheDocument()
  expect(within(card).getByText('本体')).toBeInTheDocument()
  expect(within(card).getByText(/百分比 Poison 削血/)).toBeInTheDocument()
  expect(within(card).getByText('操作难度：3 / 5')).toBeInTheDocument()
  expect(card.querySelector('[aria-hidden="true"]')).toHaveTextContent('●●●○○')
})

test('exposes every DLC control and supports keyboard selection', async () => {
  const user = userEvent.setup()
  renderHomePage()
  const filterGroup = screen.getByRole('group', { name: '按 DLC 筛选' })
  const allButton = within(filterGroup).getByRole('button', { name: '全部' })
  const sotvButton = within(filterGroup).getByRole('button', { name: 'SOTV' })

  for (const label of ['全部', '本体', 'SOTV', 'SOTS', 'AC', '特殊']) {
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
