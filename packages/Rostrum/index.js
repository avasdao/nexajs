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

    // ...

    getGenesisInfo(params) {
        return getGenesisInfo(params)
    }

    // ...

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
// ...
Nexa.getGenesisInfo = getGenesisInfo
// ...

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = { ...Nexa }
