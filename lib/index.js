/*******************************************************************************
 *
 * NexaJS Library + SDK Main Entry Module
 *
 * This file offers access to the entire suite of NexaJS packages.
 *
 * Please visit https://nexajs.org for more details.
 */

/* Initialize event emitter. */
import { EventEmitter } from 'events'

/* Import NexaJS classes */
// NOTE: This allows us to export a (default) module.
// import { Account as _Account } from '../packages/Account/index.js'
import { Address as _Address } from '@nexajs/address'
// import { Analytics as _Analytics } from '../packages/Analytics/index.js'
// import { App as _App } from '../packages/App/index.js'
import { Blockchain as _Blockchain } from '@nexajs/blockchain'
// import { Charts as _Charts } from '../packages/Charts/index.js'
// import { Crypto as _Crypto } from '../packages/Crypto/index.js'
// import { Db as _Db } from '../packages/Db/index.js'
// import { Defi as _Defi } from '../packages/Defi/index.js'
// import { Deno as _Deno } from '../packages/Deno/index.js'
// import { Express as _Express } from '../packages/Express/index.js'
import { Hdnode as _Hdnode } from '@nexajs/hdnode'
import { Id as _Id } from '@nexajs/id'
// import { Ledger as _Ledger } from '../packages/Ledger/index.js'
// import { LN as _LN } from '../packages/LN/index.js'
// import { Markets as _Markets } from '../packages/Markets/index.js'
// import { Message as _Message } from '../packages/Message/index.js'
// import { Meta as _Meta } from '../packages/Meta/index.js'
// import { Next as _Next } from '../packages/Next/index.js'
// import { Nostr as _Nostr } from '../packages/Nostr/index.js'
// import { Nuxt as _Nuxt } from '../packages/Nuxt/index.js'
// import { Privacy as _Privacy } from '../packages/Privacy/index.js'
import { Purse as _Purse } from '@nexajs/purse'
import { Rostrum as _Rostrum } from '@nexajs/rostrum'
import { Rpc as _Rpc } from '@nexajs/rpc'
// import { Script as _Script } from '../packages/Script/index.js'
// import { Slim as _Slim } from '../packages/Slim/index.js'
// import { Token as _Token } from '../packages/Token/index.js'
import { Transaction as _Transaction } from '@nexajs/transaction'
// import { Trezor as _Trezor } from '../packages/Trezor/index.js'
import { Utils as _Utils } from '@nexajs/utils'
// import { Wallet as _Wallet } from '../packages/Wallet/index.js'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa')

/* Export (individual) NexaJS classes */
export const Address = _Address
export const Blockchain = _Blockchain
export const Hdnode = _Hdnode
export const Id = _Id
export const Purse = _Purse
export const Rostrum = _Rostrum
export const Rpc = _Rpc
export const Transaction = _Transaction
export const Utils = _Utils

/* Export Account methods */
// export { methodName } from '../packages/Account/index.js'

/* Export Address methods */
export { decodeAddress } from '@nexajs/address'
export { encodeAddress } from '@nexajs/address'
export { watchAddress } from '@nexajs/address'

/* Export Analytics methods */
// export { methodName } from '../packages/Analytics/index.js'

/* Export App methods */
// export { methodName } from '../packages/App/index.js'

/* Export Blockchain methods */
export { broadcast } from '@nexajs/blockchain'

/* Export Charts methods */
// export { methodName } from '../packages/Charts/index.js'

/* Export Crypto methods */
// export { methodName } from '../packages/Crypto/index.js'

/* Export Database methods */
// export { methodName } from '../packages/Db/index.js'

/* Export DeFi methods */
// export { methodName } from '../packages/Defi/index.js'

/* Export HD Node methods */
export { deriveHdPrivateNodeFromSeed } from '@nexajs/hdnode'
export { encodePrivateKeyWif } from '@nexajs/hdnode'
export { parseWif } from '@nexajs/hdnode'

/* Export ID methods */
export { isSafuPassword } from '../packages/Id/index.js'

/* Export Markets methods */
// export { methodName } from '../packages/Markets/index.js'

/* Export Message methods */
// export { methodName } from '../packages/Message/index.js'

/* Export Meta methods */
// export { methodName } from '../packages/Meta/index.js'

/* Export Privacy methods */
// export { methodName } from '../packages/Privacy/index.js'

/* Export Purse methods */
export { getUnspentOutputs } from '@nexajs/purse'
export { sendUtxo } from '@nexajs/purse'

/* Export Rostrum methods */
export { decodeRemoteAddress } from '@nexajs/rostrum'
export { getAddressBalance } from '@nexajs/rostrum'
export { getAddressFirstUse } from '@nexajs/rostrum'
export { getAddressHistory } from '@nexajs/rostrum'
export { getAddressMempool } from '@nexajs/rostrum'
export { getAddressScriptHash } from '@nexajs/rostrum'
export { getAddressUnspent } from '@nexajs/rostrum'
// ...
export { getBlock } from '@nexajs/rostrum'
// ...
export { getGenesisInfo } from '@nexajs/rostrum'
export { getTokenInfo } from '@nexajs/rostrum'
export { getNftList } from '@nexajs/rostrum'
// ...
export { getTokenHistory } from '@nexajs/rostrum'

/* Export RPC methods */
export { callNode } from '@nexajs/rpc'
export { connectToNode } from '@nexajs/rpc'

/* Export Script methods */
// export { methodName } from '../packages/Script/index.js'

/* Export Token methods */
// export { methodName } from '../packages/Token/index.js'

/* Export Transaction methods */
// export { createBchTransaction } from '@nexajs/transaction'
export { createNexaTransaction } from '@nexajs/transaction'

/* Export Utility methods */
export { bigIntToCompactUint } from '@nexajs/utils'
export { Opcodes } from '@nexajs/utils'
export { reverseHex } from '@nexajs/utils'

/* Export Wallet methods */
// export { methodName } from '../packages/Wallet/index.js'

/* Export WebAssembly methods */
// export { methodName } from '../packages/WebAssembly/index.js'

/* Export Zero-knowledge Proof methods */
// export { methodName } from '../packages/Zkp/index.js'


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
        debug('Initializing NexaJS Library + SDK...')
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
     * Returns a readiness status for the Library.
     */
    static get status() {
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
     * Report
     *
     * Returns a JSON-formatted usage report for the Library.
     */
    static get report() {
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

    /* Account */
    // static get Account() {
    //     return _Account
    // }

    /* Address */
    // NOTE: This class is read-only and ONLY supports static methods.
    static get Address() {
        return _Address
    }

    /* Application */
    // static get App() {
    //     return _App
    // }

    /* Blockchain */
    static get Blockchain() {
        return _Blockchain
    }

    /* Crypto */
    // static get Crypto() {
    //     return _Crypto
    // }

    /* Nexa ID Protocol */
    static get Id() {
        return _Id
    }

    /* Markets */
    // static get Markets() {
    //     return _Markets
    // }

    /* Message */
    // static get Message() {
    //     return _Message
    // }

    /* Privacy */
    // static get Privacy() {
    //     return _Privacy
    // }

    /* Purse */
    static get Purse() {
        return _Purse
    }

    /* Rostrum */
    static get Rostrum() {
        return _Rostrum
    }

    /* RPC */
    static get RPC() {
        return _Rpc
    }

    /* Script */
    // static get Script() {
    //     return _Script
    // }

    /* Transaction */
    static get Transaction() {
        return _Transaction
    }

    /* Utilities */
    static get Utils() {
        return _Utils
    }

    /* Wallet */
    // static get Wallet() {
    //     return _Wallet
    // }
}
