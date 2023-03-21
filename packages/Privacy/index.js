/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:privacy')

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Privacy Class
 *
 * Manages privacy functions.
 */
export class Privacy extends EventEmitter {
    constructor(_params) {
        /* Initialize Privacy class. */
        debug('Initializing Privacy...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Privacy (Instance) is working!'
    }
    static test() {
        return 'Privacy (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Privacy class. */
Nexa.Privacy = Privacy

/* Initialize Privacy modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
