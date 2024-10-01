/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address Script Hash
 *
 * Translate a Bitcoin Cash or a Nexa address to a script hash. This method is
 * potentially useful for clients preferring to work with script hashes but
 * lacking the local libraries necessary to generate them.
 */
export default async function (_address) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.address.get_scripthash'

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
