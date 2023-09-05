/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:app')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
import _copyToClipboard from './src/copyToClipboard.js'

/* Export (local) modules. */
export const copyToClipboard = _copyToClipboard


/**
 * App Class
 *
 * Manages app functions.
 */
export class App extends EventEmitter {
    constructor(_params) {
        /* Initialize App class. */
        debug('Initializing App...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'App (Instance) is working!'
    }
    static test() {
        return 'App (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize App class. */
Nexa.App = App

/* Initialize App modules. */
Nexa.copyToClipboard = copyToClipboard

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
