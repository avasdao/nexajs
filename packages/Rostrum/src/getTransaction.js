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
export default async function (_id) {
    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getTransaction(_id)
    }

    /* Set method. */
    const method = 'blockchain.transaction.get'

    /* Set parameters. */
    const params = [
        _id,
        true, // NOTE: Show verbose (true).
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
