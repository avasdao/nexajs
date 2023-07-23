/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:utils')

/* Import (local) modules. */
import _bigIntToBinUint16LE from './src/bigIntToBinUint16LE.js'
import _bigIntToBinUint32LE from './src/bigIntToBinUint32LE.js'
import _bigIntToBinUint64LE from './src/bigIntToBinUint64LE.js'
import _bigIntToCompactUint from './src/bigIntToCompactUint.js'
import _binToHex from './src/binToHex.js'
import _hexToBin from './src/hexToBin.js'
import _numberToBinUint16LE from './src/numberToBinUint16LE.js'
import _numberToBinUint32LE from './src/numberToBinUint32LE.js'

/* Export (local) modules. */
export const bigIntToBinUint16LE = _bigIntToBinUint16LE
export const bigIntToBinUint32LE = _bigIntToBinUint32LE
export const bigIntToBinUint64LE = _bigIntToBinUint64LE
export const bigIntToCompactUint = _bigIntToCompactUint
export const binToHex = _binToHex
export const hexToBin = _hexToBin
export const numberToBinUint16LE = _numberToBinUint16LE
export const numberToBinUint32LE = _numberToBinUint32LE


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
Nexa.bigIntToBinUint16LE = bigIntToBinUint16LE
Nexa.bigIntToBinUint32LE = bigIntToBinUint32LE
Nexa.bigIntToBinUint64LE = bigIntToBinUint64LE
Nexa.bigIntToCompactUint = bigIntToCompactUint
Nexa.binToHex = binToHex
Nexa.hexToBin = hexToBin
Nexa.numberToBinUint16LE = numberToBinUint16LE
Nexa.numberToBinUint32LE = numberToBinUint32LE
Nexa.reverseHex = reverseHex

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
