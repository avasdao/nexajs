/* Import modules. */
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes.js'

/* Set constants. */
// const AES_ALGO = 'aes-128-cbc' // NOTE: Offers greatest compatibility (with legacy systems).
// const AES_ALGO = 'aes-256-cbc'
const AES_ALGO = 'aes-256-ctr' // NOTE: Offers the least compatibility (with legacy systems).

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_privkey, _iv, _ciphertext, _algo = AES_ALGO) => {
    // console.log(`Decrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    let bodyType
    let cipher
    let crypted
    let encryptedBody
    let iv
    let key
    let privateKey

    /* Validate parameters. */
    // NOTE: Initialization vector is an OPTIONAL parameter.
    if (typeof _ciphertext === 'undefined' || _ciphertext === null) {
        /* Set plain body. */
        encryptedBody = _iv

        /* Set initialization vector. */
        // NOTE: This value MUST be unique for EVERY encryption.
        iv = null
    } else {
        /* Set encrypted body. */
        encryptedBody = _ciphertext

        /* Set initialization vector. */
        // NOTE: This value MUST be unique for EVERY encryption.
        iv = Buffer.from(_iv, 'hex')
    }

    encryptedBody = Buffer.from(_ciphertext, 'hex')
    // console.log('ENCRYPTED BODY', encryptedBody)

    /* Validate plain body. */
    if (!encryptedBody) {
        throw new Error(`Oops! You're missing an Encrypted Body in your parameters.`)
    }

    /* Validate initialization vector. */
    if (!iv) {
        throw new Error(`Oops! You're missing the Initialization Vector (IV) in your parameters.`)
    }

    /* Validate encrypted body. */
    if (typeof encryptedBody === 'string' || encryptedBody instanceof String) {
        bodyType = 'string'

        // encryptedBody = encryptedBody
    }

    /* Set private key. */
    // TODO Validate and convert, if necessary.
    privateKey = Buffer.from(_privkey, 'hex')

    /* Validate private key. */
    if (!privateKey) {
        throw new Error(`Oops! You're missing a KEY or PASSWORD in your parameters.`)
    }

    /* Initialize AES cipher. */
    cipher = crypto.createDecipheriv(_algo, privateKey, iv)

    /* Set auto-padding flag. */
    cipher.setAutoPadding(true)

    /* Update cipher. */
    crypted = cipher.update(encryptedBody, 'hex', 'hex')

    /* Append the final (data block). */
    crypted += cipher.final('hex')

    /* Return the (final) buffer. */
    return Buffer.from(crypted, 'hex')
}
