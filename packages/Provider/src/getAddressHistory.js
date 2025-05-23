/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address History
 *
 * Return the confirmed and unconfirmed history of a Bitcoin Cash
 * or Nexa address.
 */
export default async function (_address, _filter = 'include_tokens') {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'blockchain.address.get_history'

    /* Set parameters. */
    params = [
        _address,
        _filter, // NOTE: Filter what utxos are included in the query.
    ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
