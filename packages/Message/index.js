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
 * Message Class
 *
 * Manages message functions.
 */
export class Message extends EventEmitter {
    constructor(_params) {
        /* Initialize Message class. */
        debug('Initializing Message...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Message (Instance) is working!'
    }
    static test() {
        return 'Message (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Message class. */
Nexa.Message = Message

/* Initialize Message modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
