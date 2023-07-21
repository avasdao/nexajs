/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Get Block (Info)
 *
 * Return an the FULL block details.
 *
 * Version added: Rostrum 8.1
 */
export default async function (_hash_or_height) {
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
        return rostrum.getBlock(_hash_or_height)
    }

    /* Set method. */
    method = 'blockchain.block.get'

    /* Set parameters. */
    params = [ _hash_or_height ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
