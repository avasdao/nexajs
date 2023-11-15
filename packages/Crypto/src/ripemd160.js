/* Import modules. */
import CryptoJS from 'crypto-js'
import { binToHex } from '@nexajs/utils'
import { hexToBin } from '@nexajs/utils'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:ripemd160')

/**
 * SHA-512
 *
 * Performs hashing on the body provided to the function.
 *
 * Allows specification of the response format.
 */
export default (_body, _format) => {
    debug(`Decrypt (params): [ ${JSON.stringify(_body, null, 2)} ]`)

    /* Initialize locals. */
    let body
    let format
    let hash

    /* Validate body. */
    if (typeof _body === 'string') {
        format = _format || 'hex'
        body = CryptoJS.enc.Utf8.parse(_body)
    } else {
        format = _format || 'binary'
        body = CryptoJS.enc.Hex.parse(binToHex(_body))
    }

    /* Hash body. */
    hash = CryptoJS.RIPEMD160(body).toString()
    debug(`Hashed: [ ${hash} ]`)

    /* Handle format conversion. */
    if (format === 'binary') {
        hash = hexToBin(hash)
    }

    /* Return hash. */
    return hash
}
