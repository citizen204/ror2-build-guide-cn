import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test } from 'vitest'
import App from '../App'
import { sources } from '../content/sources'
import { SiteFooter } from './SiteFooter'

const sourceLinks = [
  { id: 'steam-base', name: /官方本体页面/ },
  { id: 'steam-alloyed-collective', name: /Alloyed Collective 官方页面/ },
  { id: 'wiki-survivors', name: /角色资料与图标来源/ },
  { id: 'wiki-items', name: /物品资料与图标来源/ },
] as const

afterEach(cleanup)

describe('site footer', () => {
  test('states the verified DLC scope and public fan-guide disclaimer', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    )

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('heading', { level: 2, name: '资料与说明' })).toBeInTheDocument()
    expect(within(footer).getByText('2026-08-25')).toHaveAttribute(
      'datetime',
      '2026-08-25',
    )
    expect(footer).not.toHaveTextContent('最后核对最后核对')
    expect(within(footer).getByText(/本体（Base）/)).toHaveTextContent(
      '本体（Base）、Survivors of the Void（SOTV）、Seekers of the Storm（SOTS）、Alloyed Collective（AC）',
    )
    expect(within(footer).getByText(/公开的非官方粉丝攻略/)).toHaveTextContent(
      /没有隶属、赞助或认可关系/,
    )
    expect(within(footer).getByText(/图标取自 Risk of Rain 2 Wiki/)).toHaveTextContent(
      /本站不对这些素材作再授权/,
    )
    expect(footer).not.toHaveTextContent(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)
  })

  test('uses canonical external sources as keyboard-accessible links', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    )

    for (const expected of sourceLinks) {
      const source = sources.find((candidate) => candidate.id === expected.id)
      expect(source).toBeDefined()

      const link = screen.getByRole('link', { name: expected.name })
      expect(link).toHaveAttribute('href', source!.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')

      await user.tab()
      expect(link).toHaveFocus()
    }
  })
})

test.each(['/', '/survivors/acrid', '/missing'])('renders one main landmark and the footer at %s', (path) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getAllByRole('main')).toHaveLength(1)
  expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
})
