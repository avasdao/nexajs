/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'


export const welcome = () => {
    return 'Welcome!'
}

/**
 * Charts Class
 *
 * TBD
 */
export class Charts extends EventEmitter {
    constructor(_params) {
        /* Initialize Charts class. */
        // console.info('Initializing Charts...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Charts class. */
Nexa.Charts = Charts

/* Initialize Charts modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
