/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { entropyToMnemonic } from '@nexajs/hdnode'
import { randomBytes } from '@nexajs/utils'

/* Import modules. */
import { EventEmitter } from 'events'

const DEFAULT_DERIVATION_PATH = `m/44'/29223'/0'`

/* Import (local) modules. */
import _getDerivationPath from './src/getDerivationPath.js'

/* Export (local) modules. */
export const getDerivationPath = _getDerivationPath


/**
 * Wallet Status
 *
 * Enumeration of all possible wallet (status) conditions.
 */
const WalletStatus = Object.freeze({
	LOADING: Symbol('loading'),
	READY: Symbol('ready'),
})


/**
 * Wallet Class
 *
 * A complete Wallet solution for managing a wide variety of
 * digital assets types.
 */
export class Wallet extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Wallet class. */
        debug('Initializing Wallet...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        /* Initialize internals. */
        this._addressIdx = 0
        this._wallet = {}

        /* Handle hex (strings) and bytes. */
        if (_primary?.length === 32 || _primary?.length === 64) {
            /* Set entropy. */
            const entropy = _primary
            console.log('FOUND HEX OR BYTE ENTROPY', entropy)

            this._wallet = {
                entropy: _primary,
                path: DEFAULT_DERIVATION_PATH,
            }
        } else if (typeof _primary === 'string') {
            const words = _primary.split(' ')

            /* Handle mnemonic (seed) phrase. */
            if (words.length === 12 || words.length === 24) {
                console.log('FOUND A MNEMONIC SEED PHRASE', words)

                this._wallet = {
                    mnemonic: _primary,
                    path: DEFAULT_DERIVATION_PATH,
                }
            }
        } else if (_primary?.path.includes('m/')) {
            console.log('FOUND DERIVATION PATH', _primary.path)

            this._wallet = {
                entropy: _primary.entropy,
                mnemonic: _primary.mnemonic,
                path: _primary.path,
            }
        } else {
            console.log('CREATING NEW (RANDOM) WALLET')

            const entropy = randomBytes(16)
            console.log('ENTROPY', entropy)

            const mnemonic = entropyToMnemonic(entropy)
            console.log('MNEMONIC', mnemonic)

            this._wallet = {
                entropy,
                mnemonic,
                path: DEFAULT_DERIVATION_PATH,
            }
        }
    }

    test() {
        return 'Wallet (Instance) is working!'
    }

    get status() {
        return WalletStatus.READY
    }

    get isReady() {
        return true
    }

    get address() {
        return 'nexa:SampleAddress'
    }

    get mnemonic() {
        return this._wallet.mnemonic
    }

    getAddress(_addressIdx = 0, _isChange = false) {
        return 'nexa:AnotherSampleAddress' + _index
    }

    getNewAddress(_isChange = false) {
        return 'nexa:YetAnotherSampleAddress'
    }

    toObject() {
        return this._wallet
    }

    toString() {
        return this.mnemonic
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Wallet class. */
Nexa.Wallet = Wallet

/* Initialize Wallet modules. */
Nexa.getDerivationPath = getDerivationPath

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
