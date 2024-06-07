/* Import modules. */
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes.js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:decrypt')

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_params, _key) => {
    debug(`Decrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    let bodyType
    let key
    let plainBody
    let encryptedBody

    /* Handle Basic encryption request. */
    if (_params && _key) {

    }

    /* Set plain body. */
    encryptedBody = _params?.body

    /* Validate plain body. */
    if (typeof encryptedBody === 'string' || encryptedBody instanceof String) {
        bodyType = 'string'

        // encryptedBody = encryptedBody
    }

    /* Set (password) key. */
    // key = _params?.key || _params?.password
    key = _key

    /* Validate body type. */
    if (!bodyType) {
        try {
            /* Parse plain body. */
            encryptedBody = JSON.stringify(JSON.parse(encryptedBody))

            /* Set body type. */
            bodyType = 'json'
        } catch (e) { /* do nothing */ }
    }

    /* Encrypt plain body. */
    plainBody = AES.decrypt(encryptedBody, key)
    debug(`Plain body (formatted): [ ${plainBody} ]`)
    debug(`Encrypted body: [ ${encryptedBody} ]`)

    /* Return encrypted body. */
    return plainBody.toString(CryptoJS.enc.Utf8)
}
