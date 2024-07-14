/* Import modules. */
import CryptoJS from 'crypto-js'

export default (_secret, _body) => {
    const signature = CryptoJS.HmacSHA512(_body, _secret).toString()
    // console.log(`HMAC-512 signature: [ ${signature} ]`)

    return signature
}
