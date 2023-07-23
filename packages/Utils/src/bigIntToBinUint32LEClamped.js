import bigIntToBinUintLE from './bigIntToBinUintLE.js'
import binToFixedLength from './binToFixedLength.js'

/**
 * Encode a positive BigInt as an 8-byte Uint32LE Uint8Array, clamping the
 * results. (Values exceeding `0xffff_ffff` return the same result as
 * `0xffff_ffff`, negative values return the same result as `0`.)
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint32 = 4
    return binToFixedLength(bigIntToBinUintLE(value), uint32)
}
