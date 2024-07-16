/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Next Class
 *
 * Manages Next functions.
 */
export class Next extends EventEmitter {
    constructor(_params) {
        /* Initialize Next class. */
        // console.info('Initializing Next...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Next (Instance) is working!'
    }
    static test() {
        return 'Next (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Next class. */
Nexa.Next = Next

/* Initialize Next modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
