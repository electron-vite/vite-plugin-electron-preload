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

export function withExternalBuiltins(config: InlineConfig, modules = builtins) {

  config.build ??= {}
  config.build.rollupOptions ??= {}

  let external = config.build.rollupOptions.external
  if (
    Array.isArray(external) ||
    typeof external === 'string' ||
    external instanceof RegExp
  ) {
    external = modules.concat(external as string[])
  } else if (typeof external === 'function') {
    const original = external
    external = function (source, importer, isResolved) {
      if (modules.includes(source)) {
        return true
      }
      return original(source, importer, isResolved)
    }
  } else {
    external = modules
  }
  config.build.rollupOptions.external = external

  return config
}
