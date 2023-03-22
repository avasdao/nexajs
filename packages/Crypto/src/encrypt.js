/* Import modules. */
import AES = from 'crypto-js/aes'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:encrypt')

/**
 * AES Encrypt
 */
const _aesEncrypt = (_plainBody, _key) => {
    /* Encrypt plain body. */
    const encryptedBody = AES.encrypt(_plainBody, _key)
    debug(`Plain body (formatted): [ ${plainBody} ]`)
    debug(`Encrypted body: [ ${encryptedBody} ]`)

    /* Return encrypted body. */
    return encryptedBody
}

/**
 * Encrypt
 *
 * Performs AES encryption on the plain body provided to the function.
 *
 * Parameters:
 *   - body (required)
 *   - key | password (required)
 */
export default (_params, _key) => {
    debug(`Encrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    let bodyType
    let key
    let plainBody
    let encryptedBody

    /* Handle Basic encryption request. */
    if (_params && _key) {

    }

    /* Set plain body. */
    plainBody = _params?.body

    /* Validate plain body. */
    if (!plainBody) {
        throw new Error(`Oops! You're missing a BODY in your parameters.`)
    }

    /* Validate (String) body. */
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

    /* Set (password) key. */
    key = _params?.key || _params?.password

    /* Validate (password) key. */
    if (!key) {
        throw new Error(`Oops! You're missing a KEY or PASSWORD in your parameters.`)
    }

    /* Return encrypted body. */
    return _aesEncrypt(plainBody, key)
}
