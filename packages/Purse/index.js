/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _buildCoins from './src/buildCoins.js'
import _getCoins from './src/getCoins.js'
import _getDustLimit from './src/getDustLimit.js'
import _sendCoins from './src/sendCoins.js'

/* Export (local) modules. */
export const buildCoins = _buildCoins
export const getCoins = _getCoins
export const getDustLimit = _getDustLimit
export const send = _sendCoins      // alias
export const sendCoin = _sendCoins  // alias
export const sendCoins = _sendCoins


/**
 * Purse Class
 *
 * Manages individual unspent transaction outputs (UTXOs).
 */
export class Purse extends EventEmitter {
    constructor(_params) {
        /* Initialize Purse class. */
        console.info('Initializing Purse...')
        console.log(JSON.stringify(_params, null, 2))
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
Nexa.buildCoins = buildCoins
Nexa.getCoins = getCoins
Nexa.getDustLimit = getDustLimit
Nexa.send = send            // alias
Nexa.sendCoin = sendCoins   // alias
Nexa.sendCoins = sendCoins

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
