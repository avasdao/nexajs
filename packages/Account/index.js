/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Account Class
 *
 * Manages account functions.
 */
export class Account extends EventEmitter {
    constructor(_params) {
        /* Initialize Account class. */
        // console.info('Initializing Account...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Account (Instance) is working!'
    }
    static test() {
        return 'Account (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Account class. */
Nexa.Account = Account

/* Initialize Account modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
