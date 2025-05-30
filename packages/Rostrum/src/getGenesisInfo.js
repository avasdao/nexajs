/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Token) Genesis Info
 *
 * Info from token creation transaction.
 *
 * Version added: Rostrum 6.0
 */
export default async function (_tokenid) {
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
        return rostrum.getGenesisInfo(_tokenid)
    }

    /* Set method. */
    method = 'token.genesis.info'

    /* Set parameters. */
    params = [ _tokenid ]

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
