import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import App from './App'

test('renders the guide title', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: '雨中冒险 2 全角色构筑' }),
  ).toBeInTheDocument()
})
