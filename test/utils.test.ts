import fs from 'node:fs'
import path from 'node:path'
import { ExternalOption } from 'rollup'
import {
  type InlineConfig,
  type RollupCommonJSOptions,
} from 'vite'
import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  nodeModules,
  resolvePackageJson,
  withCommonjsIgnoreBuiltins,
  withExternalBuiltins,
} from '../src/utils'

describe('src/utils', () => {
  it('withCommonjsIgnoreBuiltins', async () => {
    const builtins = ['electron', ...nodeModules]
    const getCommonjsConfig = (ignore: RollupCommonJSOptions['ignore']): InlineConfig => ({ build: { commonjsOptions: { ignore } } })
    const ignore_array: RollupCommonJSOptions['ignore'] = ['electron']
    const ignore_function: RollupCommonJSOptions['ignore'] = id => ['electron'].includes(id)

    const ignore_arr = withCommonjsIgnoreBuiltins(getCommonjsConfig(ignore_array), nodeModules)
      .build?.commonjsOptions?.ignore! as string[]
    expect(ignore_arr).toEqual(builtins)

    const ignore_fun = withCommonjsIgnoreBuiltins(getCommonjsConfig(ignore_function), nodeModules)
      .build?.commonjsOptions?.ignore! as ((id: string) => boolean)
    expect(ignore_fun('electron')).true
  })

  it('withExternalBuiltins', async () => {
    const builtins: ExternalOption[] = nodeModules
    const external_string: ExternalOption = 'electron'
    const external_array: ExternalOption = ['electron']
    const external_regexp: ExternalOption = /electron/
    const external_function: ExternalOption = source => ['electron'].includes(source)
    const getExternalConfig = (external: ExternalOption): InlineConfig => ({ build: { rollupOptions: { external } } })

    const external_str = withExternalBuiltins(getExternalConfig(external_string), nodeModules)?.build?.rollupOptions?.external!
    expect(external_str).toEqual(builtins.concat(external_string))

    const external_arr = withExternalBuiltins(getExternalConfig(external_array), nodeModules)?.build?.rollupOptions?.external!
    expect(external_arr).toEqual(builtins.concat(external_array))

    const external_reg = withExternalBuiltins(getExternalConfig(external_regexp), nodeModules)?.build?.rollupOptions?.external!
    expect(external_reg).toEqual(builtins.concat(external_regexp))

    const external_fun = withExternalBuiltins(getExternalConfig(external_function), nodeModules)?.build?.rollupOptions?.external!
    expect((external_fun as (source: string) => boolean)('electron')).true
  })

  it('resolvePackageJson', async () => {
    const root = path.join(__dirname, '..')
    const json = await resolvePackageJson(root)
    const json2 = JSON.parse(await fs.promises.readFile(path.join(root, 'package.json'), 'utf8'))
    expect(json).toEqual(json2)
  })
})
