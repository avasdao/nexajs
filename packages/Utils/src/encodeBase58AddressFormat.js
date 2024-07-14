/**
 * Encode a payload using the Base58Address format, the original address format
 * used by the Satoshi implementation.
 *
 * Note, this method does not enforce error handling via the type system. The
 * returned string will not be a valid Base58Address if `hash` is not exactly 20
 * bytes. If needed, validate the length of `hash` before calling this method.
 *
 * @remarks
 * A Base58Address includes a 1-byte prefix to indicate the address version, a
 * variable-length payload, and a 4-byte checksum:
 *
 * `[version: 1 byte] [payload: variable length] [checksum: 4 bytes]`
 *
 * The checksum is the first 4 bytes of the double-SHA256 hash of the version
 * byte followed by the payload.
 *
 * @param sha256 - an implementation of sha256 (a universal implementation is
 * available via `instantiateSha256`)
 * @param version - the address version byte (see `Base58Version`)
 * @param payload - the Uint8Array payload to encode
 */
export default (
    sha256,
    version,
    payload
) => {
    const checksumBytes = 4
    const content = Uint8Array.from([version, ...payload])
    const checksum = sha256.hash(sha256.hash(content)).slice(0, checksumBytes)
    const bin = flattenBinArray([content, checksum])

    return binToBase58(bin)
}
