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
  plugins: [electronPreload()],
}
```

## How to work

```ts
import { ipcRenderer } from 'electron'

// ↓↓↓↓ convert to ↓↓↓↓

const electron = require('electron');
export ipcRenderer = electron.ipcRenderer;
```
