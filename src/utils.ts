import fs from 'node:fs'
import path from 'node:path'
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
export const electronRendererCjs = `
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
if (process.sandboxed) {
  throw new Error(\`${name} is the Node.js module, please set "nodeIntegration: true" in the main process.\`);
}
`
}

export function withCommonjsIgnoreBuiltins(config: InlineConfig, modules = builtins) {
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

  return config
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

export async function resolvePackageJson(root = process.cwd()): Promise<{
  type?: 'module' | 'commonjs'
  [key: string]: any
} | null> {
  const packageJsonPath = path.join(root, 'package.json')
  const packageJsonStr = await fs.promises.readFile(packageJsonPath, 'utf8')
  try {
    return JSON.parse(packageJsonStr)
  } catch {
    return null
  }
}
