import bigIntToBinUint32LEClamped from './bigIntToBinUint32LEClamped.js'

/**
 * Encode a positive BigInt as an 8-byte Uint32LE Uint8Array.
 *
 * This method will return an incorrect result for values outside of the range
 * `0` to `0xffff_ffff`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint32LengthInBits = 32
    const valueAsUint32 = BigInt.asUintN(uint32LengthInBits, value)
    const fixedLengthBin = bigIntToBinUint32LEClamped(valueAsUint32)
    return fixedLengthBin
}
