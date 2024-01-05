# vite-plugin-electron-preload

To adapt to electron@28+, vite@5+

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
