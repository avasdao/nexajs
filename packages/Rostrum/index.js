/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import WebSocket from 'isomorphic-ws'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum')

/* Initilize connections manager. */
const connMgr = {}

/**
 * Rostrum Class
 *
 * Manages a connection and its requests to a Rostrum server.
 */
export class Rostrum extends EventEmitter {
    constructor(_params) {
        /* Initialize Rostrum class. */
        debug('Initializing Rostrum...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}


/**
 * Make Request
 */
const makeRequest = (_request) => {
    /* Generate a new (request) id. */
    const id = uuidv4()

    let resolve
    let reject

    /* Add to connection manager. */
    connMgr[id] = {}

    /* Set ID. */
    connMgr[id].id = id

    /* Set request. */
    connMgr[id].request = _request

    /* Initialize socket connection to Rostrum server. */
    connMgr[id].socket = new WebSocket('wss://electrum.nexa.org:20004')
    // connMgr[id].socket = new WebSocket('wss://rostrum.apecs.dev:20004')
    // connMgr[id].socket_alt = new WebSocket('wss://rostrum.apecs.dev:20004')

    /* Handle open connection. */
    connMgr[id].socket.onopen = () => {
        debug(`Connection [ ${id} ] is OPEN!`)

        /* Create request. */
        // const request = `{"method":"{${_request.method}}","params":["${_request.address}",true],"id":"${id}"}`
        const request = {
            id,
            method: _request.method,
            params: _request.params,
        }

        /* Send request. */
        connMgr[id].socket
            .send(JSON.stringify(request) + '\n') // NOTE: We MUST include the "new line".
    }

    /* Handle message. */
    connMgr[id].socket.onmessage = async (_msg) => {
        // console.info('Connection [ %s ] sent ->', id, _msg)

        /* Validate message data. */
        if (_msg?.data) {
            try {
                /* Parse JSON data. */
                const data = JSON.parse(_msg.data)
                // console.log('JSON (data):', data)

                /* Validate message data. */
                if (data?.result) {
                    // console.log('JSON (result):', data.id, data.result)
                    resolve(data.result)

                    /* Close connection. */
                    // FIXME Should this be conditional??
                    return connMgr[id].socket.close()
                }

                /* Validate message parameters. */
                if (data?.params) {
                    // console.log('JSON (params):', data.params)
                    resolve(data.params)

                    /* Close connection. */
                    // FIXME Should this be conditional??
                    return connMgr[id].socket.close()
                }
            } catch (err) {
                console.error(err)
                reject(err)

                /* Close connection. */
                // FIXME Should this be conditional??
                return connMgr[id].socket.close()
            }
        }

        // NOTE: Reject this promise.
        reject({
            error: `Oops! Sorry, we couldn't complete your request.`
        })

        /* Close connection. */
        // FIXME Should this be conditional??
        connMgr[id].socket.close()
    }

    /* Handle connection close. */
    connMgr[id].socket.onclose = function () {
        debug(`Connection [ ${id} ] is CLOSED.`)
    }

    /* Handle connection error. */
    connMgr[id].socket.onerror = function (e) {
        console.error('ERROR! [ %s ]:', id, e)

        reject(e)
    }

    /* Return a promise. */
    return new Promise(function (_resolve, _reject) {
        /* Set resolve. */
        resolve = _resolve

        /* Set reject. */
        reject = _reject
    })
}

/**
 * (Blockchain) Address Decode
 *
 * Decode a Bitcoin Cash or a Nexa address to its raw payload. This method is
 * potentially useful for clients needing to see the encoded contents of a
 * address but lacking the local libraries necessary to decode them.
 *
 * Version added: Rostrum 7.0
 */
export const addressDecode = async (_address) => {
    debug(`Blockchain->Address->Decode [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.decode'

    /* Set parameters. */
    const params = [
        _address,
        true, // NOTE: Show verbose (true).
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}

/**
 * (Blockchain) Address Balance
 *
 * Return the confirmed and unconfirmed balances of a Bitcoin Cash address.
 *
 * Version added: 1.4.3
 */
export const addressBalance = async (_address) => {
    debug(`Blockchain->Address->Balance [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.get_balance'

    /* Set parameters. */
    const params = [
        _address,
        true, // NOTE: Show verbose (true).
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
