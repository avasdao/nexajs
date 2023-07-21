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
    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getGenesisInfo(_tokenid)
    }

    /* Set method. */
    const method = 'token.genesis.info'

    /* Set parameters. */
    const params = [
        _tokenid,
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
