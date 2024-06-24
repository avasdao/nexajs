/* Import modules. */
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: '../packages/Wallet/index.js',
  output: {
    name: 'Wallet',
    file: '../cdn/js/wallet.js',
    format: 'iife'
  },
  plugins: [
      nodePolyfills(),
      nodeResolve(),
  ]
}
