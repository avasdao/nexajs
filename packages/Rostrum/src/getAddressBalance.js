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
    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressBalance(_address)
    }

    /* Set method. */
    const method = 'blockchain.address.get_balance'

    /* Set parameters. */
    const params = [
        _address,
        _filter, // NOTE: Filter what utxos are included in the query.
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
