/* Import modules. */
import { EventEmitter } from 'events'

/* Initialize (global) package constants. */
let host = '127.0.0.1'
let port = '7227'

/* Initialize (global) package variables. */
let username
let password

/**
 * Connect To Node
 */
export const connectToNode = async (_username, _password) => {
    // TODO: Test to make sure the connnection is available and ready.

    /* Set RPC username. */
    username = _username

    /* Set RPC password. */
    password = _password
}


/**
 * Remote Procedure Call (RPC)
 *
 * @param {String} _method
 * @param {Object} _params
 * @param {Object} _options
 * @returns
 */
export const callNode = async (_method, _params, _options) => {
    /* Verify authentication. */
    if (!username && !password && !_options) {
        throw new Error('Oops! You have to connect to the local host first.')
    }

    if (_options) {
        username = _options.username || null
        password = _options.password || null
        host = _options.host || '127.0.0.1'
        port = _options.port || '7227'
    }

    if (!username || !password) {
        throw new Error('Oops! You MUST provide a username and password to connect to the node.')
    }

    /* Initialize (local) variables. */
    let endpoint
    let error
    let response

    try {
        /* Set endpoint. */
        // endpoint = `http://${username}:${password}@${host}:${port}`
        endpoint = `http://${host}:${port}`
        // console.log('ENDPOINT', endpoint)

        /* Build package. */
        const pkg = {
            "jsonrpc": "2.0",
            "id": "core",
            "method": _method,
            "params": _params,
        }
        // console.log('PKG', pkg)

        /* Set method. */
        const method = 'POST'

        /* Set headers. */
        const headers = new Headers()
        headers.append('Authorization', `Basic ${btoa(username + ':' + password)}`)
        headers.append('Content-Type', 'application/json')

        /* Make request. */
        response = await fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify(pkg),
        }).catch(_err => {
            // console.error(_err)

            if (_err && _err.response && _err.response.text) {
                error = JSON.parse(_err.response.text)
            } else if (_err && _err.response) {
                error = _err.response
            } else {
                error = _err
            }
        })

        /* Validate error. */
        if (error) {
            return error
        }

        /* Decode response. */
        response = await response.json()

        /* Validate response. */
        if (!response) {
            return null
        }
        // console.log('\nRPC CALL (response):', response)

        /* Validate response. */
        if (response && response.result) {
            return response.result
        } else {
            return null
        }
    } catch (err) {
        return err
    }
}


/**
 * Remote Procedure Call
 */
export class Rpc extends EventEmitter {
    constructor(_params) {
        /* Initialize RPC class. */
        // console.info('Initializing RPC...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    static call(_method, _params, _options) {
        return callNode(_method, _params, _options)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize RPC class. */
Nexa.Rpc = Rpc

/* Initialize RPC modules. */
Nexa.callNode = callNode
Nexa.connectToNode = connectToNode

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
