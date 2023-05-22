/* Import modules. */
import CryptoJS from 'crypto-js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:gethmac')

export default (_body, _secret) => {
    const signature = CryptoJS.HmacSHA512(_body, _secret).toString()
    debug(`HMAC-512 signature: [ ${signature} ]`)

    return signature
}
