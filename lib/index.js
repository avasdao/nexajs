/*******************************************************************************
 *
 * NEXA.js Library + SDK Main Entry Module
 *
 * This file offers access to the entire suite of NEXA.js packages.
 *
 * Please visit https://nexajs.org for more details.
 */

/* Initialize event emitter. */
import { EventEmitter } from 'events'

/* Import NEXA.js classes */
// NOTE: This allows us to export a (default) module.
// import { Account as _Account } from '../packages/Account/index.js'
import { Address as _Address } from '@nexajs/address'
// import { Analytics as _Analytics } from '../packages/Analytics/index.js'
import { App as _App } from '@nexajs/app'
// import { Charts as _Charts } from '../packages/Charts/index.js'
import { Crypto as _Crypto } from '@nexajs/crypto'
// import { Db as _Db } from '../packages/Db/index.js'
// import { Defi as _Defi } from '../packages/Defi/index.js'
// import { Deno as _Deno } from '../packages/Deno/index.js'
// import { Express as _Express } from '../packages/Express/index.js'
import { Hdnode as _Hdnode } from '@nexajs/hdnode'
import { Id as _Id } from '@nexajs/id'
// import { Ledger as _Ledger } from '../packages/Ledger/index.js'
// import { LN as _LN } from '../packages/LN/index.js'
import { Market as _Market } from '@nexajs/market'
import { Message as _Message } from '@nexajs/message'
// import { Meta as _Meta } from '../packages/Meta/index.js'
// import { Next as _Next } from '../packages/Next/index.js'
// import { Nostr as _Nostr } from '../packages/Nostr/index.js'
// import { Nuxt as _Nuxt } from '../packages/Nuxt/index.js'
import { Privacy as _Privacy } from '../packages/Privacy/index.js'
import { Provider as _Provider } from '@nexajs/provider'
import { Purse as _Purse } from '@nexajs/purse'
import { Request as _Request } from '@nexajs/request'
import { Rostrum as _Rostrum } from '@nexajs/rostrum'
import { Rpc as _Rpc } from '@nexajs/rpc'
import { Script as _Script } from '@nexajs/script'
// import { Slim as _Slim } from '../packages/Slim/index.js'
import { Token as _Token } from '@nexajs/token'
import { Transaction as _Transaction } from '@nexajs/transaction'
// import { Trezor as _Trezor } from '../packages/Trezor/index.js'
import { Utils as _Utils } from '@nexajs/utils'
import { Wallet as _Wallet } from '@nexajs/wallet'
// import { Wasm as _Wasm } from '@nexajs/wasm'
// import { Zkp as _Zkp } from '@nexajs/zkp'

/* Export (individual) NEXA.js classes */
// export const Account = _Account
export const Address = _Address
// export const Analytics = _Analytics
export const App = _App
// export const Bridge = _Bridge
// export const Charts = _Charts
export const Crypto = _Crypto
// export const Db = _Db
// export const Defi = _Defi
// export const Deno = _Deno
// export const Express = _Express
export const Hdnode = _Hdnode
export const Id = _Id
// export const Ledger = _Ledger
// export const LN = _LN
export const Market = _Market
export const Message = _Message
// export const Meta = _Meta
// export const Next = _Next
// export const Nostr = _Nostr
export const Privacy = _Privacy
export const Provider = _Provider
export const Purse = _Purse
export const Request = _Request
export const Rostrum = _Rostrum
export const Rpc = _Rpc
export const Script = _Script
// export const Slim = _Slim
export const Token = _Token
export const Transaction = _Transaction
// export const Trezor = _Trezor
export const Utils = _Utils
export const Wallet = _Wallet
// export const Wasm = _Wasm
// export const Zkp = _Zkp

//------------------------------------------------------------------------------

/* Export Account methods */
// export { methodName } from '../packages/Account/index.js'

/* Export Address methods */
export { decodeAddress } from '@nexajs/address'
export { decodeBase58AddressFormat } from '@nexajs/address'
export { encodeAddress } from '@nexajs/address'
export { getSender } from '@nexajs/address'
export { listUnspent } from '@nexajs/address'
export { watchAddress } from '@nexajs/address'

