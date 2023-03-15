import {
    decodeBech32,
    encodeBech32,
    isBech32CharacterSet,
    regroupBits,
} from './bech32.js'

import maskCashAddressPrefix from './maskCashAddressPrefix.js'
import cashAddressPolynomialModulo from './cashAddressPolynomialModulo.js'
import cashAddressChecksumToUint5Array from './cashAddressChecksumToUint5Array.js'

const Constants = {
    cashAddressTypeBitsShift: 3,
    base32WordLength: 5,
    base256WordLength: 8,
    payloadSeparator: 0,
    asciiLowerCaseStart: 96,
    finiteFieldOrder: 32,
    cashAddressReservedBitMask: 0b10000000,
    cashAddressTypeBits: 0b1111,
    cashAddressSizeBits: 0b111,
    /**
     * In ASCII, each pair of upper and lower case characters share the same 5 least
     * significant bits.
     */
    asciiCaseInsensitiveBits: 0b11111,
}

/**
 * Encode a payload as a CashAddress-like string using the CashAddress format.
 *
 * To encode a standard CashAddress, use {@link encodeCashAddress}.
 *
 * @param prefix - a valid prefix indicating the network for which to encode the
 * address – must be only lowercase letters (for standard CashAddress prefixes,
 * see {@link CashAddressNetworkPrefix})
 * @param version - a single byte indicating the version of this address (for
 * standard CashAddress versions, see {@link CashAddressVersionByte})
 * @param payload - the payload to encode
 */
export default (
    prefix,
    version,
    payload
) => {
    const checksum40BitPlaceholder = [0, 0, 0, 0, 0, 0, 0, 0]

    const payloadContents = regroupBits({
        bin: Uint8Array.from([version, ...payload]),
        resultWordLength: Constants.base32WordLength,
        sourceWordLength: Constants.base256WordLength,
    })

    const checksumContents = [
        ...maskCashAddressPrefix(prefix),
        Constants.payloadSeparator,
        ...payloadContents,
        ...checksum40BitPlaceholder,
    ]

    const checksum = cashAddressPolynomialModulo(checksumContents)

    const encoded = [
        ...payloadContents,
        ...cashAddressChecksumToUint5Array(checksum),
    ]

    return `${prefix}:${encodeBech32(encoded)}`
}
