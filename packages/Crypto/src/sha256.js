/* Import modules. */
import SHA256 from 'crypto-js/sha256.js'
import { hexToBin } from '@nexajs/utils'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:sha256')

/**
 * Decrypt
 *
 * Performs AES decryption on the encrypted body provided to the function.
 */
export default (_body, asBinary = false) => {
    debug(`Decrypt (params): [ ${JSON.stringify(_body, null, 2)} ]`)

    let hash

    /* Decrypt plain body. */
    if (asBinary) {
        hash = hexToBin(SHA256(_body).toString())
    } else {
        hash = SHA256(_body).toString()
    }
    // debug(`Plain body (formatted): [ ${plainBody} ]`)
    debug(`Hashed: [ ${hash} ]`)

    /* Return hash. */
    return hash
}
