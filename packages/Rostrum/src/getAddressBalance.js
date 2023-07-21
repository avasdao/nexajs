/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address Balance
 *
 * Return the confirmed and unconfirmed balances of a Bitcoin Cash address.
 *
 * Version added: 1.4.3
 */
export default async function (_address, _filter = 'include_tokens') {
    /* Initialize locals. */
    let method
    let params
    let request
    let rostrum

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressBalance(_address, _filter)
    }

    /* Set method. */
    method = 'blockchain.address.get_balance'

    /* Set parameters. */
    params = [
        _address,
        _filter, // NOTE: Filter what utxos are included in the query.
    ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
