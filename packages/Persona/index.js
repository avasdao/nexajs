/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Persona Class
 *
 * Manages account functions.
 */
export class Persona extends EventEmitter {
    constructor(_params) {
        /* Initialize Persona class. */
        // console.info('Initializing Persona...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Persona (Instance) is working!'
    }
    static test() {
        return 'Persona (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Persona class. */
Nexa.Persona = Persona

/* Initialize Persona modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
