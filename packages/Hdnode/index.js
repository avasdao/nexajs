/* Import (local) modules. */
import _decodePrivateKeyWif from './src/decodePrivateKeyWif.js'
import _deriveHdPath from './src/deriveHdPathAlt.js'
import _deriveHdPrivateNodeChild from './src/deriveHdPrivateNodeChild.js'
import _deriveHdPrivateNodeFromSeed from './src/deriveHdPrivateNodeFromSeed.js'
import _deriveHdPrivateNodeIdentifier from './src/deriveHdPrivateNodeIdentifier.js'
import _encodePrivateKeyWif from './src/encodePrivateKeyWif.js'
import _parseWif from './src/parseWif.js'

/* Export (local) modules. */
export const decodePrivateKeyWif = _decodePrivateKeyWif
export const deriveHdPath = _deriveHdPath
export const deriveHdPrivateNodeChild = _deriveHdPrivateNodeChild
export const deriveHdPrivateNodeFromSeed = _deriveHdPrivateNodeFromSeed
export const deriveHdPrivateNodeIdentifier = _deriveHdPrivateNodeIdentifier
export const encodePrivateKeyWif = _encodePrivateKeyWif
export const parseWif = _parseWif

/* Ethers.js helpers. */
import { entropyToMnemonic as _entropyToMnemonic } from '@ethersproject/hdnode'
import { isValidMnemonic as _isValidMnemonic } from '@ethersproject/hdnode'
import { mnemonicToEntropy as _mnemonicToEntropy } from '@ethersproject/hdnode'
import { mnemonicToSeed as _mnemonicToSeed } from '@ethersproject/hdnode'
// TODO Add `seedToMnemonic`??

/* Export (Ethers.js) modules. */
export const entropyToMnemonic = _entropy => _entropyToMnemonic('0x' + _entropy)
export const isValidMnemonic = _isValidMnemonic
export const mnemonicToEntropy = _mnemonic => _mnemonicToEntropy(_mnemonic).slice(2)
export const mnemonicToSeed = _mnemonic => _mnemonicToSeed(_mnemonic).slice(2)
// TODO Add `seedToMnemonic`??


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
Nexa.decodePrivateKeyWif = decodePrivateKeyWif
Nexa.deriveHdPath = deriveHdPath
Nexa.deriveHdPrivateNodeChild = deriveHdPrivateNodeChild
Nexa.deriveHdPrivateNodeFromSeed = deriveHdPrivateNodeFromSeed
Nexa.deriveHdPrivateNodeIdentifier = deriveHdPrivateNodeIdentifier
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
