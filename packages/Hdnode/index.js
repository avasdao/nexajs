/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:hdnode')

/* Import (local) modules. */
import _deriveHdPrivateNodeFromSeed from './src/deriveHdPrivateNodeFromSeed.js'
import _encodePrivateKeyWif from './src/encodePrivateKeyWif.js'

/* Export (local) modules. */
export const deriveHdPrivateNodeFromSeed = _deriveHdPrivateNodeFromSeed
export const encodePrivateKeyWif = _encodePrivateKeyWif


/**
 * HD Node Class
 *
 * Manages HD node functions.
 */
export class Hdnode extends EventEmitter {
    constructor(_params) {
        /* Initialize HD Node class. */
        debug('Initializing HD Node...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'HD Node (Instance) is working!'
    }
    static test() {
        return 'HD Node (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize HD Node class. */
Nexa.Hdnode = Hdnode

/* Initialize HD Node modules. */
Nexa.deriveHdPrivateNodeFromSeed = deriveHdPrivateNodeFromSeed
Nexa.encodePrivateKeyWif = encodePrivateKeyWif

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
