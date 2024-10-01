/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Headers Tip
 *
 * Get the latest block header (tip of the blockchain).
 */
export default async function () {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.headers.tip'

    /* Set parameters. */
    params = []

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
