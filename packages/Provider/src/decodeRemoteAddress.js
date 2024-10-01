/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Decode Remote Address
 *
 * Decode a Bitcoin Cash or a Nexa address to its raw payload. This method is
 * potentially useful for clients needing to see the encoded contents of a
 * address but lacking the local libraries necessary to decode them.
 */
export default async function (_address) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.address.decode'

    /* Set parameters. */
    params = [ _address ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
