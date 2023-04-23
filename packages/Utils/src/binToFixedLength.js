/**
 * Fill a new Uint8Array of a specific byte-length with the contents of a given
 * Uint8Array, truncating or padding the Uint8Array with zeros.
 *
 * @param bin - the Uint8Array to resize
 * @param bytes - the desired byte-length
 */
export default (bin, bytes) => {
    const fixedBytes = new Uint8Array(bytes)
    const maxValue = 255
    // eslint-disable-next-line functional/no-expression-statement
    bin.length > bytes ? fixedBytes.fill(maxValue) : fixedBytes.set(bin)
    // TODO: re-enable eslint-disable-next-line @typescript-eslint/no-unused-expressions
    return fixedBytes
}
