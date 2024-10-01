/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _broadcast from './src/broadcast.js'
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

/* Export (local) modules. */
export const broadcast = _broadcast
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


/**
 * Provider Class
 *
 * TBD
 */
export class Provider extends EventEmitter {
    constructor(_params) {
        /* Initialize Provider class. */
        // console.info('Initializing Provider...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Provider (Instance) is working!'
    }
    static test() {
        return 'Provider (Static) is working!'
    }

    static getAddressBalance(address, filter) {
        return getAddressBalance(address, filter)
    }

    static decodeRemoteAddress(address) {
        return decodeRemoteAddress(address)
    }

    static getAddressFirstUse(address, filter) {
        return getAddressFirstUse(address, filter)
    }

    static getAddressHistory(address, filter) {
        return getAddressHistory(address, filter)
    }

    static getAddressMempool(address, filter) {
        return getAddressMempool(address, filter)
    }

    static getAddressScriptHash(params) {
        return getAddressScriptHash(params)
    }

    static getAddressUnspent(params) {
        return getAddressUnspent(params)
    }

    static getBlock(id) {
        return getBlock(id)
    }

    static getTransaction(id, verbose) {
        return getTransaction(id, verbose)
    }

    static getGenesisInfo(params) {
        return getGenesisInfo(params)
    }

    static getTokenInfo(params) {
        return getTokenInfo(params)
    }

    static getAddressTokenBalance(address, cursor, tokenid) {
        return getAddressTokenBalance(address, cursor, tokenid)
    }

    static getAddressTokenHistory(address, cursor, tokenid) {
        return getAddressTokenHistory(address, cursor, tokenid)
    }

    static getAddressTokenMempool(address, cursor, tokenid) {
        return getAddressTokenMempool(address, cursor, tokenid)
    }

    static getAddressTokenUnspent(address, cursor, tokenid) {
        return getAddressTokenUnspent(address, cursor, tokenid)
    }

    static getNftList(tokenid, cursor) {
        return getNftList(tokenid, cursor)
    }

    static getOutpoint(outpoint_hash) {
        return getOutpoint(outpoint_hash)
    }

    static getTip() {
        return getTip()
    }

    static getTokenHistory(address, cursor, tokenid) {
        return getTokenHistory(address, cursor, tokenid)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Provider class. */
Nexa.Provider = Provider

/* Initialize Provider modules. */
Nexa.broadcast = broadcast

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
