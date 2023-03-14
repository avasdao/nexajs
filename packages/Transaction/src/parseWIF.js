/* Import modules. */
import {
    binToHex,
    // CashAddressType,
    decodePrivateKeyWif,
    // encodeCashAddress,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

import { CashAddressType } from './_CashAddressType.js'
import { encodeCashAddress } from './_encodeCashAddress.js'

/**
 * Parse a WIF string into a private key, public key and address.
 *
 * @function
 *
 * @param wif {string} Wallet in WIF format.
 *
 * @returns {Promise<Array<String>>} Array containing [0] Private Key, [1] Public Key and [2] Address.
 */
const parseWIF = async (wif) => {
    // Instantiate Libauth crypto interfaces
    const secp256k1 = await instantiateSecp256k1()
    const sha256 = await instantiateSha256()
    const ripemd160 = await instantiateRipemd160()

    // Attempt to decode WIF string into a private key
    const decodeResult = decodePrivateKeyWif(sha256, wif)

    // If decodeResult is a string, it represents an error, so we throw it.
    if (typeof decodeResult === 'string') {
        throw(new Error(decodeResult))
    }

    // Extract the private key from the decodeResult.
    const privateKeyBin = decodeResult.privateKey

    // Derive the corresponding public key.
    const publicKeyBin = secp256k1.derivePublicKeyCompressed(privateKeyBin)

    // Hash the public key hash according to the P2PKH scheme.
    const publicKeyHashBin = ripemd160.hash(sha256.hash(publicKeyBin))

    // Encode the public key hash into a P2PKH cash address.
    const address = encodeCashAddress('bitcoincash', CashAddressType.P2PKH, publicKeyHashBin)
    // TODO: Add support for `nexa` template format.

    return [
        binToHex(privateKeyBin),
        binToHex(publicKeyBin),
        address,
    ]
}

/* Export module. */
export default parseWIF
