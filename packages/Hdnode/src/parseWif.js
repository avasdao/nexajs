/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    derivePublicKeyCompressed,
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import decodePrivateKeyWif from './decodePrivateKeyWif.js'

/**
 * Parse a WIF string into a private key, public key and address.
 *
 * @function
 *
 * @param _wif {string} Wallet in WIF format.
 *
 * @returns {Promise<Array<String>>} Array containing [0] Private Key, [1] Public Key and [2] Address.
 */
export default async (_wif, _prefix = 'nexa', _format = 'TEMPLATE') => {
    /* Attempt to decode WIF string into a private key */
    const decodeResult = decodePrivateKeyWif(_wif)

    /* If decodeResult is a string, it represents an error, so we throw it. */
    if (typeof decodeResult === 'string') {
        throw(new Error(decodeResult))
    }

    /* Extract the private key from the decodeResult. */
    const privateKey = decodeResult.privateKey

    /* Derive the corresponding public key. */
    const publicKey = derivePublicKeyCompressed(privateKey)

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)

    /* Hash the public key hash according to the P2PKH scheme. */
    const publicKeyHash = ripemd160(sha256(scriptPushPubKey))

    /* Encode the public key hash into a P2PKH cash address. */
    const pkhScript = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash),
    ])

    /* Encode the address. */
    const address = encodeAddress(_prefix, _format, pkhScript)

    /* Return WIF package. */
    return {
        address,
        privateKey,
        publicKey,
    }
}
