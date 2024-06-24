/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Database Class
 *
 * Manages database functions.
 */
export class Db extends EventEmitter {
    constructor(_params) {
        /* Initialize Database class. */
        console.info('Initializing Database...')
        console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Database (Instance) is working!'
    }
    static test() {
        return 'Database (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Database class. */
Nexa.Db = Db

/* Initialize Database modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
