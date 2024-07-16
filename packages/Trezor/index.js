/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * Trezor Class
 *
 * Manages Trezor functions.
 */
export class Trezor extends EventEmitter {
    constructor(_params) {
        /* Initialize Trezor class. */
        // console.info('Initializing Trezor...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Trezor (Instance) is working!'
    }
    static test() {
        return 'Trezor (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Trezor class. */
Nexa.Trezor = Trezor

/* Initialize Trezor modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
