/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

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
    /* Instantiate Libauth crypto interfaces */
    const secp256k1 = await instantiateSecp256k1()
    const sha256 = await instantiateSha256()
    const ripemd160 = await instantiateRipemd160()

    /* Attempt to decode WIF string into a private key */
    const decodeResult = decodePrivateKeyWif(sha256, _wif)

    /* If decodeResult is a string, it represents an error, so we throw it. */
    if (typeof decodeResult === 'string') {
        throw(new Error(decodeResult))
    }

    /* Extract the private key from the decodeResult. */
    const privateKey = decodeResult.privateKey

    /* Derive the corresponding public key. */
    const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)

    /* Hash the public key hash according to the P2PKH scheme. */
    const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))

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
