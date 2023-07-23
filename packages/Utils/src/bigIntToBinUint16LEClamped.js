import bigIntToBinUintLE from './bigIntToBinUintLE.js'
import binToFixedLength from './binToFixedLength.js'

/**
 * Encode a positive BigInt as an 8-byte Uint16LE Uint8Array, clamping the
 * results. (Values exceeding `0xffff` return the same result as
 * `0xffff`, negative values return the same result as `0`.)
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint16 = 2
    return binToFixedLength(bigIntToBinUintLE(value), uint16)
}
