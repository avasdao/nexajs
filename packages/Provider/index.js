/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _broadcast from './src/broadcast.js'
import _getAddressBalance from './src/getAddressBalance.js'

/* Export (local) modules. */
export const broadcast = _broadcast
export const getAddressBalance = _getAddressBalance


/**
 * Provider Class
 *
 * TBD
 */
export class Provider extends EventEmitter {
    constructor(_params) {
        /* Initialize Provider class. */
        // console.info('Initializing Provider...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Provider (Instance) is working!'
    }
    static test() {
        return 'Provider (Static) is working!'
    }

    static getAddressBalance(_address, _filter) {
        return getAddressBalance(_address, _filter)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Provider class. */
Nexa.Provider = Provider

/* Initialize Provider modules. */
Nexa.broadcast = broadcast

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
