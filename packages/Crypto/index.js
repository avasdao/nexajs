/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// import _decrypt from './src/decrypt.js'
// import _encrypt from './src/encrypt.js'
// import _passwordToSafu from './src/passwordToSafu.js'
import _getHmac from './src/getHmac.js'
import _ripemd160 from './src/ripemd160.js'
import _sha256 from './src/sha256.js'
import _sha512 from './src/sha512.js'

/* Export (local) modules. */
// export const decrypt = _decrypt
// export const encrypt = _encrypt
// export const passwordToSafu = _passwordToSafu
export const getHmac = _getHmac
export const ripemd160 = _ripemd160
export const sha256 = _sha256
export const sha512 = _sha512

/* Provide Ether.js helpers. */
import { randomBytes as _randomBytes } from '@ethersproject/random'
export const randomBytes = _randomBytes


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
// Nexa.decrypt = decrypt
// Nexa.encrypt = encrypt
// Nexa.passwordToSafu = passwordToSafu
Nexa.getHmac = getHmac
Nexa.randomBytes = randomBytes
Nexa.ripemd160 = ripemd160
Nexa.sha256 = sha256
Nexa.sha512 = sha512

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
