/// <reference types="vite/client" />

declare module 'vite-plugin-node-stdlib-browser' {
  import { PluginOption } from 'vite';
  function nodePolyfills(): PluginOption[];
  export default nodePolyfills;
}
