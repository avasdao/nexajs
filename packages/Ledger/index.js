/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Ledger Class
 *
 * Manages Ledger functions.
 */
export class Ledger extends EventEmitter {
    constructor(_params) {
        /* Initialize Ledger class. */
        console.info('Initializing Ledger...')
        console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Ledger (Instance) is working!'
    }
    static test() {
        return 'Ledger (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Ledger class. */
Nexa.Ledger = Ledger

/* Initialize Ledger modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
