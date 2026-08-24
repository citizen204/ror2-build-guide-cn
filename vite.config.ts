import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const pagesBasePath = '/ror2-build-guide-cn/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? pagesBasePath : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}))
