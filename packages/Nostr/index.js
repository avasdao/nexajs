/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Nostr Class
 *
 * Manages Nostr functions.
 */
export class Nostr extends EventEmitter {
    constructor(_params) {
        /* Initialize Nostr class. */
        console.info('Initializing Nostr...')
        console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Nostr (Instance) is working!'
    }
    static test() {
        return 'Nostr (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Nostr class. */
Nexa.Nostr = Nostr

/* Initialize Nostr modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
