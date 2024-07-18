/**
 * Encode a positive integer as a 2-byte Uint16LE Uint8Array.
 *
 * This method will return an incorrect result for values outside of the range
 * `0` to `0xffff`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const uint16Length = 2
    const bin = new Uint8Array(uint16Length)
    const writeAsLittleEndian = false
    const view = new DataView(bin.buffer, bin.byteOffset, bin.byteLength)

    // eslint-disable-next-line functional/no-expression-statement
    view.setUint16(0, value, writeAsLittleEndian)

    return bin
}
