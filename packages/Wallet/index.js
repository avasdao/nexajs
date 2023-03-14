/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto')

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Wallet Class
 *
 * Manages wallet functions.
 */
export class Wallet extends EventEmitter {
    constructor(_params) {
        /* Initialize Wallet class. */
        debug('Initializing Wallet...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Wallet (Instance) is working!'
    }
    static test() {
        return 'Wallet (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Wallet class. */
Nexa.Wallet = Wallet

/* Initialize Wallet modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
