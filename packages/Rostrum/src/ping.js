/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (Server) Ping
 *
 * Ping the server to ensure it is responding, and to keep the session alive.
 * The server may disconnect clients that have sent no requests
 * for roughly 10 minutes.
 *
 * Version added: 1.2
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
        return rostrum.ping()
    }

    /* Set method. */
    method = 'server.ping'

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
