/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Deno Class
 *
 * Manages Deno functions.
 */
export class Deno extends EventEmitter {
    constructor(_params) {
        /* Initialize Deno class. */
        // console.info('Initializing Deno...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Deno (Instance) is working!'
    }
    static test() {
        return 'Deno (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Deno class. */
Nexa.Deno = Deno

/* Initialize Deno modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