/* Export Analytics methods */
// export { methodName } from '../packages/Analytics/index.js'

/* Export App methods */
export { copyToClipboard } from '@nexajs/app'

/* Export Charts methods */
// export { methodName } from '../packages/Charts/index.js'

/* Export Crypto methods */
export { decrypt } from '@nexajs/crypto'
export { encrypt } from '@nexajs/crypto'
export { getHmac } from '@nexajs/crypto'
export { randomBytes } from '@nexajs/crypto'
export { ripemd160 } from '@nexajs/crypto'
export { sha256 } from '@nexajs/crypto'
export { sha512 } from '@nexajs/crypto'
export { signMessageHashSchnorr } from '@nexajs/crypto'

/* Export Database methods */
// export { methodName } from '../packages/Db/index.js'

/* Export DeFi methods */
// export { methodName } from '../packages/Defi/index.js'

/* Export HD Node methods */
export { deriveHdPrivateNodeFromSeed } from '@nexajs/hdnode'
export { decodePrivateKeyWif } from '@nexajs/hdnode'
export { encodePrivateKeyWif } from '@nexajs/hdnode'
export { parseWif } from '@nexajs/hdnode'
export { validateSecp256k1PrivateKey } from '@nexajs/hdnode'
export { entropyToMnemonic } from '@nexajs/hdnode' // Ethers.js helper
export { isValidMnemonic } from '@nexajs/hdnode' // Ethers.js helper
export { mnemonicToEntropy } from '@nexajs/hdnode' // Ethers.js helper
export { mnemonicToSeed } from '@nexajs/hdnode' // Ethers.js helper

/* Export ID methods */
export { isSafuPassword } from '@nexajs/id'

/* Export Market methods */
export { getPrice } from '@nexajs/market'
export { getQuote } from '@nexajs/market'
export { getTicker } from '@nexajs/market'

/* Export Message methods */
export { sign as signMessage } from '@nexajs/message'
export { verify as verifyMessage } from '@nexajs/message'

/* Export Meta methods */
// export { methodName } from '../packages/Meta/index.js'

/* Export Privacy methods */
export { sendToPeer } from '../packages/Privacy/index.js'

/* Export Provider methods */
export { broadcast } from '@nexajs/provider'

/* Export Purse methods */
export { buildCoins } from '@nexajs/purse'
export { getCoins } from '@nexajs/purse'
export { sendCoin } from '@nexajs/purse' // alias (DEPRECATED)
export { sendCoins } from '@nexajs/purse'

/* Export Request methods */
export { callUrl } from '@nexajs/request'

/* Export Rostrum methods */
export { decodeRemoteAddress } from '@nexajs/rostrum'
export { getAddressBalance } from '@nexajs/rostrum'
export { getAddressFirstUse } from '@nexajs/rostrum'
export { getAddressHistory } from '@nexajs/rostrum'
export { getAddressMempool } from '@nexajs/rostrum'
export { getAddressScriptHash } from '@nexajs/rostrum'
export { getAddressUnspent } from '@nexajs/rostrum'
export { getBlock } from '@nexajs/rostrum'
export { getTransaction } from '@nexajs/rostrum'
export { getGenesisInfo } from '@nexajs/rostrum'
export { getTokenInfo } from '@nexajs/rostrum'
export { getAddressTokenBalance } from '@nexajs/rostrum'
export { getAddressTokenHistory } from '@nexajs/rostrum'
export { getAddressTokenMempool } from '@nexajs/rostrum'
export { getAddressTokenUnspent } from '@nexajs/rostrum'
export { getNftList } from '@nexajs/rostrum'
export { getOutpoint } from '@nexajs/rostrum'
export { getTip } from '@nexajs/rostrum'
export { getTokenHistory } from '@nexajs/rostrum'
export { subscribeAddress } from '@nexajs/rostrum'

/* Export RPC methods */
export { callNode } from '@nexajs/rpc'
export { connectToNode } from '@nexajs/rpc'

