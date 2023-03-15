import encodeCashAddressNonStandard from './encodeCashAddressNonStandard.js'
import cashAddressTypeToTypeBits from './cashAddressTypeToTypeBits.js'

/**
 * Encode a payload as a CashAddress.
 *
 * **Note: this function cannot prevent all implementation errors via types.**
 * The function will throw if `payload` is not a valid
 * {@link CashAddressSupportedLength}. Confirm the length of untrusted inputs
 * before providing them to this function.
 *
 * To encode a CashAddress with a custom/unknown prefix or type bit, see
 * {@link encodeCashAddressNonStandard}. For other address standards that
 * closely follow the CashAddress specification (but have alternative version
 * byte requirements), use {@link encodeCashAddressFormat}.
 *
 * @param prefix - the network for which to encode the address
 * (a {@link CashAddressNetworkPrefix})
 * @param type - the address type (a {@link CashAddressType})
 * @param payload - the payload to encode – for P2PKH, the public key hash; for
 * P2SH, the redeem bytecode hash
 */
export default (
    prefix,
    type,
    payload
) => encodeCashAddressNonStandard(
    prefix,
    cashAddressTypeToTypeBits[type],
    payload,
)
