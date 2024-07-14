/* Import modules. */
import { sha256 } from '@nexajs/crypto'
import { base58ToBin } from '@nexajs/utils'

const Base58AddressError = {
  unknownCharacter: 'Base58Address error: address may only contain valid base58 characters.',
  tooShort: 'Base58Address error: address is too short to be valid.',
  invalidChecksum: 'Base58Address error: address has an invalid checksum.',
  unknownAddressVersion: 'Base58Address error: address uses an unknown address version.',
  incorrectLength: 'Base58Address error: the encoded payload is not the correct length (20 bytes).',
}

const BaseConversionError = {
  tooLong: 'An alphabet may be no longer than 254 characters.',
  ambiguousCharacter: 'A character code may only appear once in a single alphabet.',
  unknownCharacter: 'Encountered an unknown character for this alphabet.',
}

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
export default (address) => {
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

    const expectedChecksum = sha256(sha256(content))
        .slice(0, checksumBytes)

    if (!checksum.every((value, i) => value === expectedChecksum[i])) {
        return Base58AddressError.invalidChecksum
    }

    return {
        payload: content.slice(1),
        version: content[0],
    }
}
