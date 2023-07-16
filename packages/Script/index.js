/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:script')

/* Import (local) modules. */
import _decodeNullData from './src/decodeNullData.js'
import _encodeNullData from './src/encodeNullData.js'
import _OP from './src/Opcodes.js'

/* Export (local) modules. */
export const decodeNullData = _decodeNullData
export const encodeNullData = _encodeNullData
export const OP = _OP


/**
 * Script Class
 *
 * Manages script functions.
 */
export class Script {
    constructor(_params) {
        /* Initialize Script class. */
        debug('Initializing Script...')
        debug(JSON.stringify(_params, null, 2))

        // TBD
    }

    test() {
        return 'Script (Instance) is working!'
    }

    static test() {
        return 'Script (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Script class. */
Nexa.Script = Script

/* Initialize Script modules. */
Nexa.decodeNullData = decodeNullData
Nexa.encodeNullData = encodeNullData
Nexa.OP = OP

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
