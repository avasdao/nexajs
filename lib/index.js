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
import { Rostrum as _Rostrum } from '../packages/Rostrum/index.js'
import { Rpc as _Rpc } from '@nexajs/rpc'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexajs')

/* Export (individual) NexaJS classes */
export const Address = _Address
// export const Blockchain = _Blockchain
export const Purse = _Purse
export const Rostrum = _Rostrum
export const Rpc = _Rpc

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
export { bAddressDecode } from '../packages/Rostrum/index.js'

/* Export RPC methods */
export { callNode } from '@nexajs/rpc'
export { connectToNode } from '@nexajs/rpc'

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
    connect() {
        debug('ADD CONNECTION')

        return 1
    }

    /**
     * Disconnect
     *
     * Terminate IPFS Orbit DB connection.
     */
    disconnect() {
        debug('DISCONNECT')

        return 0
    }

    /* (Static) Account */
    // static get Account() {
    //     return require('./Account')
    // }

    /* (Static) Address */
    // NOTE: This class is read-only and ONLY supports static methods.
    static get Address() {
        return _Address
    }

    /* (Static) Application */
    // static get App() {
    //     return require('./App')
    // }

    /* (Static) Blockchain */
    static get Blockchain() {
        return _Blockchain
    }

    /* (Static) Crypto */
    // static get Crypto() {
    //     return require('./Crypto')
    // }

    /* (Static) Markets */
    // NOTE: This class is read-only and ONLY supports static methods.
    // static get Markets() {
    //     return require('./Markets')
    // }

    /* (Static) Message */
    // NOTE: This class is read-only and ONLY supports static methods.
    // static get Message() {
    //     return require('./Message')
    // }

    /* (Static) Privacy */
    // static get Privacy() {
    //     return require('./Privacy')
    // }

    /* (Static) Purse */
    static get Purse() {
        return _Purse
    }

    /* (Static) RPC */
    static get RPC() {
        return _Rpc
    }

    /* (Static) Script */
    // static get Script() {
    //     return require('./Script')
    // }

    /* (Static) Transaction */
    // static get Transaction() {
    //     return require('./Transaction')
    // }

    /* (Static) Utilities */
    // static get Utils() {
    //     return require('./Utils')
    // }

    /* (Static) Wallet */
    // static get Wallet() {
    //     return require('./Wallet')
    // }

}

/* Export (default) module. */
// NOTE: This allows importing the (NexaJS) module without curly braces.
// export default Nexa
// export default {
//     Address,
//     Purse,
//     Rpc,
// }
