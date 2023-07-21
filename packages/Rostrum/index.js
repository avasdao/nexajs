/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum')

/* Import modules. */
import { EventEmitter } from 'events'

import _getAddressBalance from './src/getAddressBalance.js'
// ...
import _getTransaction from './src/getTransaction.js'
import _getGenesisInfo from './src/getGenesisInfo.js'
// ...
import _getAddressTokenHistory from './src/getAddressTokenHistory.js'

import makeRequest from './src/makeRequest.js'

/* Set active connection id. */
// NOTE: Official node is currently accepting ZERO-fee txs.
const ACTIVE_CONN_ID = 0


export const getAddressBalance = _getAddressBalance


/**
 * (Blockchain) Decode Remote Address
 *
 * Decode a Bitcoin Cash or a Nexa address to its raw payload. This method is
 * potentially useful for clients needing to see the encoded contents of a
 * address but lacking the local libraries necessary to decode them.
 *
 * Version added: Rostrum 7.0
 */
export async function decodeRemoteAddress(_address) {
    debug(`Blockchain->Address->Decode [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.decodeRemoteAddress(_address)
    }

    /* Set method. */
    const method = 'blockchain.address.decode'

    /* Set parameters. */
    const params = [ _address ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Address First Use
 *
 * Returns a first occurance of usage of scripthash as ouput on the blockchain.
 *
 * Version added: Rostrum 1.2
 */
export async function getAddressFirstUse(_address, _filter = 'include_tokens') {
    debug(`Blockchain->Address->FirstUse [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressFirstUse(_address, _filter)
    }

    /* Set method. */
    const method = 'blockchain.address.get_first_use'

    /* Set parameters. */
    const params = [
        _address,
        _filter,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Address History
 *
 * Return the confirmed and unconfirmed history of a Bitcoin Cash
 * or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export async function getAddressHistory(_address, _filter = 'include_tokens') {
    debug(`Blockchain->Address->History [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressHistory(_address, _filter)
    }

    /* Set method. */
    const method = 'blockchain.address.get_history'

    /* Set parameters. */
    const params = [
        _address,
        _filter,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Address History
 *
 * Return the unconfirmed transactions of a Bitcoin Cash or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export async function getAddressMempool(_address, _filter = 'include_tokens') {
    debug(`Blockchain->Address->Mempool [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressMempool(_address, _filter)
    }

    /* Set method. */
    const method = 'blockchain.address.get_mempool'

    /* Set parameters. */
    const params = [
        _address,
        _filter,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Address Script Hash
 *
 * Translate a Bitcoin Cash or a Nexa address to a script hash. This method is
 * potentially useful for clients preferring to work with script hashes but
 * lacking the local libraries necessary to generate them.
 *
 * Version added: Rostrum 1.4.3
 */
export async function getAddressScriptHash(_address) {
    debug(`Blockchain->Address->ScriptHash [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressScriptHash(_address)
    }

    /* Set method. */
    const method = 'blockchain.address.get_scripthash'

    /* Set parameters. */
    const params = [ _address ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Address List Unspent
 *
 * Return an ordered list of UTXOs sent to a Bitcoin Cash or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export async function getAddressUnspent(_address) {
    debug(`Blockchain->Address->ListUnspent [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressUnspent(_address)
    }

    /* Set method. */
    const method = 'blockchain.address.listunspent'

    /* Set parameters. */
    const params = [
        _address
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Get Block (Info)
 *
 * Return an the FULL block details.
 *
 * Version added: Rostrum 8.1
 */
export async function getBlock(_hash_or_height) {
    debug(`Blockchain->Block->Info [ hash or height: ${_hash_or_height} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getBlock(_hash_or_height)
    }

    /* Set method. */
    const method = 'blockchain.block.get'

    /* Set parameters. */
    const params = [ _hash_or_height ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}


export const getTransaction = _getTransaction
export const getGenesisInfo = _getGenesisInfo
export const getTokenInfo = getGenesisInfo // Export alias.


/**
* (Token) Address Balance
*
* Return the confirmed and unconfirmed balances of tokens in a Bitcoin Cash or Nexa address.
*
* Version added: Rostrum 6.0
*/
export async function getAddressTokenBalance(_address, _cursor, _tokenid) {
    debug(`Token->Address->TokenBalance [ token: ${_tokenid} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressTokenBalance(_address, _cursor, _tokenid)
    }

    /* Set method. */
    const method = 'token.address.get_balance'

    /* Set parameters. */
    const params = [
        _address,
        _cursor,
        _tokenid,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}


export const getAddressTokenHistory = _getAddressTokenHistory


/**
* (Token) Address Mempool
*
* Return the unconfirmed token transactions of a Nexa or Bitcoin Cash address.
*
* Version added: Rostrum 6.0
*/
export async function getAddressTokenMempool(_address, _cursor, _tokenid) {
    debug(`Token->Address->TokenMempool [ token: ${_tokenid} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressTokenMempool(_address, _cursor, _tokenid)
    }

    /* Set method. */
    const method = 'token.address.get_mempool'

    /* Set parameters. */
    const params = [
        _address,
        _cursor,
        _tokenid,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
* (Token) Address Unspent
*
* Return an list of token UTXOs sent to a Nexa or Bitcoin Cash address.
*
* Version added: Rostrum 6.0
*/
export async function getAddressTokenUnspent(_address, _cursor, _tokenid) {
    debug(`Token->Address->Unspent [ token: ${_tokenid} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressTokenUnspent(_address, _cursor, _tokenid)
    }

    /* Set method. */
    const method = 'token.address.listunspent'

    /* Set parameters. */
    const params = [
        _address,
        _cursor,
        _tokenid,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (NFT) List
 *
 * Return list of all NFT's minted from a specified parent token.
 *
 * Version added: Rostrum 7.0
 */
export async function getNftList(_tokenid, _cursor) {
    debug(`Token->NFT->List [ token: ${_tokenid} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getNftList(_tokenid, _cursor)
    }

    /* Set method. */
    const method = 'token.nft.list'

    /* Set parameters. */
    const params = [
        _tokenid,
        _cursor,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Token) History
 *
 * Return all confirmed and unconfirmed token transaction history of a given token.
 *
 * Version added: Rostrum 6.0
 */
export async function getTokenHistory(_address, _cursor, _tokenid) {
    debug(`Token->Transaction->History [ token: ${_tokenid} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getTokenHistory(_address, _cursor, _tokenid)
    }

    /* Set method. */
    const method = 'token.transaction.get_history'

    /* Set parameters. */
    const params = [
        _address,
        _cursor,
        _tokenid,
    ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}

/**
 * (Blockchain) Subscribe Address
 *
 * Subscibe for updates on ALL address activity.
 *
 * Version added: Rostrum 1.4.3
 */
export async function subscribeAddress(_address, _handler) {
    debug(`Blockchain->Address->Subscribe [ address: ${_address} ]`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.subscribeAddress(_address, _handler)
    }

    /* Set method. */
    const method = 'blockchain.address.subscribe'

    /* Set parameters. */
    const params = [ _address ]

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request, _address, _handler)
}

/**
 * (Server) Ping
 *
 * Ping the server to ensure it is responding, and to keep the session alive.
 * The server may disconnect clients that have sent no requests
 * for roughly 10 minutes.
 *
 * Version added: 1.2
 */
export async function _ping() {
    debug(`Server->Ping`)

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        const rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.ping()
    }

    /* Set method. */
    const method = 'server.ping'

    /* Set parameters. */
    const params = []

    /* Build request. */
    const request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
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
                this._ping()
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

    _ping() {
        return _ping.bind(this)()
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
