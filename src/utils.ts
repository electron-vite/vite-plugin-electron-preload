import { builtinModules } from 'node:module'
import type { InlineConfig } from 'vite'

export const electronModules = [
  'electron',
  'electron/common',
  'electron/renderer',
]
export const nodeModules = builtinModules
  .filter(m => !m.startsWith('_'))
  .map(m => [m, `node:${m}`])
  .flat()
export const builtins = [
  ...electronModules,
  ...nodeModules,
]
export const prefix = '\0vite-plugin-electron-preload:'
export const electronRenderer = `
const electron = require("electron");
export { electron as default };
export const clipboard = electron.clipboard;
export const contextBridge = electron.contextBridge;
export const crashReporter = electron.crashReporter;
export const ipcRenderer = electron.ipcRenderer;
export const nativeImage = electron.nativeImage;
export const shell = electron.shell;
export const webFrame = electron.webFrame;
`

export const alwaysAvailableModules = [
  'events',
  'timers',
  'url',
].map((m) => [m, `node:${m}`]).flat()

export function getNodeIntegrationEnabledGuard(name: string) {
  return `
if (typeof process.kill !== "function") {
  throw new Error(\`${name} is the Node.js module, please enable "nodeIntegration: true" in the main process.\`);
}
`
}

export function commonjsPluginAdapter(config: InlineConfig, modules = builtins) {
  config.build ??= {}
  config.build.commonjsOptions ??= {}
  if (config.build.commonjsOptions.ignore) {
    if (typeof config.build.commonjsOptions.ignore === 'function') {
      const userIgnore = config.build.commonjsOptions.ignore
      config.build.commonjsOptions.ignore = id => {
        if (userIgnore?.(id) === true) {
          return true
        }
        return modules.includes(id)
      }
    } else {
      // @ts-ignore
      config.build.commonjsOptions.ignore.push(...modules)
    }
  } else {
    config.build.commonjsOptions.ignore = modules
  }
}
