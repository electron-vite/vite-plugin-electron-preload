# vite-plugin-electron-preload

A Vite preset adapted to Electron preload

## Install

```sh
npm i vite-plugin-electron-preload -D
```

## Usage

```ts
import electronPreload from 'vite-plugin-electron-preload'

// vite.config.js
export default {
  plugins: [
    electronPreload(/* options */),
  ],
}
```

## API <sub><sup>(Define)</sup></sub>

`electronPreload(options: PreloadOptions)`

```ts
export interface PreloadOptions {
  /**
   * Must be consistent with the following config.
   * 
   * ```js
   * new BrowserWindow({
   *   webPreferences: {
   *     sandbox: boolean
   *   }
   * })
   * ```
   */
  sandbox?: boolean
  type?: 'commonjs' | 'module'
}
```
