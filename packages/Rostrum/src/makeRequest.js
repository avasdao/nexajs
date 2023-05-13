/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum:makeRequest')

/* Set active connection id. */
const ACTIVE_CONN_ID = 0

/* Initialize request queue. */
const requestQueue = []

/* Initialize holders. */
let connMgr
let resolve
let reject

/**
 * Setup Connection Manager
 */
const setupConnMgr = async () => {
    /* Import WebSocket. */
    // NOTE: Ignored by esmify.
    const WebSocket = (await import('isomorphic-ws')).default

    /* Initilize connections manager. */
    connMgr = {
        pool: [
            new WebSocket('wss://electrum.nexa.org:20004'), // Nexa.Org
            // new WebSocket('wss://rostrum.nexa.sh:20004'),   // Nexa.Sh
            new WebSocket('wss://rostrum.apecs.dev:20004'), // APECS.dev
            // TBD
        ],
        alts: [
            new WebSocket('wss://rostrum.apecs.dev:20004'), // APECS.dev
            // TBD
        ],
        requests: {},
        isOpen: false,
        isReady: false,
    }

    /* Close connection. */
    // FIXME Should this be conditional??
    // connMgr.pool[ACTIVE_CONN_ID].close()

    /* Handle open connection. */
    connMgr.pool[ACTIVE_CONN_ID].onopen = () => {
        debug(`Connection [ ${ACTIVE_CONN_ID} ] is OPEN!`)
        // console.log('REQUEST QUEUE', requestQueue)

        /* Set (connection) ready flag. */
        connMgr.isOpen = true

        /* Handle (pending) queue. */
        requestQueue.forEach(_request => {
            /* Send request. */
            connMgr.pool[ACTIVE_CONN_ID]
                .send(JSON.stringify(_request) + '\n') // NOTE: We MUST include the "new line".
        })

    }

    /* Handle message. */
    connMgr.pool[ACTIVE_CONN_ID].onmessage = async (_msg) => {
        // console.info('Connection [ %s ] sent ->', ACTIVE_CONN_ID, _msg?.data)

        let error
        let json
        let id

        const data = _msg?.data

        try {
            /* Decode data. */
            json = JSON.parse(data)
            // console.log('JSON', json)

            // NOTE: Reject this promise.
            if (json?.error) {
                return reject({ error: json.error?.message })
            }
        } catch (err) {
            return reject(err)
        }

        /* Validate message data. */
        if (_msg?.data) {
            try {
                /* Parse JSON data. */
                const data = JSON.parse(_msg.data)
                // console.log('JSON (data):', data)

                /* Validate message data. */
                if (data?.result) {
                    // console.log('JSON (result):', data.id, data.result)
                    // resolve(data.result)
                    id = data.id
                    connMgr.requests[id].resolve(data.result)
                }

                /* Validate message parameters. */
                if (data?.params) {
                    // console.log('JSON (params):', data.params)
                    // resolve(data.params)
                    if (data.id) {
                        id = data.id
                        connMgr.requests[id].resolve(data.params)
                    } else {
                        id = data.params[0]
                        connMgr.requests[id].callback(data.params)
                    }
                }
            } catch (err) {
                console.error(err)
                reject(err)
            }
        }

    }

    /* Handle connection close. */
    connMgr.pool[ACTIVE_CONN_ID].onclose = function () {
        debug(`Connection [ ${ACTIVE_CONN_ID} ] is CLOSED.`)
    }

    /* Handle connection error. */
    connMgr.pool[ACTIVE_CONN_ID].onerror = function (e) {
        console.error('ERROR! [ %s ]:', ACTIVE_CONN_ID, e)

        reject(e)
    }
}

/* Setup connection manager. */
// await setupConnMgr()
setupConnMgr()

/**
 * Make Request
 */
export default (_request, _id, _callback) => {
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
    if (connMgr.isReady && connMgr.isOpen) {
        /* Send request. */
        connMgr.pool[ACTIVE_CONN_ID]
            .send(JSON.stringify(request) + '\n') // NOTE: We MUST include the "new line".
    } else {
        /* Add new request. */
        requestQueue.push(request)
    }

    /* Return a promise. */
    return new Promise(function (_resolve, _reject) {
        /* Set holders. */
        resolve = _resolve
        reject = _reject

        /* Initialize (request) promise. */
        connMgr.requests[id] = {}

        /* Set resolve. */
        connMgr.requests[id].callback = _callback

        /* Set resolve. */
        connMgr.requests[id].resolve = _resolve

        /* Set reject. */
        connMgr.requests[id].reject = _reject

        /* Set (connection) ready flag. */
        connMgr.isReady = true
    })
}
