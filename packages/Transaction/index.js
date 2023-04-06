/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:transaction')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// import _createBchTransaction from './src/createBchTransaction.js'
import _createNexaTransaction from './src/createNexaTransaction.js'

/* Export (local) modules. */
// export const createBchTransaction = _createBchTransaction
export const createNexaTransaction = _createNexaTransaction


/**
 * Transaction Class
 *
 * Manages transaction functions.
 */
export class Transaction extends EventEmitter {
    constructor(_params) {
        /* Initialize Transaction class. */
        debug('Initializing Transaction...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Transaction (Instance) is working!'
    }
    static test() {
        return 'Transaction (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Transaction class. */
Nexa.Transaction = Transaction

/* Initialize Transaction modules. */
// Nexa.createBchTransaction = createBchTransaction
Nexa.createNexaTransaction = createNexaTransaction

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
