/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address Script Hash
 *
 * Translate a Bitcoin Cash or a Nexa address to a script hash. This method is
 * potentially useful for clients preferring to work with script hashes but
 * lacking the local libraries necessary to generate them.
 *
 * Version added: Rostrum 1.4.3
 */
export default async function (_address) {
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
        return rostrum.getAddressScriptHash(_address)
    }

    /* Set method. */
    method = 'blockchain.address.get_scripthash'

    /* Set parameters. */
    params = [ _address ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
