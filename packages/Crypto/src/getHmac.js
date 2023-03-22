/* Import modules. */
import HmacSHA512 = from 'crypto-js/hmac-sha512'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto:getHmac')

export default (_params) => {
    const apiKey = 'aad1324e5dbf5dcd'
    const secret = 'f874e132af822b20fa736b013fb489cbc6599'

    const signature = HmacSHA512(request.data, secret).toString()
    debug(`HMAC-512 signature: [ ${signature} ]`)
}
