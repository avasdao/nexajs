import splitEvery from './splitEvery.js'

const hexByteWidth = 2
const hexadecimal = 16

/**
 * Decode a hexadecimal-encoded string into a Uint8Array.
 *
 * E.g.: `hexToBin('2a64ff')` → `new Uint8Array([42, 100, 255])`
 *
 * Note, this method always completes. If `validHex` is not divisible by 2,
 * the final byte will be parsed as if it were prepended with a `0` (e.g. `aaa`
 * is interpreted as `aa0a`). If `validHex` is potentially malformed, check
 * it with `isHex` before calling this method.
 *
 * @param validHex - a string of valid, hexadecimal-encoded data
 */
export default (validHex) =>
    Uint8Array.from(
        splitEvery(validHex, hexByteWidth).map((byte) =>
            parseInt(byte, hexadecimal)
        )
    )
