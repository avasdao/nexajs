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
 * Lightning Network (LN) Class
 *
 * Manages Lightning Network (LN) functions.
 */
export class LN extends EventEmitter {
    constructor(_params) {
        /* Initialize Lightning Network class. */
        debug('Initializing Lightning Network...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Lightning Network (Instance) is working!'
    }
    static test() {
        return 'Lightning Network (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Lightning Network class. */
Nexa.LN = LN

/* Initialize Lightning Network modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
