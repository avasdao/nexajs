/**
 * Encode a positive number as a 4-byte Uint32BE Uint8Array.
 *
 * This method will return an incorrect result for values outside of the range
 * `0` to `0xffffffff`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint32Length = 4
    const bin = new Uint8Array(uint32Length)
    const writeAsLittleEndian = false
    const view = new DataView(bin.buffer, bin.byteOffset, bin.byteLength)

    // eslint-disable-next-line functional/no-expression-statement
    view.setUint32(0, value, writeAsLittleEndian)

    return bin
}
