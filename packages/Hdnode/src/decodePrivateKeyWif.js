/* Import modules. */
import { decodeBase58AddressFormat } from '@nexajs/address'
import { sha256 } from '@nexajs/crypto'

/**
 * Decode a private key using Wallet Import Format (WIF). See
 * `encodePrivateKeyWif` for details.
 *
 * @param sha256 - an implementation of sha256 (a universal implementation is
 * available via `instantiateSha256`)
 * @param wifKey - the private key to decode (in Wallet Import Format)
 */
// eslint-disable-next-line complexity
export default (wifKey) => {
    const compressedPayloadLength = 33
    const decoded = decodeBase58AddressFormat(wifKey)

    if (typeof decoded === 'string') return decoded

    const version = 35 // `0x23` NOTE: Bitcoin Cash is `128`/`0x80`.
    // const mainnet = decoded.version === Base58AddressFormatVersion.wif
    const mainnet = decoded.version === version
    const compressed = decoded.payload.length === compressedPayloadLength;
    const privateKey = compressed
        ? decoded.payload.slice(0, -1)
        : decoded.payload;

    const type = 'mainnet'

    return { privateKey, type }
}
