/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { entropyToMnemonic } from '@nexajs/hdnode'
import { randomBytes } from '@nexajs/crypto'

/* Import (library) modules. */
import { encodeAddress } from '@nexajs/address'
import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    mnemonicToSeed
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

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()
const sha512 = await instantiateSha512()


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

                /* Calculate seed. */
                const seed = hexToBin(mnemonicToSeed(_primary))
                // console.log('SEED', seed)

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


        /* Set mnemonic. */
        // const mnemonic = _params.mnemonic
        // console.log('\nMNEMONIC', mnemonic)

        /* Set receiving address. */
        // const receiver = _params.receiver
        // console.log('\nRECEIVER', receiver)


        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)
        // console.log('\n  HD Node:', node)

        /* Derive a child from the Master node */
        const child = deriveHdPath({ ripemd160, sha256, sha512, secp256k1 }, node, `m/44'/29223'/0'/0/0`)
        // console.log('CHILD', child)

        const privateKey = child.privateKey
        // console.log('PRIVATE KEY (hex)', binToHex(privateKey))

        /* Derive the corresponding public key. */
        const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
        // console.log('PUBLIC KEY', publicKey)
        // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

        /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
        const scriptPushPubKey = encodeDataPush(publicKey)
        // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

        const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
        // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

        const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
        // console.info('  Public key hash Script:', binToHex(pkhScript))

        /* Encode the public key hash into a P2PKH nexa address. */
        const nexaAddress = encodeAddress(
            'nexa', 'TEMPLATE', pkhScript)
        console.info('\n  Nexa address:', nexaAddress)

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
