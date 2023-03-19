/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:utils')

/* Import (local) modules. */
import _bigIntToCompactUint from './src/bigIntToCompactUint.js'
import _Opcodes from './src/Opcodes.js'

/* Export (local) modules. */
export const bigIntToCompactUint = _bigIntToCompactUint
export const Opcodes = _Opcodes


/**
 * Reverse Bytes
 *
 * Reverse the bytes of a HEX string.
 */
export const reverseHex = (_bytes) => {
    return _bytes.match(/[a-fA-F0-9]{2}/g).reverse().join('')
}


/**
 * Utils Class
 *
 * A suite of useful utilities.
 */
export class Utils {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    static reverseHex(_bytes) {
        return reverseHex(_bytes)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Utilities class. */
Nexa.Utils = Utils

/* Initialize Utilities modules. */
Nexa.bigIntToCompactUint = bigIntToCompactUint
Nexa.Opcodes = Opcodes
Nexa.reverseHex = reverseHex

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
