import bigIntToBinUintLE from './bigIntToBinUintLE.js'
import binToFixedLength from './binToFixedLength.js'

/**
 * Encode a positive BigInt as an 8-byte Uint64LE Uint8Array, clamping the
 * results. (Values exceeding `0xffff_ffff_ffff_ffff` return the same result as
 * `0xffff_ffff_ffff_ffff`, negative values return the same result as `0`.)
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint64 = 8
    return binToFixedLength(bigIntToBinUintLE(value), uint64)
}
