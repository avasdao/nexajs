/* Import modules. */
import { entropyToMnemonic } from '@nexajs/hdnode'
import { randomBytes } from '@nexajs/utils'

/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:crypto')

const DEFAULT_DERIVATION_PATH = `m/44'/29223'/0'`

/* Import (local) modules. */
// TBD

/* Export (local) modules. */
// TBD

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
 * Manages wallet functions.
 */
export class Wallet extends EventEmitter {
    constructor(_params) {
        /* Initialize Wallet class. */
        debug('Initializing Wallet...')
        debug(JSON.stringify(_params, null, 2))
        super()

        /* Initialize internals. */
        this._wallet = {}

        /* Handle hex (strings) and bytes. */
        if (_params?.length === 32 || _params?.length === 64) {
            /* Set entropy. */
            const entropy = _params
            console.log('FOUND HEX OR BYTE ENTROPY', entropy)

            this._wallet = {
                entropy: _params,
                path: DEFAULT_DERIVATION_PATH,
            }
        } else if (typeof _params === 'string') {
            const words = _params.split(' ')

            /* Handle mnemonic (seed) phrase. */
            if (words.length === 12 || words.length === 24) {
                console.log('FOUND A MNEMONIC SEED PHRASE', words)

                this._wallet = {
                    mnemonic: _params,
                    path: DEFAULT_DERIVATION_PATH,
                }
            }
        } else if (_params?.path.includes('m/')) {
            console.log('FOUND DERIVATION PATH', _params.path)

            this._wallet = {
                entropy: _params.entropy,
                mnemonic: _params.mnemonic,
                path: _params.path,
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
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
