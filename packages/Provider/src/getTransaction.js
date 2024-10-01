/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Transaction (Info)
 *
 * Return an the FULL transaction details.
 */
export default async function (_id, _verbose = true) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.transaction.get'

    /* Set parameters. */
    params = [
        _id,
        _verbose,
    ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
