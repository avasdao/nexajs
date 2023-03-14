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
 * Script Class
 *
 * Manages script functions.
 */
export class Script extends EventEmitter {
    constructor(_params) {
        /* Initialize Script class. */
        debug('Initializing Script...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Script (Instance) is working!'
    }
    static test() {
        return 'Script (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Script class. */
Nexa.Script = Script

/* Initialize Script modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
