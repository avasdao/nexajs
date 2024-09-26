/* Import modules. */
import { decodeBase58AddressFormat } from '@nexajs/address'

/**
 * Decode a private key using Wallet Import Format (WIF). See
 * `encodePrivateKeyWif` for details.
 *
 * @param wifKey - the private key to decode (in Wallet Import Format)
 */
export default (wifKey) => {
    /* Set compressed payload length. */
    const compressedPayloadLength = 33

    /* Decode WIF key. */
    const decoded = decodeBase58AddressFormat(wifKey)

    /* Validate decoded. */
    if (typeof decoded === 'string') {
        return decoded
    }

    /* Set (Nexa) version. */
    // NOTE: Bitcoin Cash uses `128|0x80`.
    const version = 35 // `0x23`
    // const mainnet = decoded.version === Base58AddressFormatVersion.wif
    // const mainnet = decoded.version === version
    const compressed = decoded.payload.length === compressedPayloadLength
    const privateKey = compressed
        ? decoded.payload.slice(0, -1)
        : decoded.payload

    /* Set network type. */
    // FIXME Support adt'l network types.
    const type = 'mainnet'

    /* Return private key. */
    return {
        privateKey,
        type,
    }
}
