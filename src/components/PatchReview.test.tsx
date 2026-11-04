import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test } from 'vitest'
import App from '../App'

afterEach(cleanup)

test.each(['commando', 'huntress', 'acrid', 'artificer', 'engineer', 'rex'])('%s exposes free-skill impact and separate review dates', (slug) => {
  render(<MemoryRouter initialEntries={[`/survivors/${slug}`]}><App /></MemoryRouter>)
  const section = screen.getByRole('region', { name: '十月更新说明' })
  expect(section).toHaveTextContent('免费更新新增需要解锁')
  expect(section).toHaveTextContent('候选方案')
  expect(section).toHaveTextContent('2026-08-25')
  expect(section).toHaveTextContent('2026-11-04')
  expect(section).toHaveTextContent('尚未完成新版本全面实测')
})

test('the homepage acknowledges release without claiming two new guides are published', () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByText(/万象归衡已发售：两名新角色/)).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('找到 19 名角色')
  expect(screen.queryByRole('link', { name: /执行者|侍僧/ })).not.toBeInTheDocument()
})

test.each(['enforcer', 'acolyte'])('unreviewed %s draft does not have a live guide route', (slug) => {
  render(<MemoryRouter initialEntries={[`/survivors/${slug}`]}><App /></MemoryRouter>)
  expect(screen.queryByRole('article', { name: /完整构筑攻略/ })).not.toBeInTheDocument()
})
