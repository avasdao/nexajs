/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address First Use
 *
 * Returns a first occurance of usage of scripthash as ouput on the blockchain.
 *
 * Version added: Rostrum 1.2
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
        return rostrum.getAddressFirstUse(_address, _filter)
    }

    /* Set method. */
    method = 'blockchain.address.get_first_use'

    /* Set parameters. */
    params = [
        _address,
        _filter,
    ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}