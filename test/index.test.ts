import fs from 'node:fs'
import path from 'node:path'
import {
  type UserConfig,
  build,
  resolveConfig,
} from 'vite'
import {
  describe,
  expect,
  it,
} from 'vitest'
import electronPreload, {
  type PreloadOptions,
} from '../src/index'

const snapshots = path.join(__dirname, '__snapshots__')
const fixtures = path.join(__dirname, 'fixtures')
const getFixturesConfig = (options: PreloadOptions, type: 'module' | 'commonjs'): UserConfig => {
  const root = path.join(fixtures, type)
  return {
    root,
    build: {
      minify: false,
      rollupOptions: {
        input: path.join(root, 'preload.mjs'),
        output: {
          format: type === 'commonjs' ? 'cjs' : /* esm */undefined,
          entryFileNames: '[name].mjs',
        },
      },
    },
    plugins: [electronPreload(options)],
  }
}

describe('src/index', () => {
  it('options.sandbox', async () => {
    const getDistFile = (file: string) => fs.readFileSync(path.join(fixtures, file), 'utf8')
    const getSnapshotsFile = (file: string) => fs.readFileSync(path.join(snapshots, file), 'utf8')

    await build(getFixturesConfig({ sandbox: false }, 'module'))
    expect(getDistFile('module/dist/preload.mjs'))
      .eq(getSnapshotsFile('module/preload.sandbox-false.mjs'))

    await build(getFixturesConfig({ sandbox: /* true */undefined }, 'module'))
    expect(getDistFile('module/dist/preload.mjs'))
      .eq(getSnapshotsFile('module/preload.sandbox.mjs'))

    await build(getFixturesConfig({ sandbox: false }, 'commonjs'))
    expect(getDistFile('commonjs/dist/preload.mjs'))
      .eq(getSnapshotsFile('commonjs/preload.sandbox-false.mjs'))

    await build(getFixturesConfig({ sandbox: /* true */undefined }, 'commonjs'))
    expect(getDistFile('commonjs/dist/preload.mjs'))
      .eq(getSnapshotsFile('commonjs/preload.sandbox.mjs'))

    expect(true).true
  })

  /*
  it('options.type', async () => {
    const getConfig = (options: PreloadOptions) => resolveConfig(
      { plugins: [electronPreload(options)] },
      'build',
    )
    const configEsm = await getConfig({ type: 'module' })
    const configCjs = await getConfig({ type: 'commonjs' })

    // config hook
    expect(configEsm.build.commonjsOptions.ignore).undefined
    expect(configEsm.build.rollupOptions.external).undefined
    expect(configCjs.build.commonjsOptions.ignore).toEqual(builtins)
    expect(configCjs.build.rollupOptions.external).toEqual(builtins)

    // TODO: resolveId hook
    // TODO: load hook
  })
  */
})
