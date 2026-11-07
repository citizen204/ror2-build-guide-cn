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

test('the homepage announces the two new guides as untested', () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByText(/万象归衡（游戏内名称：神圣观念）两名新角色攻略已上线.*构筑尚未实测/)).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('找到 21 名角色')
  expect(screen.getByRole('link', { name: /执行者.*构筑未实测/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /侍僧.*构筑未实测/ })).toBeInTheDocument()
})

test.each(['enforcer', 'acolyte'])('%s guide is live and clearly labelled as untested', (slug) => {
  render(<MemoryRouter initialEntries={[`/survivors/${slug}`]}><App /></MemoryRouter>)
  expect(screen.getByRole('article', { name: /完整构筑攻略/ })).toBeInTheDocument()
  const notice = screen.getByRole('region', { name: '构筑未实测' })
  expect(notice).toHaveTextContent('尚未经过游戏实测')
  expect(notice).toHaveTextContent('2026-11-07')
  expect(notice).toHaveTextContent('25921972')
  expect(screen.queryByRole('region', { name: '十月更新说明' })).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 2, name: '备选技能' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 2, name: '神圣物品' })).toBeInTheDocument()
})

test('existing guides keep their patch notice and show no untested label', () => {
  render(<MemoryRouter initialEntries={['/survivors/commando']}><App /></MemoryRouter>)
  expect(screen.getByRole('region', { name: '十月更新说明' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: '蓄意破坏技能图标' })).toBeInTheDocument()
  expect(screen.queryByText('构筑未实测')).not.toBeInTheDocument()
})
