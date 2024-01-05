import { createRequire } from 'node:module'
import type { Plugin } from 'vite'
import libEsm from 'lib-esm'
import {
  alwaysAvailableModules,
  builtins,
  electronModules,
  electronRenderer,
  getNodeIntegrationEnabledGuard,
  nodeModules,
  prefix,
} from './utils'

interface PreloadOptions {
  /**
   * Auto expose `ipcRenderer` to Renderer process
   * 
   * @example 
   * // Use the ipcRenderer in renderer.js
   * const result = await window.ipcRenderer.invoke('channel');
   * 
   * @todo implementation
   */
  exposeIpcRenderer?: true
}

const require = createRequire(import.meta.url)

export default function preload(options: PreloadOptions = {}): Plugin {
  return {
    name: 'vite-plugin-electron-preload',
    // Run before the builtin 'vite:resolve' of Vite
    enforce: 'pre',
    resolveId(source) {
      if (builtins.includes(source)) {
        // @see - https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
        return prefix + source
      }
    },
    config(config) {
      config.define = {
        ...config.define,
        // @see - https://github.com/vitejs/vite/blob/v5.0.11/packages/vite/src/node/plugins/define.ts#L20
        'process.env': 'process.env',
      }
    },
    load(id) {
      if (id.startsWith(prefix)) {
        const name = id.replace(prefix, '')

        if (electronModules.includes(name)) {
          return electronRenderer
        }
        if (nodeModules.includes(id)) {
          const snippets = libEsm({
            require: id,
            exports: Object.keys(require(id))
          })

          if (alwaysAvailableModules.includes(id)) {
            return `${snippets.require}\n${snippets.exports}`
          }
          return `${getNodeIntegrationEnabledGuard(id)}\n${snippets.require}\n${snippets.exports}`
        }
      }
    },
  }
}
