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
  { id: 'github-asset-manifest', name: /完整图标来源清单/ },
  { id: 'wiki-copyrights', name: /Wiki 权利与许可说明/ },
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
    const scope = within(footer).getByText('适用内容').parentElement?.querySelector('dd')
    expect(scope).not.toBeNull()
    expect(scope).toHaveTextContent(
      '本体（Base）、虚空幸存者（Survivors of the Void，SOTV）、风暴探寻者（Seekers of the Storm，SOTS）、合金意念（Alloyed Collective，AC）',
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

    expect(screen.getByRole('link', { name: /完整图标来源清单/ })).toHaveAttribute(
      'href',
      'https://github.com/citizen204/ror2-build-guide-cn/blob/main/src/content/assets.json',
    )
    expect(screen.getByRole('link', { name: /Wiki 权利与许可说明/ })).toHaveAttribute(
      'href',
      'https://riskofrain2.wiki.gg/wiki/Risk_of_Rain_2_Wiki:Copyrights',
    )
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
  expect(document.body).not.toHaveTextContent(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)
})
