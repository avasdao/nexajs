/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:swap')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Swap Class
 *
 * Manages script functions.
 */
export class Swap extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Swap class. */
        debug('Initializing Swap...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Swap (Instance) is working!'
    }
    static test() {
        return 'Swap (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Swap class. */
Nexa.Swap = Swap

/* Initialize Swap modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
