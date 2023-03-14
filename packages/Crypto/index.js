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
 * Crypto Class
 *
 * Manages crypto functions.
 */
export class Crypto extends EventEmitter {
    constructor(_params) {
        /* Initialize Crypto class. */
        debug('Initializing Crypto...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Crypto (Instance) is working!'
    }
    static test() {
        return 'Crypto (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Crypto class. */
Nexa.Crypto = Crypto

/* Initialize Crypto modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
