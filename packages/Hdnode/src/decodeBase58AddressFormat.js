/**
 * Attempt to decode a Base58Address-formatted string. This is more lenient than
 * `decodeCashAddress`, which also validates the address version.
 *
 * Returns the contents of the address or an error message as a string.
 *
 * @param sha256 - an implementation of sha256 (a universal implementation is
 * available via `instantiateSha256`)
 * @param address - the string to decode as a base58 address
 */
export default (
    sha256,
    address,
) => {
    const checksumBytes = 4
    const bin = base58ToBin(address)

    if (bin === BaseConversionError.unknownCharacter) {
        return Base58AddressError.unknownCharacter
    }

    const minimumBase58AddressLength = 5

    if (bin.length < minimumBase58AddressLength) {
        return Base58AddressError.tooShort
    }

    const content = bin.slice(0, -checksumBytes)
    const checksum = bin.slice(-checksumBytes)

    const expectedChecksum = sha256
        .hash(sha256.hash(content))
        .slice(0, checksumBytes)

    if (!checksum.every((value, i) => value === expectedChecksum[i])) {
        return Base58AddressError.invalidChecksum
    }

    return {
        payload: content.slice(1),
        version: content[0],
    }
}
