import encodeCashAddressFormat from './encodeCashAddressFormat.js'
import encodeCashAddressVersionByte from './encodeCashAddressVersionByte.js'
import formatError from './formatError.js'
import isValidCashAddressPayloadLength from './isValidCashAddressPayloadLength.js'

/**
 * Encode a payload as a CashAddress. This function is similar to
 * {@link encodeCashAddress} but supports non-standard `prefix`es and `type`s.
 *
 * **Note: this function cannot prevent all implementation errors via types.**
 * The function will throw if `payload` is not a valid
 * {@link CashAddressSupportedLength}. Confirm the length of untrusted inputs
 * before providing them to this function.
 *
 * For other address standards that closely follow the CashAddress
 * specification (but have alternative version byte requirements), use
 * {@link encodeCashAddressFormat}.
 *
 * @param prefix - a valid prefix indicating the network for which to encode the
 * address (usually a {@link CashAddressNetworkPrefix}) – must be only lowercase
 * letters
 * @param typeBits - the type bit to encode in the version byte – must be a
 * number between `0` and `15`
 * @param payload - the payload to encode (for P2PKH, the public key hash; for
 * P2SH, the redeem bytecode hash)
 */
export default (
    prefix,
    typeBits,
    payload
) => {
    const { length } = payload

    if (!isValidCashAddressPayloadLength(length)) {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error(
            formatError(
                CashAddressEncodingError.unsupportedPayloadLength,
                `Payload length: ${length}.`
            )
        )
    }

    return encodeCashAddressFormat(
        prefix,
        encodeCashAddressVersionByte(typeBits, length),
        payload,
    )
}
