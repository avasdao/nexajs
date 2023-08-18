/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Headers Tip
 *
 * Get the latest block header (tip of the blockchain).
 *
 * Added: Rostrum 7.0
 */
export default async function () {
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
        return rostrum.getTip()
    }

    /* Set method. */
    method = 'blockchain.headers.tip'

    /* Set parameters. */
    params = []

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
