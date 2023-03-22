/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto')

/* Import (local) modules. */
import decrypt as _decrypt from './decrypt'
import encrypt as _encrypt from './encrypt'
import passwordToSafu as _passwordToSafu from './passwordToSafu'

/* Export (local) modules. */
export const decrypt = _decrypt
export const encrypt = _encrypt
export const passwordToSafu = _passwordToSafu


/**
 * Crypto Class
 *
 * Manages crypto functions.
 */
export class Crypto extends EventEmitter {
    constructor(_params) {
        /* Initialize Crypto class. */
        debug('Initializing Crypto...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }

    test() {
        return 'Crypto (Instance) is working!'
    }
    static test() {
        return 'Crypto (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Crypto class. */
Nexa.Crypto = Crypto

/* Initialize Crypto modules. */
Nexa.decrypt = decrypt
Nexa.encrypt = encrypt
Nexa.passwordToSafu = passwordToSafu

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
