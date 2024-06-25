/* Import modules. */
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: '../packages/Address/index.js',
  output: {
    name: 'Address',
    file: '../cdn/js/address.js',
    format: 'iife',
  },
  plugins: [
      commonjs(),
      nodePolyfills(),
      nodeResolve(),
  ]
}
