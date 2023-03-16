/* Import modules. */
import {
    encodeBase58AddressFormat,
} from '@bitauth/libauth'

/**
 * Encode a private key using Wallet Import Format (WIF).
 *
 * WIF encodes the 32-byte private key, a 4-byte checksum, and a `type`
 * indicating the intended usage for the private key. See
 * `WalletImportFormatType` for details.
 *
 * @remarks
 * WIF-encoding uses the Base58Address format with version
 * `Base58AddressFormatVersion.wif` (`128`/`0x80`) or
 * `Base58AddressFormatVersion.wifTestnet` (`239`/`0xef`), respectively.
 *
 * To indicate that the private key is intended for use in a P2PKH address using
 * the compressed form of its derived public key, a `0x01` is appended to the
 * payload prior to encoding. For the uncompressed construction, the extra byte
 * is omitted.
 *
 * @param sha256 - an implementation of sha256 (a universal implementation is
 * available via `instantiateSha256`)
 * @param privateKey - a 32-byte Secp256k1 ECDSA private key
 * @param type - the intended usage of the private key (e.g. `mainnet` or
 * `testnet`)
 */
export default (
    sha256,
    privateKey,
    type
) => {
    const compressedByte = 0x01
    const mainnet = type === 'mainnet' || type === 'mainnet-uncompressed'
    const compressed = type === 'mainnet' || type === 'testnet'
    const payload = compressed
        ? Uint8Array.from([...privateKey, compressedByte])
        : privateKey
    const version = 35 // `0x23` NOTE: Bitcoin Cash is `128`/`0x80`.

    return encodeBase58AddressFormat(
        sha256,
        version,
        payload
    )
}
