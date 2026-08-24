import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, test } from 'vitest'
import { resolveConfig } from 'vite'

const repositoryDirectory = resolve(process.cwd())
const workflowFile = join(repositoryDirectory, '.github/workflows/deploy-pages.yml')
const verifierFile = join(repositoryDirectory, 'scripts/verify-deployment.mjs')
const pagesBasePath = '/ror2-build-guide-cn/'

async function loadVerifier() {
  return import(/* @vite-ignore */ pathToFileURL(verifierFile).href)
}

async function withBuiltFixture(
  indexHtml: string,
  files: Record<string, string>,
  assertion: (distDirectory: string) => Promise<void>,
) {
  const fixtureDirectory = await mkdtemp(join(tmpdir(), 'ror2-pages-build-'))
  const distDirectory = join(fixtureDirectory, 'dist')

  try {
    await mkdir(distDirectory, { recursive: true })
    await writeFile(join(distDirectory, 'index.html'), indexHtml)

    for (const [relativePath, contents] of Object.entries(files)) {
      const filePath = join(distDirectory, relativePath)
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, contents)
    }

    await assertion(distDirectory)
  } finally {
    await rm(fixtureDirectory, { recursive: true, force: true })
  }
}

describe('GitHub Pages base path', () => {
  test('uses the repository subpath only for production builds', async () => {
    const production = await resolveConfig({}, 'build', 'production')
    const development = await resolveConfig({}, 'serve', 'development')

    expect(production.base).toBe(pagesBasePath)
    expect(development.base).toBe('/')
  })
})

describe('built GitHub Pages output', () => {
  test('accepts built script and stylesheet URLs beneath the project subpath', async () => {
    if (!existsSync(verifierFile)) {
      expect(existsSync(verifierFile), 'deployment verifier should exist').toBe(true)
      return
    }

    const { verifyDeploymentOutput } = await loadVerifier()
    await withBuiltFixture(
      [
        '<!doctype html>',
        '<link rel="stylesheet" href="/ror2-build-guide-cn/assets/app.css">',
        '<script type="module" src="/ror2-build-guide-cn/assets/app.js"></script>',
      ].join('\n'),
      {
        'assets/app.css': 'body {}',
        'assets/app.js': 'export {}',
      },
      async (distDirectory) => {
        expect(verifyDeploymentOutput({ distDirectory, basePath: pagesBasePath }))
          .toEqual([
            '/ror2-build-guide-cn/assets/app.css',
            '/ror2-build-guide-cn/assets/app.js',
          ])
      },
    )
  })

  test('rejects a root-relative build asset that would fail on project Pages', async () => {
    if (!existsSync(verifierFile)) {
      expect(existsSync(verifierFile), 'deployment verifier should exist').toBe(true)
      return
    }

    const { verifyDeploymentOutput } = await loadVerifier()
    await withBuiltFixture(
      '<script type="module" src="/assets/app.js"></script>',
      { 'assets/app.js': 'export {}' },
      async (distDirectory) => {
        expect(() => verifyDeploymentOutput({ distDirectory, basePath: pagesBasePath }))
          .toThrow('构建资源未使用 GitHub Pages 子路径：/assets/app.js')
      },
    )
  })

  test('rejects a project-relative URL whose built file is missing', async () => {
    if (!existsSync(verifierFile)) {
      expect(existsSync(verifierFile), 'deployment verifier should exist').toBe(true)
      return
    }

    const { verifyDeploymentOutput } = await loadVerifier()
    await withBuiltFixture(
      '<script type="module" src="/ror2-build-guide-cn/assets/missing.js"></script>',
      {},
      async (distDirectory) => {
        expect(() => verifyDeploymentOutput({ distDirectory, basePath: pagesBasePath }))
          .toThrow('构建资源文件不存在：assets/missing.js')
      },
    )
  })
})

describe('GitHub Pages workflow', () => {
  test('uses the official least-privilege two-job Pages flow', async () => {
    if (!existsSync(workflowFile)) {
      expect(existsSync(workflowFile), 'Pages workflow should exist').toBe(true)
      return
    }

    const workflow = await readFile(workflowFile, 'utf8')

    expect(workflow).toMatch(/push:\s*\n\s+branches: \[main\]/)
    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).toMatch(/permissions:\s*\n\s+contents: read\s*\n\s+pages: write\s*\n\s+id-token: write/)
    expect(workflow).toMatch(/concurrency:\s*\n\s+group: pages\s*\n\s+cancel-in-progress: true/)
    expect(workflow).toContain('uses: actions/checkout@v6')
    expect(workflow).toContain('uses: actions/setup-node@v6')
    expect(workflow).toContain("node-version: '24.15.0'")
    expect(workflow).toContain('cache: npm')
    expect(workflow).toContain('uses: actions/configure-pages@v5')
    expect(workflow).toContain('run: npm ci')
    expect(workflow).toContain('run: npm run check')
    expect(workflow).not.toContain('run: npm run build')
    expect(workflow).toContain('uses: actions/upload-pages-artifact@v4')
    expect(workflow).toContain('path: ./dist')
    expect(workflow).toMatch(/deploy:\s*\n\s+environment:/)
    expect(workflow).toContain('needs: build')
    expect(workflow).toContain('uses: actions/deploy-pages@v5')
  })

  test('keeps HashRouter deployment free of an unnecessary 404 fallback', async () => {
    expect(existsSync(join(repositoryDirectory, 'public/404.html'))).toBe(false)
  })
})
