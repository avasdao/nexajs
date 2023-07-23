import bigIntToBinUint16LEClamped from './bigIntToBinUint16LEClamped.js'

/**
 * Encode a positive BigInt as an 8-byte Uint16LE Uint8Array.
 *
 * This method will return an incorrect result for values outside of the range
 * `0` to `0xffff`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint16LengthInBits = 16
    const valueAsUint16 = BigInt.asUintN(uint16LengthInBits, value)
    const fixedLengthBin = bigIntToBinUint16LEClamped(valueAsUint16)
    return fixedLengthBin
}
