/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse')

/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Import (local) modules. */
import _getDustAmount from './src/getDustAmount.js'
import _sendCoin from './src/sendCoin.js'
import _sendCoinMulti from './src/sendCoinMulti.js'

/* Export (local) modules. */
export const getDustAmount = _getDustAmount
export const send = _sendCoin // alias
export const sendCoin = _sendCoin
export const sendCoinMulti = _sendCoinMulti


/**
 * Purse Class
 *
 * Manages individual unspent transaction outputs (UTXOs).
 */
export class Purse extends EventEmitter {
    constructor(_params) {
        /* Initialize Purse class. */
        debug('Initializing Purse...')
        debug(JSON.stringify(_params, null, 2))
        super()

        /* Validate parameters. */
        if (!_params) {
            throw new Error(`Oops! You MUST provide a seed to initialize a Purse.`)
        }

        /* Set private key. */
        this._privateKey = _params?.privateKey

        if (!this._privateKey) {

        }

        // TBD
    }

    get privateKey() {
        return this._privateKey
    }

    set privateKey(_privateKey) {
        this._privateKey = _privateKey
    }

    test() {
        return 'Purse (Instance) is ready to GO!'
    }
    static test() {
        return 'Purse (Static) is ready to GO!'
    }

    send(_params) {
        return send(_params)
    }
    static send(_params) {
        return send(_params)
    }

}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Purse class. */
Nexa.Purse = Purse

/* Initialize Purse modules. */
Nexa.getDustAmount = getDustAmount
Nexa.send = send // alias
Nexa.sendCoin = sendCoin
Nexa.sendCoinMulti = sendCoinMulti

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
