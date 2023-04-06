/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:blockchain')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _broadcast from './src/broadcast.js'

/* Export (local) modules. */
export const broadcast = _broadcast


/**
 * Blockchain Class
 *
 * TBD
 */
export class Blockchain extends EventEmitter {
    constructor(_params) {
        /* Initialize Blockchain class. */
        debug('Initializing Blockchain...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Blockchain (Instance) is working!'
    }
    static test() {
        return 'Blockchain (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Blockchain class. */
Nexa.Blockchain = Blockchain

/* Initialize Blockchain modules. */
Nexa.broadcast = broadcast

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
