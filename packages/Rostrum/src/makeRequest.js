/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum:makeRequest')

/* Set active connection id. */
// NOTE: Official node is currently accepting ZERO-fee txs.
const ACTIVE_CONN_ID = 1

/**
 * Make Request
 */
export default function (_request, _id, _callback) {
    /* Generate a new (request) id. */
    const id = _id || uuidv4()

    /* Set method. */
    const method = _request.method

    /* Set parameters. */
    const params = _request.params

    /* Create request. */
    const request = {
        id,
        method,
        params,
    }

    /* Validate connection status. */
    if (this._connMgr?.isReady && this._connMgr?.isOpen) {
        /* Send request. */
        this._connMgr.pool[ACTIVE_CONN_ID]
            .send(JSON.stringify(request) + '\n') // NOTE: We MUST include the "new line".
    } else {
        /* Add new request. */
        this._requestQueue.push(request)
    }

    const self = this

    /* Return a promise. */
    return new Promise(function (_resolve, _reject) {
        /* Initialize (request) promise. */
        self._connMgr.requests[id] = {}

        /* Set resolve. */
        self._connMgr.requests[id].callback = _callback

        /* Set resolve. */
        self._connMgr.requests[id].resolve = _resolve

        /* Set reject. */
        self._connMgr.requests[id].reject = _reject

        /* Set (connection) ready flag. */
        self._connMgr.isReady = true
    })
}
