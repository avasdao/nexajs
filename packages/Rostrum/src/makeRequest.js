/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum:makeRequest')

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

    /* Validate Rostrum (module) status. */
    // if (this._connMgr?.isReady && this._connMgr?.isOpen) {
    if (this._connMgr?.isReady) {
        /* Validate connection. */
        if (
            this._connMgr.status[0].isOpen ||
            this._connMgr.status[1].isOpen ||
            this._connMgr.status[2].isOpen
        ) {
            for (let i = 0; i < this._connMgr.pool.length; i++) {
                if (this._connMgr.status[i].isOpen) {
                    /* Send request. */
                    this._connMgr.pool[i]
                        .send(JSON.stringify(request) + '\n') // NOTE: We MUST include the "new line".
                    // console.log('SENT REQUEST', i, request)
                }
            }
        } else {
            /* Add new request. */
            this._requestQueue.push(request)
            // console.log('ADDED REQUEST TO QUEUE', request)
        }
    } else {
        /* Add new request. */
        this._requestQueue.push(request)
        // console.log('ADDED REQUEST TO QUEUE', request)
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
