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
import _getOutpoint from './src/getOutpoint.js'
import _getTip from './src/getTip.js'
import _getTokenHistory from './src/getTokenHistory.js'
import _getGenesisInfo from './src/getGenesisInfo.js'
import _subscribeAddress from './src/subscribeAddress.js'

/* Import ping handler. */
import ping from './src/ping.js'

/* Import request handler. */
// import makeRequest from './src/makeRequest.js'

/* Set active connection id. */
// NOTE: Official node is currently accepting ZERO-fee txs.
const DEFAULT_CONN_ID = 0

/* Initialize constants. */
const RECONNECTION_DELAY = 3000 // default is 3 seconds
const PING_INTERVAL = 60000 // every 1 minute

/* Initialize ping handler. */
let pingHandler

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
export const getOutpoint = _getOutpoint
export const getTip = _getTip
export const getTokenHistory = _getTokenHistory
export const getGenesisInfo = _getGenesisInfo
export const getTokenInfo = getGenesisInfo // Export alias.
export const subscribeAddress = _subscribeAddress

/**
 * Get Connection
 *
 * Returns a new connection to a remote Rostrum server.
 */
const getConnection = async function (_connid, _isTestnet = false) {
    /* Import WebSocket. */
    // NOTE: Ignored by esmify.
    const WebSocket = (await import('isomorphic-ws')).default

    /* Validate Testnet flag. */
    if (_isTestnet) {
        return new WebSocket('wss://rostrum.test-nexa.sh:30004')
    }

    /* Handle connection selection. */
    switch(_connid) {
    case 0:
        return new WebSocket('wss://rostrum.nexa.sh:20004')
    case 1:
        return new WebSocket('wss://electrum.nexa.org:20004')
    case 2:
        return new WebSocket('wss://rostrum.apecs.dev:20004')
    // TODO Add 2 more production-ready Rostrum servers (for a min of 5)
    default:
        return new WebSocket('wss://rostrum.nexa.sh:20004')
    }
}

const initConnection = function (_connid) {
    // console.log(`Initializing connection [ ${_connid} ]`)

    /* Handle open connection. */
    this._connMgr.pool[_connid].onopen = () => {
        debug(`Connection [ ${_connid} ] is OPEN!`)
        // TODO Show (IP Address) instead of Conn ID.
        console.info('Connected to Rostrum ->', _connid, new Date().getTime())

        /* Set (connection) ready flag. */
        // this._connMgr.isOpen = true
        this._connMgr.status[_connid].isOpen = true

        /* Handle (pending) queue. */
        this._requestQueue.forEach(_request => {
            /* Send request. */
            this._connMgr.pool[_connid]
                .send(JSON.stringify(_request) + '\n') // NOTE: We MUST include the "new line".
        })
    }

    /* Handle message. */
    this._connMgr.pool[_connid].onmessage = async (_msg) => {
        // console.info('Connection [ %s ] sent ->', i, _msg?.data)

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
    // NOTE: We currently NEVER allow this connect to be closed.
    //       We will ALWAYS attempt to re-connect.
    // TODO: Allow connection to be "manually" closed.
    this._connMgr.pool[_connid].onclose = () => {
        debug(`Connection [ ${_connid} ] is CLOSED.`)
        console.log('CONNECTION CLOSED', _connid, new Date().getTime())

        /* Validate connection status. */
        if (this._connMgr.status[_connid].isOpen) {
            /* Set (connection) ready flag. */
            this._connMgr.status[_connid].isOpen = false
        }

        console.info(`Waiting (${RECONNECTION_DELAY} ms) to reconnect...`)

        // NOTE: Add re-try delay and max attempts.
        setTimeout(async () => {
            /* Re-establish connection to remote server(s). */
            this._connMgr.pool[_connid] = await getConnection.bind(this)(_connid)

            /* Re-initialize connection. */
            initConnection.bind(this)(_connid)
        }, RECONNECTION_DELAY)
    }

    /* Handle connection error. */
    this._connMgr.pool[_connid].onerror = (e) => {
        console.error('ERROR! [ %s ]:', _connid, new Date().getTime(), e)
    }
}

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

        // TODO Allow customization of data providers using `_params`.

        /* Initialize request queue. */
        this._requestQueue = []

        /* Initialize connection manager. */
        this._connMgr = null
    }

    /**
     * Initialization
     *
     * Create a new Rostrum instance (passing optional parameters).
     */
    static init(_params) {
        return (async function () {
            /* Create new instance. */
            const rostrum = new Rostrum(_params)

            // Do async stuff
            await rostrum._connect()

            // Return instance
            return rostrum
        })()
    }

    async _connect() {
        /* Validate (global-shared) connection manager. */
        if (globalThis.Nexa.Rostrum._connMgr) {
            /* Use existing (global-shared) connection. */
            this._connMgr = globalThis.Nexa.Rostrum._connMgr

            // console.log('Connected to SHARED Rostrum connection...')
            return
        }

        /* Initialize connections manager. */
        this._connMgr = {
            pool: [
                await getConnection.bind(this)(DEFAULT_CONN_ID),       // nexa.sh
                // NOTE: Official node is currently accepting ZERO-fee txs.
                await getConnection.bind(this)(DEFAULT_CONN_ID + 1),   // nexa.org
                await getConnection.bind(this)(DEFAULT_CONN_ID + 2),   // apecs.dev
            ],
            status: [
                {
                    isOpen: false,
                },
                {
                    isOpen: false,
                },
                {
                    isOpen: false,
                },
            ],
            requests: {},
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

        /* Set (global-shared) connection manager. */
        globalThis.Nexa.Rostrum._connMgr = this._connMgr

        /* Initialize connection handlers. */
        for (let i = 0; i < this._connMgr.pool.length; i++) {
            /* Initialize connection(s). */
            initConnection.bind(this)(i)
        }

        /* Manage session keep-alive. */
        // NOTE: Requires arrow func to "fix" (this) context issue??
        //       (source: https://developer.mozilla.org/en-US/docs/Web/API/setInterval#a_possible_solution)
        pingHandler = setInterval(() => this.ping(), PING_INTERVAL)
    }

    get status() {
        return {
            requestQueue: this?._requestQueue,
            // isOpen: this?._connMgr?.isOpen,
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

    getOutpoint(outpoint_hash) {
        return getOutpoint.bind(this)(outpoint_hash)
    }

    getTip() {
        return getTip.bind(this)()
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
Nexa.getOutpoint = getOutpoint
Nexa.getTip = getTip
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
