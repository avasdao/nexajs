/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse')


// FIXME FOR DEV PURPOSES ONLY
export const testPurse = () => {
    return 'NexaJS Purse is ready to GO!'
}

export const sendUtxo = (_params) => {
    debug('Sending UTXO...')
    debug(JSON.stringify(_params, null, 2))

    return {
        msg: 'TESTING!',
        success: true,
    }
}

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
        testPurse()
    }

    static staticTest() {
        console.log('Running STATIC Purse test...')
        testPurse()
    }

    sendUtxo(_params) {
        return sendUtxo(_params)
    }
    static sendUtxo(_params) {
        return sendUtxo(_params)
    }

}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Purse class. */
Nexa.Purse = Purse

/* Initialize Purse modules. */
Nexa.sendUtxo = sendUtxo

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
