/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Block (Info)
 *
 * Return an the FULL block details.
 */
export default async function (_hash_or_height) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.block.get'

    /* Set parameters. */
    params = [ _hash_or_height ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
