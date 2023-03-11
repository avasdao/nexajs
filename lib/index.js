/*******************************************************************************
 *
 * NexaJS Main Entry Module
 *
 * This file offers access to the entire NexaJS Package Suite.
 *
 * Please visit https://docs.nexajs.org for more details.
 */

/* Initialize event emitter. */
import { EventEmitter } from 'events'

/* Import NexaJS classes */
// NOTE: This allows us to export a (default) module.
import { Address as _Address } from '@nexajs/address'
// import { Blockchain as _Blockchain } from '../packages/Blockchain/index.js'
import { Purse as _Purse } from '@nexajs/purse'
import { Rostrum as _Rostrum } from '@nexajs/rostrum'
import { Rpc as _Rpc } from '@nexajs/rpc'
import { Utils as _Utils } from '@nexajs/utils'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa')

/* Export (individual) NexaJS classes */
export const Address = _Address
// export const Blockchain = _Blockchain
export const Purse = _Purse
export const Rostrum = _Rostrum
export const Rpc = _Rpc
export const Utils = _Utils

/* Export Address methods */
export { decodeAddress } from '@nexajs/address'
export { encodeAddress } from '@nexajs/address'
export { testAddr } from '@nexajs/address'

/* Export Blockchain methods */
// export { getTokenInfo } from '../packages/Blockchain/index.js'
// export { runQuery } from '../packages/Blockchain/index.js'
// export { listenEvents } from '../packages/Blockchain/index.js'

/* Export Purse methods */
export { testPurse } from '@nexajs/purse'
export { sendUtxo } from '@nexajs/purse'

/* Export Rostrum methods */
export { decodeRemoteAddress } from '@nexajs/rostrum'
export { getAddressBalance } from '@nexajs/rostrum'
export { getAddressFirstUse } from '@nexajs/rostrum'
export { getAddressHistory } from '@nexajs/rostrum'
// ...
export { getGenesisInfo } from '@nexajs/rostrum'
// ...

/* Export RPC methods */
export { callNode } from '@nexajs/rpc'
export { connectToNode } from '@nexajs/rpc'

/* Export Utility methods */
export { reverseBytes } from '@nexajs/utils'

/**
 * Nexa Main (default) Module Class
 *
 * Main class/module for the NexaJS Library + Software Development Kit (SDK).
 *
 * NOTE: This is a (default) module, so it DOES NOT require curly braces
 *       when importing into your application.
 */
export default class Nexa extends EventEmitter {
    constructor(_params) {
        /* Initialize NexaJS class. */
        debug('Initializing NexaJS...')
        debug(JSON.stringify(_params, null, 2))
        super()

        /* Initialize wallet. */
        this.wallet = null

        // TBD
    }

    /* (Instance) test. */
    test() {
        return 'Hello Dev! This is a simple (Instance) test...'
    }

    /* (Static) test. */
    static test() {
        return 'Hello Dev! This is a simple (Static) test...'
    }

    /* (Emitter) test. */
    testEmitter() {
        this.emit('test', 'Hello Dev! This is a simple (Emitter) test...')
    }

    /**
     * Status
     *
     * Display a status report for the server.
     */
    status() {
        /* Initialize statuses. */
        const statuses = [{
            id: -1,
            message: 'error'
        }, {
            id: 0,
            message: 'unknown'
        }, {
            id: 1,
            message: 'ok'
        }]

        /* Set current status. */
        const currentStatus = statuses[2]

        /* Return current status. */
        return currentStatus
    }

    /**
     * Connect
     *
     * Create IPFS Orbit DB connection.
     */
    connect(_params) {
        debug('Adding new Connection...')

        return {
            success: true,
        }
    }

    /**
     * Disconnect
     *
     * Terminate IPFS Orbit DB connection.
     */
    disconnect(_id) {
        debug(`Disconnecting from [ ${_id} ] now...`)

        return {
            success: true,
        }
    }

    /* (Static) Account */
    // static get Account() {
    //     return _Account
    // }

    /* (Static) Address */
    // NOTE: This class is read-only and ONLY supports static methods.
    static get Address() {
        return _Address
    }

    /* (Static) Application */
    // static get App() {
    //     return _App
    // }

    /* (Static) Blockchain */
    static get Blockchain() {
        return _Blockchain
    }

    /* (Static) Crypto */
    // static get Crypto() {
    //     return _Crypto
    // }

    /* (Static) Markets */
    // NOTE: This class is read-only and ONLY supports static methods.
    // static get Markets() {
    //     return _Markets
    // }

    /* (Static) Message */
    // NOTE: This class is read-only and ONLY supports static methods.
    // static get Message() {
    //     return _Message
    // }

    /* (Static) Privacy */
    // static get Privacy() {
    //     return _Privacy
    // }

    /* (Static) Purse */
    static get Purse() {
        return _Purse
    }

    /* Rostrum */
    get Rostrum() {
        return _Rostrum
    }
    /* (Static) Rostrum */
    static get Rostrum() {
        return _Rostrum
    }

    /* (Static) RPC */
    static get RPC() {
        return _Rpc
    }

    /* (Static) Script */
    // static get Script() {
    //     return _Script
    // }

    /* (Static) Transaction */
    // static get Transaction() {
    //     return _Transaction
    // }

    /* (Static) Utilities */
    static get Utils() {
        return _Utils
    }

    /* (Static) Wallet */
    // static get Wallet() {
    //     return _Wallet
    // }

}
