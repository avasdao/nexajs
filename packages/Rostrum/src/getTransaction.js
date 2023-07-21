/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Transaction (Info)
 *
 * Return an the FULL transaction details.
 *
 * Version added: ??
 */
export default async function (_id, _verbose = true) {
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
        return rostrum.getTransaction(_id)
    }

    /* Set method. */
    method = 'blockchain.transaction.get'

    /* Set parameters. */
    params = [
        _id,
        _verbose,
    ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
