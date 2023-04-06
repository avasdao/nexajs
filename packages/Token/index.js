/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:token')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Token Class
 *
 * Manages token functions.
 */
export class Token extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Token class. */
        debug('Initializing Token...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Token (Instance) is working!'
    }
    static test() {
        return 'Token (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Token class. */
Nexa.Token = Token

/* Initialize Token modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
