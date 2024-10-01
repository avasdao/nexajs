/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Outpoint (Info)
 *
 * Returns data on a specified output of specific transaction. Returns error if
 * transaction or output does not exist.
 *
 * If the output is spent, information about the spender is provided. This
 * allows a SPV client to call blockchain.transaction.get\_merkle to generate a
 * merkle branch, proving that it is spent.
 */
export default async function (_outpoint_hash) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.utxo.get'

    /* Set parameters. */
    params = [ _outpoint_hash ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
