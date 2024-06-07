/* Import modules. */
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes.js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:encrypt')

CryptoJS.pad.NoPadding = { pad: function(){}, unpad: function(){} }

/**
 * AES Encrypt
 */
const _aesEncrypt = (_plainBody, _key, _iv) => {
    /* Encrypt plain body. */
    const encryptedBody = AES.encrypt(_plainBody, _key)

    // // const text = "My Secret text\0\0"
    // const text = "My Secret text\0\0"
    // const key  = CryptoJS.enc.Hex.parse("253d3fb468a0e24677c28a624be0f939")
    // const iv   = CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
    //
    // const encrypted = CryptoJS.AES.encrypt(text, key, { iv })
    // // var encrypted = CryptoJS.AES.encrypt(text, key);
    //
    // console.log(encrypted.toString());

    debug(`Plain body (formatted): [ ${_plainBody} ]`)
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
    if (typeof plainBody === 'string' || plainBody instanceof String) {
        bodyType = 'string'

        // plainBody = plainBody
    }

    /* Validate body type. */
    if (!bodyType) {
        try {
            /* Parse plain body. */
            plainBody = JSON.stringify(JSON.parse(plainBody))

            /* Set body type. */
            bodyType = 'json'
        } catch (e) { /* do nothing */ }
    }

    /* Set (password) key. */
    // key = _params?.key || _params?.password
    key = _key

    /* Validate (password) key. */
    if (!key) {
        throw new Error(`Oops! You're missing a KEY or PASSWORD in your parameters.`)
    }

    /* Return encrypted body. */
    return _aesEncrypt(plainBody, key)
}
