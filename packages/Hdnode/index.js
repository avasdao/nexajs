/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:hdnode')

/* Import (local) modules. */
import _deriveHdPrivateNodeFromSeed from './src/deriveHdPrivateNodeFromSeed.js'
import _encodePrivateKeyWif from './src/encodePrivateKeyWif.js'
import _parseWif from './src/parseWif.js'

/* Export (local) modules. */
export const deriveHdPrivateNodeFromSeed = _deriveHdPrivateNodeFromSeed
export const encodePrivateKeyWif = _encodePrivateKeyWif
export const parseWif = _parseWif

/* Ethers.js helpers. */
import { entropyToMnemonic as _entropyToMnemonic } from '@ethersproject/hdnode'
import { isValidMnemonic as _isValidMnemonic } from '@ethersproject/hdnode'
import { mnemonicToEntropy as _mnemonicToEntropy } from '@ethersproject/hdnode'
import { mnemonicToSeed as _mnemonicToSeed } from '@ethersproject/hdnode'

/* Export (Ethers.js) modules. */
export const entropyToMnemonic = _entropyToMnemonic
export const isValidMnemonic = _isValidMnemonic
export const mnemonicToEntropy = _mnemonicToEntropy
export const mnemonicToSeed = _mnemonicToSeed


/**
 * HD Node Class
 *
 * Manages HD node functions.
 */
export class Hdnode {
    // NOTE: We won't use a constructor, as this is a "pure" class.

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
Nexa.parseWif = parseWif
Nexa.entropyToMnemonic = entropyToMnemonic // Ethers.js helpers
Nexa.isValidMnemonic = isValidMnemonic // Ethers.js helpers
Nexa.mnemonicToEntropy = mnemonicToEntropy // Ethers.js helpers
Nexa.mnemonicToSeed = mnemonicToSeed // Ethers.js helpers

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
