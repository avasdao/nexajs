/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:message')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _sign from './src/sign.js'
import _verify from './src/verify.js'

/* Export (local) modules. */
export const sign = _sign
export const verify = _verify


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
Nexa.signMessage = sign
Nexa.verifyMessage = verify

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
