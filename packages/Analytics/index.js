/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Analytics Class
 *
 * Manages analytics functions.
 */
export class Analytics extends EventEmitter {
    constructor(_params) {
        /* Initialize Analytics class. */
        // console.info('Initializing Analytics...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Analytics (Instance) is working!'
    }
    static test() {
        return 'Analytics (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Analytics class. */
Nexa.Analytics = Analytics

/* Initialize Analytics modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
