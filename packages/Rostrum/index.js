/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import Rostrum methods. */
import _getAddressBalance from './src/getAddressBalance.js'
import _decodeRemoteAddress from './src/decodeRemoteAddress.js'
import _getAddressFirstUse from './src/getAddressFirstUse.js'
import _getAddressHistory from './src/getAddressHistory.js'
import _getAddressMempool from './src/getAddressMempool.js'
import _getAddressScriptHash from './src/getAddressScriptHash.js'
import _getAddressUnspent from './src/getAddressUnspent.js'
import _getBlock from './src/getBlock.js'
import _getTransaction from './src/getTransaction.js'
import _getAddressTokenBalance from './src/getAddressTokenBalance.js'
import _getAddressTokenHistory from './src/getAddressTokenHistory.js'
import _getAddressTokenMempool from './src/getAddressTokenMempool.js'
import _getAddressTokenUnspent from './src/getAddressTokenUnspent.js'
import _getNftList from './src/getNftList.js'
import _getTokenHistory from './src/getTokenHistory.js'
import _getGenesisInfo from './src/getGenesisInfo.js'
import _subscribeAddress from './src/subscribeAddress.js'

/* Import ping handler. */
import ping from './src/ping.js'

/* Import request handler. */
import makeRequest from './src/makeRequest.js'

/* Set active connection id. */
// NOTE: Official node is currently accepting ZERO-fee txs.
const ACTIVE_CONN_ID = 0

