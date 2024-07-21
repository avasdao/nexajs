/* Import modules. */
import {
    PrivateKey,
    PublicKey,
} from '@nexajs/crypto'


/**
 * Encrypt
 */
export default (plaintextMessage, pubkey) => {
    /* Initialize public key. */
    const publicKey = PublicKey(pubkey)

    /* Initialize ephemeral (private key). */
    const ephemeral = new PrivateKey()

    /* Set ECDH key. */
    // NOTE: This is our shared secret with the pubkey holder.
    const ecdhKey = PublicKey(
        publicKey.point.mul(ephemeral.toBigNumber())).toBuffer()

    /* Set key. */
    // NOTE: We hash the shared secret as:
    //         1. First 16 bytes is the IV for AES.
    //         2. Second 16 bytes is the key for AES.
    //         3. Final 32 bytes are used for the HMAC.
    const key = crypto.createHash('sha512').update(ecdhKey).digest()

    /* Set ciphertext. */
    const ciphertext = _aesEncryptWithIV(
        key.slice(16, 32),
        key.slice(0, 16),
        Buffer.from(plaintextMessage, 'utf8')
    )

    /* Set encrypted. */
    // NOTE: We send the public key, for our ephemeral private key,
    //       as an unencrypted buffer, as part of the prefix to our
    //       encrypted package. This allows ONLY the `pubkey` holder to
    //       decrypt our (ciphertext) message.
    const encrypted = Buffer.concat([
        Buffer.from('HUSH'),
        ephemeral.publicKey.toBuffer(),
        ciphertext
    ])

    /* Set MAC. */
    const mac = crypto
        .createHmac('sha256', key.slice(32))
        .update(encrypted)
        .digest()

    /* Return encrypted. */
    return Buffer.concat([encrypted, mac]).toString('base64')
}
