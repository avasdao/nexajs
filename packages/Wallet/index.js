/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (library) modules. */
import { encodeAddress } from '@nexajs/address'
import { randomBytes } from '@nexajs/crypto'
import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    entropyToMnemonic,
    mnemonicToSeed,
} from '@nexajs/hdnode'

/* Libauth helpers. */
import {
    binToHex,
    deriveHdPath,
    encodeDataPush,
    hexToBin,
    instantiateSha256,
    instantiateSha512,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _getDerivationPath from './src/getDerivationPath.js'

/* Export (local) modules. */
export const getDerivationPath = _getDerivationPath

/* Initialize Libauth crypto interfaces. */
let ripemd160
let secp256k1
let sha256
let sha512
let crypto

/* Instantiate Libauth crypto interfaces. */
;(async () => {
    ripemd160 = await instantiateRipemd160()
    secp256k1 = await instantiateSecp256k1()
    sha256 = await instantiateSha256()
    sha512 = await instantiateSha512()
    crypto = { ripemd160, sha256, sha512, secp256k1 }
})()

/* Set constants. */
const DEFAULT_DERIVATION_PATH = `m/44'/29223'/0'`


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
        this._entropy = null
        this._mnemonic = null
        this._path = null

        this._privateKey = null
        this._publicKey = null

        this._wallet = {} // DEPRECATED

        /* Handle hex (strings) and bytes. */
        if (_primary?.length === 32 || _primary?.length === 64) {
            /* Set entropy. */
            const entropy = _primary
            // console.log('FOUND HEX OR BYTE ENTROPY', entropy)

            this._entropy = _primary
            this._mnemonic = entropyToMnemonic(this._entropy)
            this._path = DEFAULT_DERIVATION_PATH
        } else if (typeof _primary === 'string') {
            const words = _primary.split(' ')

            /* Handle mnemonic (seed) phrase. */
            if (words.length === 12 || words.length === 24) {
                // console.log('FOUND A MNEMONIC SEED PHRASE', words)

                this._mnemonic = _primary
                this._path = DEFAULT_DERIVATION_PATH
            }
        } else if (_primary?.path.includes('m/') && _primary?.mnemonic) {
            // console.log('FOUND DERIVATION PATH', _primary.path)

            // TODO Add support for user-defined entropy.
            this._mnemonic = _primary.mnemonic
            this._path = _primary.path
        } else {
            // console.log('CREATING NEW (RANDOM) WALLET')

            /* Generate entropy. */
            this._entropy = randomBytes(16)
            // console.log('ENTROPY', this._entropy)

            /* Derive mnemonic. */
            this._mnemonic = entropyToMnemonic(entropy)
            // console.log('MNEMONIC', this._mnemonic)

            /* Set (derivation) path. */
            this._path = DEFAULT_DERIVATION_PATH
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
        /* Return current (receiving) address. */
        return this.getAddress(this._addressIdx, false)
    }

    get change() {
        /* Return current (change) address. */
        return this.getAddress(this._addressIdx, true)
    }

    get mnemonic() {
        return this._mnemonic
    }

    get privateKey() {
        /* Validate mnemonic. */
        if (!this._mnemonic) {
            return null
        }

        /* Set seed. */
        const seed = hexToBin(mnemonicToSeed(this._mnemonic))

        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)

        /* Derive a child from the Master node */
        const child = deriveHdPath(
            crypto,
            node,
            `m/44'/29223'/0'/0/${this._addressIdx}`
        )

        /* Return (child) private key. */
        return child.privateKey
    }

    get publicKey() {
        /* Validate private key. */
        if (!this._privateKey) {
            return null
        }

        /* Return public key. */
        return secp256k1.derivePublicKeyCompressed(this._privateKey)
    }

    getAddress(_addressIdx = 0, _isChange = false) {
        /* Validate mnemonic. */
        if (!this._mnemonic) {
            return null
        }

        /* Set change index. */
        const changeIdx = _isChange ? 1 : 0

        /* Set seed. */
        const seed = hexToBin(mnemonicToSeed(this._mnemonic))

        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)

        /* Derive a child from the Master node */
        const child = deriveHdPath(
            crypto,
            node, `m/44'/29223'/0'/${changeIdx}/${_addressIdx}`
        )

        /* Set private key. */
        const privateKey = child.privateKey

        /* Derive the corresponding public key. */
        const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)

        /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
        const scriptPushPubKey = encodeDataPush(publicKey)

        /* Generate public key hash. */
        const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))

        /* Generate public key hash script. */
        const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))

        /* Encode the public key hash into a P2PKH nexa address. */
        const nexaAddress = encodeAddress(
            'nexa',
            'TEMPLATE',
            pkhScript,
        )

        /* Return address. */
        return nexaAddress
    }

    getNewAddress(_isChange = false) {
        return 'nexa:YetAnotherSampleAddress'
    }

    toObject() {
        return {
            entropy: this._entropy,
            mnemonic: this._mnemonic,
            path: this._path,
        }
    }

    toString() {
        return this._mnemonic
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
