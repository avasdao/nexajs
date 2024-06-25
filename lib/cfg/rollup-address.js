/* Import modules. */
import inject from '@rollup/plugin-inject'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: '../packages/Address/index.js',
    output: {
        name: 'Address',
        file: '../cdn/js/address.js',
        format: 'iife',
    },
    plugins: [
        nodePolyfills(),
        // nodeResolve({ preferBuiltins: false }),
        nodeResolve(),
        commonjs(),
        inject({
            modules: {
                // BigInt: require.resolve('big-integer'),
                process: 'process-es6',
                Buffer: ['buffer', 'Buffer'],
			},
        }),
    ],
}
