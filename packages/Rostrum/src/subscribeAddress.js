/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Subscribe Address
 *
 * Subscibe for updates on ALL address activity.
 *
 * Version added: Rostrum 1.4.3
 */
export default async function (_address, _handler) {
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
        return rostrum.subscribeAddress(_address, _handler)
    }

    /* Set method. */
    method = 'blockchain.address.subscribe'

    /* Set parameters. */
    params = [ _address ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request, _address, _handler)
}
