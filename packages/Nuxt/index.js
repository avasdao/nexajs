/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Nuxt Class
 *
 * Manages Nuxt functions.
 */
export class Nuxt extends EventEmitter {
    constructor(_params) {
        /* Initialize Nuxt class. */
        // console.info('Initializing Nuxt...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Nuxt (Instance) is working!'
    }
    static test() {
        return 'Nuxt (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Nuxt class. */
Nexa.Nuxt = Nuxt

/* Initialize Nuxt modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
