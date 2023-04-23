import bigIntToBinUint64LEClamped from './bigIntToBinUint64LEClamped.js'

/**
 * Encode a positive BigInt as an 8-byte Uint64LE Uint8Array.
 *
 * This method will return an incorrect result for values outside of the range
 * `0` to `0xffff_ffff_ffff_ffff`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint64LengthInBits = 64
    const valueAsUint64 = BigInt.asUintN(uint64LengthInBits, value)
    const fixedLengthBin = bigIntToBinUint64LEClamped(valueAsUint64)
    return fixedLengthBin
}
