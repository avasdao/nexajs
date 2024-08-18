/* Import modules. */
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes.js'

/* Set constants. */
// const AES_ALGO = 'aes-128-cbc' // NOTE: Offers greatest compatibility (with legacy systems).
const AES_ALGO = 'aes-256-cbc'
// const AES_ALGO = 'aes-256-ctr' // NOTE: Offers the least compatibility (with legacy systems).

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_privkey, _iv, _ciphertext) => {
    // console.log(`Decrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    let bodyType
    let cipher
    let crypted
    let encryptedBody
    let iv
    let key
    let plainBody

    iv = _ciphertext.slice(0, 4)
    console.log('(parsed) IV', iv)

    encryptedBody = _ciphertext.slice(4)
    console.log('ENCRYPTED BODY', encryptedBody)

    /* Validate encrypted body. */
    if (typeof encryptedBody === 'string' || encryptedBody instanceof String) {
        bodyType = 'string'

        // encryptedBody = encryptedBody
    }

    /* Initialize AES cipher. */
    cipher = crypto.createDecipheriv(AES_ALGO, _key, iv)

    /* Set auto-padding flag. */
    cipher.setAutoPadding(true)

    /* Update cipher. */
    crypted = cipher.update(encryptedBody, 'hex', 'hex')

    /* Append the final (data block). */
    crypted += cipher.final('hex')

    /* Return the (final) buffer. */
    return Buffer.from(crypted, 'hex')
}
