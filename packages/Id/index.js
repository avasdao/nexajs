/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:id')

/* Import (local) modules. */
import _isSafuPassword from './src/isSafuPassword.js'

/* Export (local) modules. */
export const isSafuPassword = _isSafuPassword

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
Nexa.Id = Id

/* Initialize ID modules. */
Nexa.isSafuPassword = isSafuPassword

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
