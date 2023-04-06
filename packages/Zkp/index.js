/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:zkp')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Zero-knowledge Proof Class
 *
 * Manages zero-knowledge proof functions.
 */
export class Zkp extends EventEmitter {
    constructor(_params) {
        /* Initialize ZK class. */
        debug('Initializing Zero-knowledge proof...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Zero-knowledge proof (Instance) is working!'
    }
    static test() {
        return 'Zero-knowledge proof (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Zkp class. */
Nexa.Zkp = Zkp

/* Initialize Zkp modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
