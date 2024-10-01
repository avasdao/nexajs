/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address List Unspent
 *
 * Return an ordered list of UTXOs sent to a Bitcoin Cash or Nexa address.
 */
export default async function (_address) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.address.listunspent'

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
