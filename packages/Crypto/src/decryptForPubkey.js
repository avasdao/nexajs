/* Import modules. */
import crypto from 'crypto'

import decrypt from './decrypt.js'

import {
    PrivateKey,
    PublicKey,
} from '../index.js'

/* Set constants. */
const AES_ALGO = 'aes-128-cbc'


/**
 * Decrypt (Message) For Public Key
 *
 * Will decrypt a message that can ONLY be read by the
 * private key owner of the private key provided.
 */
export default (_privkey, _encrypted) => {
    //encryptedMessage, somePrivateKeyHexString
    /* Initialize private key. */
    const privateKey = new PrivateKey(_privkey)

    /* Initialize encrypted (message). */
    const encrypted = Buffer.from(_encrypted, 'base64')
    // console.log('ENCRYPTED', encrypted.toString('hex'))

    /* Valiate encrypted (message). */
    if (encrypted.length < 85) {
        throw new Error('invalid ciphertext: length')
    }

    /* Set magic (bytes). */
    const magic = encrypted.slice(0, 4)
    // console.log('MAGIC', magic)

    /* Initialize ephemeral public key. */
    let ephemeralPubkey = Buffer.from(encrypted.slice(4, 37))
    // console.log('EPHERMAL PUBLIC KEY', ephemeralPubkey)

    /* Set ciphertext. */
    const ciphertext = encrypted.slice(37, -32)
    // console.log('CIPHERTEXT', ciphertext)

    /* Set MAC. */
    const mac = encrypted.slice(-32)
    // console.log('MAC', mac);

    /* Validate magic (bytes). */
    if (magic.toString() !== 'HUSH') {
        throw new Error('invalid ciphertext: invalid magic bytes')
    }

    try {
        /* Set ephemeral public key. */
        ephemeralPubkey = PublicKey(ephemeralPubkey)
    } catch (error) {
        throw new Error('invalid ciphertext: invalid ephemeral pubkey')
    }

    /* Validate point (on curve). */
    // NOTE: This will set the `isValid` flag??
    ephemeralPubkey.point.validate()

    // TODO Validate flag.

    /* Set secret multiplier. */
    const secretMultiplier = privateKey.toBigNumber()

    /* Set ECDH key. */
    const ecdhKey = PublicKey(
        ephemeralPubkey.point.mul(secretMultiplier)).toBuffer()

    /* Set key. */
    const key = crypto
        .createHash('sha512')
        .update(ecdhKey)
        .digest()

    /* Set initialization vector. */
    const iv = key.slice(0, 16)

    /* Set key (E). */
    const keyE = key.slice(16, 32)

    /* Set key (M). */
    const keyM = key.slice(32)

    /* Calculate the "valid" MAC. */
    const validMac = crypto
        .createHmac('sha256', keyM)
        .update(encrypted.slice(0, -32))
        // .update(encrypted.slice(-32)) // THIS SHOULD WORK AS WELL
        .digest('hex')

    /* Validate MAC. */
    if (mac.toString('hex') !== validMac) {
        throw new Error('invalid password')
    }

    /* Return decrypted string. */
    return decrypt(keyE, iv, ciphertext, AES_ALGO)
}
