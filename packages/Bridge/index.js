/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Bridge Class
 *
 * Manages script functions.
 */
export class Bridge extends EventEmitter {
    constructor(_params) {
        /* Initialize Bridge class. */
        console.info('Initializing Bridge...')
        console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Bridge (Instance) is working!'
    }

    static test() {
        return 'Bridge (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Bridge class. */
Nexa.Bridge = Bridge

/* Initialize Bridge modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
