/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:defi')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD


/**
 * DeFi Class
 *
 * Manages decentralized finance functions.
 */
export class Defi extends EventEmitter {
    constructor(_params) {
        /* Initialize DeFi class. */
        debug('Initializing DeFi...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'DeFi (Instance) is working!'
    }
    static test() {
        return 'DeFi (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize DeFi class. */
Nexa.Defi = Defi

/* Initialize DeFi modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
