/* Import modules. */
import { EventEmitter } from 'events'

import { makeRequest } from './_makeRequest.js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:rostrum')

/**
 * (Blockchain) Address Balance
 *
 * Return the confirmed and unconfirmed balances of a Bitcoin Cash address.
 *
 * Version added: 1.4.3
 */
export const getAddressBalance = async (_address) => {
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

/**
 * (Blockchain) Decode Remote Address
 *
 * Decode a Bitcoin Cash or a Nexa address to its raw payload. This method is
 * potentially useful for clients needing to see the encoded contents of a
 * address but lacking the local libraries necessary to decode them.
 *
 * Version added: Rostrum 7.0
 */
export const decodeRemoteAddress = async (_address) => {
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
 * (Blockchain) Address First Use
 *
 * Returns a first occurance of usage of scripthash as ouput on the blockchain.
 *
 * Version added: Rostrum 1.2
 */
export const getAddressFirstUse = async (_address) => {
    debug(`Blockchain->Address->FirstUse [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.get_first_use'

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
 * (Blockchain) Address History
 *
 * Return the confirmed and unconfirmed history of a Bitcoin Cash or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export const getAddressHistory = async (_address) => {
    debug(`Blockchain->Address->History [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.get_history'

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
 * (Blockchain) Address History
 *
 * Return the unconfirmed transactions of a Bitcoin Cash or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export const getAddressMempool = async (_address) => {
    debug(`Blockchain->Address->Mempool [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.get_mempool'

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
 * (Blockchain) Address Script Hash
 *
 * Translate a Bitcoin Cash or a Nexa address to a script hash. This method is potentially useful for clients preferring to work with script hashes but lacking the local libraries necessary to generate them.
 *
 * Version added: Rostrum 1.4.3
 */
export const getAddressScriptHash = async (_address) => {
    debug(`Blockchain->Address->ScriptHash [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.get_scripthash'

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
 * (Blockchain) Address List Unspent
 *
 * Return an ordered list of UTXOs sent to a Bitcoin Cash or Nexa address.
 *
 * Version added: Rostrum 1.4.3
 */
export const getAddressUnspent = async (_address) => {
    debug(`Blockchain->Address->ListUnspent [ address: ${_address} ]`)

    /* Set method. */
    const method = 'blockchain.address.listunspent'

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
 * (Token) Genesis Info
 *
 * Info from token creation transaction.
 *
 * Version added: Rostrum 6.0
 */
export const getGenesisInfo = async (_tokenid) => {
    debug(`Token->Genesis->Info [ token: ${_tokenid} ]`)

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
    return makeRequest(request)
}

/* Export alias. */
export const getTokenInfo = getGenesisInfo

/**
 * (NFT) List
 *
 * Return list of all NFT's minted from a specified parent token.
 *
 * Version added: Rostrum 7.0
 */
export const getNftList = async (_tokenid) => {
    debug(`Token->NFT->List [ token: ${_tokenid} ]`)

    /* Set method. */
    const method = 'token.nft.list'

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
    return makeRequest(request)
}

/**
 * (Token) History
 *
 * Return all confirmed and unconfirmed token transaction history of a given token.
 *
 * Version added: Rostrum 6.0
 */
export const getTokenHistory = async (_tokenid) => {
    debug(`Token->Transaction->History [ token: ${_tokenid} ]`)

    /* Set method. */
    const method = 'token.transaction.get_history'

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
    return makeRequest(request)
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

        // TBD
    }

    getAddressBalance(params) {
        return getAddressBalance(params)
    }

    decodeRemoteAddress(params) {
        return decodeRemoteAddress(params)
    }

    getAddressFirstUse(params) {
        return getAddressFirstUse(params)
    }

    getAddressHistory(params) {
        return getAddressHistory(params)
    }

    getAddressMempool(params) {
        return getAddressMempool(params)
    }

    getAddressScriptHash(params) {
        return getAddressScriptHash(params)
    }

    getAddressUnspent(params) {
        return getAddressUnspent(params)
    }

    // ...

    getGenesisInfo(params) {
        return getGenesisInfo(params)
    }

    getTokenInfo(params) {
        return getTokenInfo(params)
    }

    getNftList(params) {
        return getNftList(params)
    }

    // ...

    getTokenHistory(params) {
        return getTokenHistory(params)
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
Nexa.getNftList = getNftList
// ...
Nexa.getTokenHistory = getTokenHistory

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
