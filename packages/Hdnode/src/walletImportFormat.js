import {
    // Base58AddressFormatVersion,
    decodeBase58AddressFormat,
    encodeBase58AddressFormat,
} from '@bitauth/libauth'

export const WalletImportFormatError = {
    incorrectLength: 'The WIF private key payload is not the correct length.',
}

/**
 * The network and address format in which a WIF-encoded private key is expected
 * to be used.
 *
 * WIF-encoding is generally used to serialize private keys for Pay to Public
 * Key (P2PKH) addresses – each WIF-encoded private key specifies the
 * compression of the public key to use in the P2PKH address:
 *
 * - The values `mainnet` and `testnet` indicate that the address should use the
 * compressed form of the derived public key (33 bytes, beginning with `0x02` or
 * `0x03`) on the respective network.
 * - The less common `mainnet-uncompressed` and `testnet-uncompressed` values
 * indicate that the address should use the uncompressed form of the public key
 * (65 bytes beginning with `0x04`) on the specified network.
 */
export const WalletImportFormatType = 'mainnet'
  // | 'testnet'
  // | 'mainnet-uncompressed'
  // | 'testnet-uncompressed';

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
export const encodePrivateKeyWif = (
    sha256,
    privateKey,
    type
) => {
    const compressedByte = 0x01;
    const mainnet = type === 'mainnet' || type === 'mainnet-uncompressed';
    const compressed = type === 'mainnet' || type === 'testnet';
    const payload = compressed
        ? Uint8Array.from([...privateKey, compressedByte])
        : privateKey;
    const version = 35 // `0x23` NOTE: Bitcoin Cash is `128`/`0x80`.

    return encodeBase58AddressFormat(
        sha256,
        version,
        payload
    )
}

/**
 * Decode a private key using Wallet Import Format (WIF). See
 * `encodePrivateKeyWif` for details.
 *
 * @param sha256 - an implementation of sha256 (a universal implementation is
 * available via `instantiateSha256`)
 * @param wifKey - the private key to decode (in Wallet Import Format)
 */
// eslint-disable-next-line complexity
export const decodePrivateKeyWif = (
    sha256,
    wifKey
) => {
    const compressedPayloadLength = 33
    const decoded = decodeBase58AddressFormat(sha256, wifKey)
    console.log('decodeBase58AddressFormat(sha256, wifKey)', decodeBase58AddressFormat(sha256, wifKey))

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
