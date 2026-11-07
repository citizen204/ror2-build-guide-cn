import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, test } from 'vitest'
import App from '../App'
import { sources } from '../content/sources'
import { SiteFooter } from './SiteFooter'

const sourceLinks = [
  { id: 'steam-base', name: '官方本体页面新标签页 ↗' },
  { id: 'steam-alloyed-collective', name: '合金意念官方页面新标签页 ↗' },
  { id: 'steam-hallowed-concepts', name: '万象归衡官方页面新标签页 ↗' },
  { id: 'official-hc-release', name: '十月八日更新说明新标签页 ↗' },
  { id: 'official-hc-hotfix', name: '十月十四日电脑端热修复新标签页 ↗' },
  { id: 'wiki-survivors', name: '角色资料与图标来源新标签页 ↗' },
  { id: 'wiki-items', name: '物品资料与图标来源新标签页 ↗' },
  { id: 'github-asset-manifest', name: '完整图标来源清单新标签页 ↗' },
  { id: 'wiki-copyrights', name: '维基权利与许可说明新标签页 ↗' },
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
    expect(scope).toHaveTextContent(/^本体、虚空幸存者、风暴探寻者、合金意念、万象归衡$/)
    expect(within(footer).getByText(/公开的非官方粉丝攻略/)).toHaveTextContent(
      /没有隶属、赞助或认可关系/,
    )
    expect(within(footer).getByText(/图标取自《雨中冒险 2》维基/)).toHaveTextContent(
      /本站不对这些素材作再授权/,
    )
    expect(within(footer).getByText(/维基机制资料/)).toHaveTextContent(/版本变化后应重新核对/)
    expect(footer).not.toHaveTextContent(/[A-Za-z]/)
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
      expect(link).toHaveAccessibleName(expected.name)
      expect(link).toHaveAttribute('href', source!.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')

      await user.tab()
      expect(link).toHaveFocus()
    }

    expect(screen.getByRole('link', { name: '完整图标来源清单新标签页 ↗' })).toHaveAttribute(
      'href',
      'https://github.com/citizen204/ror2-build-guide-cn/blob/main/src/content/assets.json',
    )
    expect(screen.getByRole('link', { name: '维基权利与许可说明新标签页 ↗' })).toHaveAttribute(
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
