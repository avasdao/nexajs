/* Import (local) modules. */
import _base58ToBin from './src/base58ToBin.js'
import _bigIntToBinUint16LE from './src/bigIntToBinUint16LE.js'
import _bigIntToBinUint32LE from './src/bigIntToBinUint32LE.js'
import _bigIntToBinUint64LE from './src/bigIntToBinUint64LE.js'
import _bigIntToBitcoinVarInt from './src/bigIntToBitcoinVarInt.js'
import _bigIntToCompactUint from './src/bigIntToCompactUint.js'
import _binToBase58 from './src/binToBase58.js'
import _binToHex from './src/binToHex.js'
import _binToUtf8 from './src/binToUtf8.js'
import _flattenBinArray from './src/flattenBinArray.js'
import _hexToBin from './src/hexToBin.js'
import _isHex from './src/isHex.js'
import _isJson from './src/isJson.js'
import _numberToBinUint16LE from './src/numberToBinUint16LE.js'
import _numberToBinUint32LE from './src/numberToBinUint32LE.js'
import _numberToBinUintLE from './src/numberToBinUintLE.js'
import _reverseHex from './src/reverseHex.js'
import _sleep from './src/sleep.js'
import _utf8ToBin from './src/utf8ToBin.js'

/* Export (local) modules. */
export const base58ToBin = _base58ToBin
export const bigIntToBinUint16LE = _bigIntToBinUint16LE
export const bigIntToBinUint32LE = _bigIntToBinUint32LE
export const bigIntToBinUint64LE = _bigIntToBinUint64LE
export const bigIntToBitcoinVarInt = _bigIntToBitcoinVarInt
export const bigIntToCompactUint = _bigIntToCompactUint
export const binToBase58 = _binToBase58
export const binToHex = _binToHex
export const binToUtf8 = _binToUtf8
export const flattenBinArray = _flattenBinArray
export const hexToBin = _hexToBin
export const isHex = _isHex
export const isJson = _isJson
export const numberToBinUint16LE = _numberToBinUint16LE
export const numberToBinUint32LE = _numberToBinUint32LE
export const numberToBinUintLE = _numberToBinUintLE
export const reverseHex = _reverseHex
export const sleep = _sleep
export const utf8ToBin = _utf8ToBin


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

    static sleep(_milliseconds) {
        return sleep(_milliseconds)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Utilities class. */
Nexa.Utils = Utils

/* Initialize Utilities modules. */
Nexa.base58ToBin = base58ToBin
Nexa.bigIntToBinUint16LE = bigIntToBinUint16LE
Nexa.bigIntToBinUint32LE = bigIntToBinUint32LE
Nexa.bigIntToBinUint64LE = bigIntToBinUint64LE
Nexa.bigIntToBitcoinVarInt = bigIntToBitcoinVarInt
Nexa.bigIntToCompactUint = bigIntToCompactUint
Nexa.binToBase58 = binToBase58
Nexa.binToHex = binToHex
Nexa.binToUtf8 = binToUtf8
Nexa.flattenBinArray = flattenBinArray
Nexa.hexToBin = hexToBin
Nexa.isHex = isHex
Nexa.isJson = isJson
Nexa.numberToBinUint16LE = numberToBinUint16LE
Nexa.numberToBinUint32LE = numberToBinUint32LE
Nexa.numberToBinUintLE = numberToBinUint32LE
Nexa.reverseHex = reverseHex
Nexa.sleep = sleep
Nexa.utf8ToBin = utf8ToBin

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
