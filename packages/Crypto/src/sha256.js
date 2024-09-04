/* Import modules. */
import CryptoJS from 'crypto-js'
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/**
 * SHA-256
 *
 * Performs hashing on the body provided to the function.
 *
 * Allows specification of the response format.
 */
export default (_body, _format) => {
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
    hash = CryptoJS.SHA256(body).toString()

    /* Handle format conversion. */
    if (format === 'binary') {
        hash = hexToBin(hash)
    }

    /* Return hash. */
    return hash
}
