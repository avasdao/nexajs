const hexByteWidth = 2
const hexadecimal = 16

/**
 * Encode a Uint8Array into a hexadecimal-encoded string.
 *
 * E.g.: `binToHex(new Uint8Array([42, 100, 255]))` → `'2a64ff'`
 *
 * @param bytes - a Uint8Array to encode
 */
export default (bytes) =>
    bytes.reduce(
        (str, byte) => str + byte.toString(hexadecimal).padStart(hexByteWidth, '0'),
        ''
    )
