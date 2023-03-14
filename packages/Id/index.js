/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:id')


export const login = () => {
    return 'Welcome!'
}

/**
 * ID Class
 *
 * Manage Nexa Identity Protocol client and server-side functions.
 */
export class Id extends EventEmitter {
    constructor(_params) {
        /* Initialize ID class. */
        debug('Initializing ID...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize ID class. */
Nexa.ID = ID

/* Initialize ID modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
