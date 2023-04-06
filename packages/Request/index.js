/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:request')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Request Class
 *
 * Manages script functions.
 */
export class Request extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Request class. */
        debug('Initializing Request...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Request (Instance) is working!'
    }
    static test() {
        return 'Request (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Request class. */
Nexa.Request = Request

/* Initialize Request modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
