/* Import modules. */
import { flattenBinArray } from '@nexajs/utils'
import { sha512 } from '../index.js'

/**
 * Get HMAC
 */
export default (_secret, _message, _size = 512) => {
    /* Calculate byte length. */
    const blockByteLength = (_size / 4) // 128

    const key = new Uint8Array(blockByteLength)
        .fill(0)

    // eslint-disable-next-line functional/no-expression-statement
    key.set(_secret.length > blockByteLength ? sha512(_secret) : _secret, 0)

    const innerPaddingFill = 0x36

    const innerPadding = new Uint8Array(blockByteLength)
        .fill(innerPaddingFill)

    // eslint-disable-next-line no-bitwise
    const innerPrefix = innerPadding.map((pad, index) => pad ^ key[index])

    const innerContent = flattenBinArray([ innerPrefix, _message ])

    const innerResult = sha512(innerContent)

    const outerPaddingFill = 0x5c

    const outerPadding = new Uint8Array(blockByteLength)
        .fill(outerPaddingFill)

    // eslint-disable-next-line no-bitwise
    const outerPrefix = outerPadding.map((pad, index) => pad ^ key[index])

    return sha512(flattenBinArray([ outerPrefix, innerResult ]))
}
