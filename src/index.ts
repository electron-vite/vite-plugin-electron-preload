import path from 'node:path'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'
import libEsm from 'lib-esm'
import {
  alwaysAvailableModules,
  builtins,
  withCommonjsIgnoreBuiltins,
  electronModules,
  electronRendererCjs,
  getNodeIntegrationEnabledGuard,
  nodeModules,
  prefix,
  resolvePackageJson,
  withExternalBuiltins,
} from './utils'

export interface PreloadOptions {
  /**
   * `require()` can usable matrix
   * 
   * @see https://github.com/electron/electron/blob/v30.0.0-nightly.20240104/docs/tutorial/esm.md#preload-scripts
   * 
   * ```log
   * ┏———————————————————————————————————┳——————————┳———————————┓
   * │ webPreferences: { }               │  import  │  require  │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: false(undefined) │    ✘     │     ✔     │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: true             │    ✔     │     ✔     │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ sandbox: true(undefined)          │    ✘     │     ✔     │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ sandbox: false                    │    ✔     │     ✘     │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: false            │    ✘     │     ✔     │
   * │ sandbox: true                     │          │           │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: false            │    ✔     │     ✘     │
   * │ sandbox: false                    │          │           │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: true             │    ✘     │     ✔     │
   * │ sandbox: true                     │          │           │
   * ┠———————————————————————————————————╂——————————╂———————————┨
   * │ nodeIntegration: true             │    ✔     │     ✔     │
   * │ sandbox: false                    │          │           │
   * ┗———————————————————————————————————┸——————————┸———————————┛
   * - import(✘): SyntaxError: Cannot use import statement outside a module
   * - require(✘): ReferenceError: require is not defined in ES module scope, you can use import instead
   * ```
   */
  sandbox?: boolean
  type?: 'commonjs' | 'module'
}

const require = createRequire(import.meta.url)

export default function preload(options: PreloadOptions = {}): Plugin {
  const requireAvailable = options.sandbox !== false

  return {
    name: 'vite-plugin-electron-preload',
    // Run before the builtin 'vite:resolve' of Vite
    enforce: 'pre',
    async config(config) {
      // @see - https://github.com/vitejs/vite/blob/v5.0.9/packages/vite/src/node/config.ts#L490
      const root = config.root ? path.resolve(config.root) : process.cwd()

      if (options.type == null) {
        const json = await resolvePackageJson(root)
        if (json) {
          options.type = json.type
        }
      }

      if (options.type === 'module') {
        // `esm` may need to be converted to `cjs`, depending on `options.sandbox`

        // Processed in resolveId hook
        // withCommonjsIgnoreBuiltins(config)
      } else {
        // External builtins has higher priority
        withExternalBuiltins(config)

        // Users should build App using `cjs`
        // TODO: config.build.rollupOptions.output.format = 'cjs'
      }

      config.define = {
        ...config.define,
        // @see - https://github.com/vitejs/vite/blob/v5.0.11/packages/vite/src/node/plugins/define.ts#L20
        'process.env': 'process.env',
      }
    },
    resolveId(source) {
      if (builtins.includes(source)) {
        return requireAvailable
          ? prefix + source
          : { external: true, id: source } // import
      }
    },
    load(id) {
      if (id.startsWith(prefix)) {
        const name = id.replace(prefix, '')

        if (electronModules.includes(name)) {
          return electronRendererCjs
        }
        if (nodeModules.includes(name)) {
          const snippets = libEsm({
            require: name,
            exports: Object.keys(require(name))
          })

          const importStatement = `const _M_ = require("${name}");`
          return alwaysAvailableModules.includes(name)
            ? `${importStatement}\n${snippets.exports}`
            : `${getNodeIntegrationEnabledGuard(name)}\n${importStatement}\n${snippets.exports}`
        }
      }
    },
  }
}
