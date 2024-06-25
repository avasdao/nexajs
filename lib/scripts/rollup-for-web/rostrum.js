/* Import modules. */
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: '../../packages/Rostrum/index.js',
    output: {
        name: 'Rostrum',
        file: '../../cdn/js/rostrum.js',
        format: 'iife',
    },
    plugins: [
        nodePolyfills(),
        nodeResolve(),
    ],
}