/* Export Rostrum methods. */
export const getAddressBalance = _getAddressBalance
export const decodeRemoteAddress = _decodeRemoteAddress
export const getAddressFirstUse = _getAddressFirstUse
export const getAddressHistory = _getAddressHistory
export const getAddressMempool = _getAddressMempool
export const getAddressScriptHash = _getAddressScriptHash
export const getAddressUnspent = _getAddressUnspent
export const getBlock = _getBlock
export const getTransaction = _getTransaction
export const getAddressTokenBalance = _getAddressTokenBalance
export const getAddressTokenHistory = _getAddressTokenHistory
export const getAddressTokenMempool = _getAddressTokenMempool
export const getAddressTokenUnspent = _getAddressTokenUnspent
export const getNftList = _getNftList
export const getTokenHistory = _getTokenHistory
export const getGenesisInfo = _getGenesisInfo
export const getTokenInfo = getGenesisInfo // Export alias.
export const subscribeAddress = _subscribeAddress






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

        /* Initialize request queue. */
        this._requestQueue = []

        /* Initialize connection manager. */
        this._connMgr = null
    }

    static init() {
        return (async function () {
            let rostrum = await new Rostrum()

            // Do async stuff
            await rostrum._connect()

            // Return instance
            return rostrum
        })()
    }

    async _connect() {
        /* Import WebSocket. */
        // NOTE: Ignored by esmify.
        const WebSocket = (await import('isomorphic-ws')).default

        /* Validate (global) shared connection. */
        if (globalThis.Nexa.Rostrum._connMgr) {
            this._connMgr = globalThis.Nexa.Rostrum._connMgr

            // console.log('Connected to SHARED Rostrum connection...')
            return
        }

        /* Initilize connections manager. */
        this._connMgr = {
            pool: [
                new WebSocket('wss://rostrum.nexa.sh:20004'),   // Nexa.Sh
                // new WebSocket('wss://electrum.nexa.org:20004'), // Nexa.Org
                // new WebSocket('wss://rostrum.apecs.dev:20004'), // APECS.dev
                // TBD
            ],
            peers: [
                new WebSocket('wss://electrum.nexa.org:20004'), // Nexa.Org
                // new WebSocket('wss://rostrum.apecs.dev:20004'), // APECS.dev
                // TBD
            ],
            requests: {},
            isOpen: false,
            isReady: false,
        }

        /* Validate (global) Nexa object. */
        if (!globalThis.Nexa) {
            globalThis.Nexa = {}
        }

        /* Validate (global) Rostrum object. */
        if (!globalThis.Nexa.Rostrum) {
            globalThis.Nexa.Rostrum = {}
        }

        /* Set global (shared) connection manager. */
        globalThis.Nexa.Rostrum._connMgr = this._connMgr

        /* Handle open connection. */
        this._connMgr.pool[ACTIVE_CONN_ID].onopen = () => {
            debug(`Connection [ ${ACTIVE_CONN_ID} ] is OPEN!`)
            console.info('Connected to (Rostrum) ->', ACTIVE_CONN_ID)

            /* Set (connection) ready flag. */
            this._connMgr.isOpen = true

            /* Handle (pending) queue. */
            this._requestQueue.forEach(_request => {
                /* Send request. */
                this._connMgr.pool[ACTIVE_CONN_ID]
                    .send(JSON.stringify(_request) + '\n') // NOTE: We MUST include the "new line".
            })

            /* Manage session keep-alive. */
            setInterval(async () => {
                this.ping()
            }, 60000) // every 1 minute
        }

        /* Handle message. */
        this._connMgr.pool[ACTIVE_CONN_ID].onmessage = async (_msg) => {
            // console.info('Connection [ %s ] sent ->', ACTIVE_CONN_ID, _msg?.data)

            let error
            let json
            let id

            const data = _msg?.data

            try {
                /* Decode data. */
                json = JSON.parse(data)
                // console.log('JSON', json)

                id = data.id

                // NOTE: Reject this promise.
                if (json?.error) {
                    return this._connMgr.requests[id]?.reject({ error: json.error?.message })
                }
            } catch (err) {
                return this._connMgr.requests[id]?.reject(err)
            }

            /* Validate message data. */
            if (_msg?.data) {
                try {
                    /* Parse JSON data. */
                    const data = JSON.parse(_msg.data)
                    // console.log('JSON (data):', data)

                    /* Validate message id. */
                    if (data?.id) {
                        // console.log('JSON (result):', data.id, data.result)

                        /* Set message id. */
                        id = data.id

                        /* Resolve (async) request. */
                        this._connMgr.requests[id]?.resolve(data.result)
                    }

                    /* Validate message parameters. */
                    if (data?.params) {
                        // console.log('JSON (params):', data.params)

                        /* Validate message id. */
                        if (id) {
                            /* Resolve (async) request. */
                            this._connMgr.requests[id]?.resolve(data.params)
                        } else {
                            /* Update message id. */
                            id = data.params[0]

                            /* Make callback. */
                            this._connMgr.requests[id]?.callback(data.params)
                        }
                    }
                } catch (err) {
                    console.error(err)
                    this._connMgr.requests[id]?.reject(err)
                }
            }

        }

        /* Handle connection close. */
        this._connMgr.pool[ACTIVE_CONN_ID].onclose = function () {
            debug(`Connection [ ${ACTIVE_CONN_ID} ] is CLOSED.`)
            console.log('CONNECTION CLOSED')

            if (this._connMgr?.isOpen) {
                /* Set (connection) ready flag. */
                this._connMgr.isOpen = false
            }
        }

        /* Handle connection error. */
        this._connMgr.pool[ACTIVE_CONN_ID].onerror = function (e) {
            console.error('ERROR! [ %s ]:', ACTIVE_CONN_ID, e)

            if (this._connMgr?.isOpen) {
                /* Set (connection) ready flag. */
                this._connMgr.isOpen = false
            }

            /* Attempt to re-connect. */
            // NOTE: We will lose ALL subscriptions.
            this._connect()

            // FIXME FOR TESTING APECS RE-CONNECTION
            // console.info('Re-connecting to Rostrum provider...')
            // this._connMgr.pool[ACTIVE_CONN_ID] = new WebSocket('wss://rostrum.apecs.dev:20004')
        }
    }

    get status() {
        return {
            requestQueue: this?._requestQueue,
            // pool: this?._connMgr?.pool,
            // peers: this?._connMgr?.peers,
            // requests: this?._connMgr?.requests,
            isOpen: this?._connMgr?.isOpen,
            isReady: this?._connMgr?.isReady,
        }
    }

    getAddressBalance(address, filter) {
        return getAddressBalance.bind(this)(address, filter)
    }

    decodeRemoteAddress(address) {
        return decodeRemoteAddress.bind(this)(address)
    }

    getAddressFirstUse(address, filter) {
        return getAddressFirstUse.bind(this)(address, filter)
    }

    getAddressHistory(address, filter) {
        return getAddressHistory.bind(this)(address, filter)
    }

    getAddressMempool(address, filter) {
        return getAddressMempool.bind(this)(address, filter)
    }

    getAddressScriptHash(params) {
        return getAddressScriptHash.bind(this)(params)
    }

    getAddressUnspent(params) {
        return getAddressUnspent.bind(this)(params)
    }

    getBlock(id) {
        return getBlock.bind(this)(id)
    }

    getTransaction(id, verbose) {
        return getTransaction.bind(this)(id, verbose)
    }

    // ...

    getGenesisInfo(params) {
        return getGenesisInfo.bind(this)(params)
    }

    getTokenInfo(params) {
        return getTokenInfo.bind(this)(params)
    }

    getAddressTokenBalance(address, cursor, tokenid) {
        return getAddressTokenBalance.bind(this)(address, cursor, tokenid)
    }

    getAddressTokenHistory(address, cursor, tokenid) {
        return getAddressTokenHistory.bind(this)(address, cursor, tokenid)
    }

    getAddressTokenMempool(address, cursor, tokenid) {
        return getAddressTokenMempool.bind(this)(address, cursor, tokenid)
    }

    getAddressTokenUnspent(address, cursor, tokenid) {
        return getAddressTokenUnspent.bind(this)(address, cursor, tokenid)
    }

    getNftList(tokenid, cursor) {
        return getNftList.bind(this)(tokenid, cursor)
    }

    getTokenHistory(address, cursor, tokenid) {
        return getTokenHistory.bind(this)(address, cursor, tokenid)
    }

    subscribeAddress(params, handler) {
        return subscribeAddress.bind(this)(params, handler)
    }

    ping() {
        return ping.bind(this)()
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Rostrum class. */
Nexa.Rostrum = Rostrum

/* Initialize Rostrum modules. */
Nexa.getAddressBalance = getAddressBalance
Nexa.decodeRemoteAddress = decodeRemoteAddress
Nexa.getAddressFirstUse = getAddressFirstUse
Nexa.getAddressHistory = getAddressHistory
Nexa.getAddressMempool = getAddressMempool
Nexa.getAddressScriptHash = getAddressScriptHash
Nexa.getAddressUnspent = getAddressUnspent
// ...
Nexa.getGenesisInfo = getGenesisInfo
Nexa.getTokenInfo = getTokenInfo // alias for `getGenesisInfo`
Nexa.getAddressTokenBalance = getAddressTokenBalance
Nexa.getAddressTokenHistory = getAddressTokenHistory
Nexa.getAddressTokenMempool = getAddressTokenMempool
Nexa.getAddressTokenUnspent = getAddressTokenUnspent
Nexa.getNftList = getNftList
Nexa.getTokenHistory = getTokenHistory
// ...
Nexa.subscribeAddress = subscribeAddress
Nexa.subscribeOwner = subscribeAddress // alias for `subscribeAddress`

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
