/* Import modules. */
import CryptoJS from 'crypto-js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:sha512')

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_params) => {
    debug(`Decrypt (params): [ ${JSON.stringify(_params, null, 2)} ]`)

    // let bodyType
    let hash
    // let encryptedBody

    /* Validate plain body. */
    // if (typeof _plainBody === 'string' || _plainBody instanceof String) {
    //     bodyType = 'string'
    //
    //     plainBody = _plainBody
    // }

    /* Validate body type. */
    // if (!bodyType) {
    //     try {
    //         /* Parse plain body. */
    //         plainBody = JSON.stringify(JSON.parse(_plainBody))
    //
    //         /* Set body type. */
    //         bodyType = 'json'
    //     } catch (e) { /* do nothing */ }
    // }

    /* Decrypt plain body. */
    hash = CryptoJS.SHA256(_params).toString(CryptoJS.enc.Hex)
    // debug(`Plain body (formatted): [ ${plainBody} ]`)
    debug(`Hashed: [ ${hash} ]`)

    /* Return hash. */
    return hash
}
