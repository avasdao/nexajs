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
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
