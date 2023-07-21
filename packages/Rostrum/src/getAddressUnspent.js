/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Blockchain) Address List Unspent
 *
 * Return an ordered list of UTXOs sent to a Bitcoin Cash or Nexa address.
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
        return rostrum.getAddressUnspent(_address)
    }

    /* Set method. */
    method = 'blockchain.address.listunspent'

    /* Set parameters. */
    params = [
        _address
    ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
