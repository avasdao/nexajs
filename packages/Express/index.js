/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Express Class
 *
 * Manages Express functions.
 */
export class Express extends EventEmitter {
    constructor(_params) {
        /* Initialize Express class. */
        // console.info('Initializing Express...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Express (Instance) is working!'
    }
    static test() {
        return 'Express (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Express class. */
Nexa.Express = Express

/* Initialize Express modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
