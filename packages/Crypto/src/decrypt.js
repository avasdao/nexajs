/* Import modules. */
import AES = from 'crypto-js/aes'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:decrypt')

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_params) => {
    debug(`Decrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    let bodyType
    let plainBody
    let encryptedBody

    /* Validate plain body. */
    if (typeof _plainBody === 'string' || _plainBody instanceof String) {
        bodyType = 'string'

        plainBody = _plainBody
    }

    /* Validate body type. */
    if (!bodyType) {
        try {
            /* Parse plain body. */
            plainBody = JSON.stringify(JSON.parse(_plainBody))

            /* Set body type. */
            bodyType = 'json'
        } catch (e) { /* do nothing */ }
    }

    /* Encrypt plain body. */
    plainBody = AES.decrypt(encryptedBody, key)
    debug(`Plain body (formatted): [ ${plainBody} ]`)
    debug(`Encrypted body: [ ${encryptedBody} ]`)

    /* Return encrypted body. */
    return encryptedBody
}
