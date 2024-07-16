/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Slim Class
 *
 * Manages slim functions.
 */
export class Slim extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Slim class. */
        // console.info('Initializing Slim...')
        // console.log(JSON.stringify(_primary, null, 2))
        // console.log(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Slim (Instance) is working!'
    }
    static test() {
        return 'Slim (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Slim class. */
Nexa.Slim = Slim

/* Initialize Slim modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
