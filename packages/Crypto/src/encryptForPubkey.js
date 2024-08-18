/* Import modules. */
import crypto from 'crypto'

import encrypt from './encrypt.js'

import {
    PrivateKey,
    PublicKey,
} from '../index.js'

/* Set constants. */
const AES_ALGO = 'aes-128-cbc'


/**
 * Encrypt (Message) For Public Key
 *
 * Will encrypt a message that can ONLY be read by the
 * private key owner of the public key provided.
 */
export default (_pubkey, _msg) => {
    /* Initialize public key. */
    const publicKey = PublicKey(_pubkey)

    /* Initialize ephemeral (private key). */
    const ephemeral = new PrivateKey()

    /* Set ECDH key. */
    // NOTE: This is our shared secret with the pubkey holder.
    const sharedSecret = PublicKey(
        publicKey.point.mul(ephemeral.toBigNumber())).toBuffer()
    // console.log('SHARED SECRET', sharedSecret)

    /* Set key. */
    // NOTE: We hash the shared secret as:
    //         1. First 16 bytes is the IV for AES.
    //         2. Second 16 bytes is the key for AES.
    //         3. Final 32 bytes are used for the HMAC.
    const key = crypto
        .createHash('sha512')
        .update(sharedSecret)
        .digest()

    /* Set ciphertext. */
    const ciphertext = encrypt(
        key.slice(16, 32),
        key.slice(0, 16),
        Buffer.from(_msg, 'utf8'),
        AES_ALGO,
    ).ciphertext
    // console.log('CIPHERTEXT', ciphertext)

    /* Set encrypted. */
    // NOTE: We send the public key, for our ephemeral private key,
    //       as an (un-)encrypted buffer, as part of the prefix to our
    //       encrypted package. This allows ONLY the `pubkey` OWNER to
    //       decrypt our (ciphertext) message.
    const encrypted = Buffer.concat([
        Buffer.from('HUSH'),
        ephemeral.publicKey.toBuffer(),
        Buffer.from(ciphertext, 'hex'),
    ])
    // console.log('ENCRYPTED', encrypted)

    /* Set MAC. */
    const mac = crypto
        .createHmac('sha256', key.slice(32))
        .update(encrypted)
        .digest()
    // console.log('MAC', mac)

    /* Return encrypted. */
    return Buffer.concat([ encrypted, mac ]).toString('base64')
}