/* Export Script methods */
export { decodeNullData } from '@nexajs/script'
export { encodeDataPush } from '@nexajs/script'
export { encodeNullData } from '@nexajs/script'
export { OP } from '@nexajs/script'

/* Export Token methods */
export { buildTokens } from '@nexajs/token'
export { getGroupDataScript } from '@nexajs/token'
export { getGroupId } from '@nexajs/token'
export { getSubgroupDataScript } from '@nexajs/token'
export { getTokens } from '@nexajs/token'
export { getTopTokens } from '@nexajs/token'
export { sendToken } from '@nexajs/token' // alias (DEPRECATED)
export { sendTokens } from '@nexajs/token'

/* Export Transaction methods */
export { createTransaction } from '@nexajs/transaction'

/* Export Utility methods */
export { base58ToBin } from '@nexajs/utils'
export { bigIntToBinUint16LE } from '@nexajs/utils' // TODO Rename to `bigIntToUint16LE`
export { bigIntToBinUint32LE } from '@nexajs/utils' // TODO Rename to `bigIntToUint32LE`
export { bigIntToBinUint64LE } from '@nexajs/utils' // TODO Rename to `bigIntToUint32LE`
export { bigIntToCompactUint } from '@nexajs/utils' // TODO Rename to `bigIntToUintCompact`
export { binToBase58 } from '@nexajs/utils'
export { binToHex } from '@nexajs/utils'
export { binToUtf8 } from '@nexajs/utils'
export { flattenBinArray } from '@nexajs/utils'
export { hexToBin } from '@nexajs/utils'
export { numberToBinUint16LE } from '@nexajs/utils' // TODO Rename to `numberToUint16LE`
export { numberToBinUint32LE } from '@nexajs/utils' // TODO Rename to `numberToUint32LE`
export { reverseHex } from '@nexajs/utils'
export { sleep } from '@nexajs/utils'
export { utf8ToBin } from '@nexajs/utils'

/* Export Wallet methods */
export { build } from '@nexajs/wallet'
export { getDerivationPath } from '@nexajs/wallet'
export { parseDerivationPath } from '@nexajs/wallet'
export { send } from '@nexajs/wallet'
export { WalletStatus } from '@nexajs/wallet'

/* Export Wasm methods */
// export { methodName } from '../packages/Wasm/index.js'

/* Export Zero-knowledge Proof methods */
// export { methodName } from '../packages/Zkp/index.js'

//------------------------------------------------------------------------------

/**
 * Nexa Main (default) Module Class
 *
 * Main class/module for the NEXA.js Library + Software Development Kit (SDK).
 *
 * NOTE: This is a (default) module, so it DOES NOT require curly braces
 *       when importing into your application.
 */
export default class Nexa extends EventEmitter {
    constructor(_params) {
        /* Initialize NEXA.js class. */
        console.info('Initializing NEXA.js Library + SDK...')
        console.log(JSON.stringify(_params, null, 2))
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

    /* Crypto */
    static get Crypto() {
        return _Crypto
    }

    /* Nexa ID Protocol */
    static get Id() {
        return _Id
    }

    /* Market */
    static get Market() {
        return _Market
    }

    /* Message */
    static get Message() {
        return _Message
    }

    /* Meta */
    // static get Meta() {
    //     return _Meta
    // }

    /* Privacy */
    static get Privacy() {
        return _Privacy
    }

    /* Provider */
    static get Provider() {
        return _Provider
    }

    /* Purse */
    static get Purse() {
        return _Purse
    }

    /* Request */
    static get Request() {
        return _Request
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
    static get Script() {
        return _Script
    }

    /* Transaction */
    static get Transaction() {
        return _Transaction
    }

    /* Utilities */
    static get Utils() {
        return _Utils
    }

    /* Wallet */
    static get Wallet() {
        return _Wallet
    }

    /* Wasm */
    // static get Wasm() {
    //     return _Wasm
    // }

    /* Zero-knowledge Proof */
    // static get Zkp() {
    //     return _Zkp
    // }
}
