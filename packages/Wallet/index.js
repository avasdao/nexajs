/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (library) modules. */
import { encodeAddress } from '@nexajs/address'

import {
    randomBytes,
    sha256,
    sha512,
} from '@nexajs/crypto'

import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    entropyToMnemonic,
    mnemonicToSeed,
} from '@nexajs/hdnode'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    deriveHdPath,
    encodeDataPush,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _getDerivationPath from './src/getDerivationPath.js'
import _parseDerivationPath from './src/parseDerivationPath.js'

/* Export (local) modules. */
export const getDerivationPath = _getDerivationPath

/* Initialize Libauth crypto interfaces. */
let ripemd160
let secp256k1
let crypto

/* Instantiate Libauth crypto interfaces. */
;(async () => {
    ripemd160 = await instantiateRipemd160()
    secp256k1 = await instantiateSecp256k1()

    /* Initialize crypto. */
    crypto = {
        ripemd160,
        sha256: { hash: sha256 },
        sha512: { hash: sha512 },
        secp256k1,
    }
})()


/* Set (derivation) constants. */
// Example: m/44'/29223'/0'/0/0
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
const DEFAULT_PURPOSE = `44'`
const DEFAULT_COIN_TYPE = `29223'` // (0x7227) Nexa (https://spec.nexa.org)
const DEFAULT_ACCOUNT_IDX = `0'`
const DEFAULT_CHANGE = '0'
const DEFAULT_ADDRESS_IDX = '0'


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
        this._entropy = null
        this._mnemonic = null
        this._network = null
        this._provider = null
        this._isTestnet = null
        this._hrp = null // prefix eg. bitcoincash: or nexa:

        /* Initialize derivation path defaults. */
        this._coinPurpose = DEFAULT_PURPOSE
        this._coinType = DEFAULT_COIN_TYPE
        this._accountIdx = DEFAULT_ACCOUNT_IDX
        this._addressIdx = DEFAULT_ADDRESS_IDX

        /* Initialize derivation path. */
        this._path = `m/${this._coinPurpose}'/${this._coinType}'/${this._accountIdx}'/${DEFAULT_CHANGE}/${this._addressIdx}`

        /* Initialize cryptography holders. */
        this._privateKey = null
        this._publicKey = null
        this._publicKeyHash = null
        this._xpriv = null
        this._xpub = null
        this._wif = null

        /* Initialize UTXO holders. */
        this._coins = []
        this._tokens = []

        /* Initialize metadata. */
        this._title = null
        this._description = null

        // this._wallet = {} // DEPRECATED

        /* Handle hex (strings) and bytes. */
        if (Array.isArray(_primary) && _primary?.length === 32) {
            /* Set private key. */
            this._privateKey = _primary
        } else if (typeof _primary === 'string' && (_primary?.length === 32 || _primary?.length === 64)) {
            this._entropy = _primary
            this._mnemonic = entropyToMnemonic(this._entropy)
        } else if (typeof _primary === 'string') {
            const words = _primary.split(' ')

            /* Handle mnemonic (seed) phrase. */
            if (words.length === 12 || words.length === 24) {
                // console.log('FOUND A MNEMONIC SEED PHRASE', words)

                this._mnemonic = _primary
                // this._path = DEFAULT_DERIVATION_PATH
            }
        } else if (_primary?.path.includes('m/') && _primary?.mnemonic) {
            /* Set mnemonic. */
            // TODO Add support for user-defined entropy.
            this._mnemonic = _primary.mnemonic

            /* Parse base/full path. */
            let [
                purpose,
                coinType,
                accountIdx,
                change,
                addressIdx,
            ] = _parseDerivationPath(_primary.path)

            /* Validate (BIP-44) schema. */
            if (purpose && coinType && accountIdx && change && addressIdx) {
                /* Set (derivation) path. */
                this._path = _primary.path

                /* Set (derivation) parts. */
                this._coinPurpose = purpose
                this._coinType = coinType
                this._accountIdx = accountIdx
                this._addressIdx = addressIdx
            }
        } else {
            /* Generate entropy. */
            this._entropy = randomBytes(16)

            /* Derive mnemonic. */
            // NOTE: This is a 12-word seed phrase.
            this._mnemonic = entropyToMnemonic(binToHex(this._entropy))
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

    get path() {
        return this._path
    }

    get privateKey() {
        /* Validate private key. */
        if (this._privateKey) {
            return this._privateKey
        }

        /* Validate mnemonic. */
        if (!this._mnemonic) {
            return null
        }

        /* Set seed. */
        const seed = hexToBin(mnemonicToSeed(this._mnemonic))

        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)

        /* Derive a child from the Master node */
        const child = deriveHdPath(
            crypto,
            node,
            this._path
        )

        /* Return (child) private key. */
        return child.privateKey
    }

    get publicKey() {
        /* Validate private key. */
        if (!this.privateKey) {
            return null
        }

        /* Return public key. */
        return secp256k1.derivePublicKeyCompressed(this.privateKey)
    }

    getAddress(_addressIdx = '0', _isChange) {
        /* Validate mnemonic. */
        if (!this._mnemonic) {
            return null
        }

        /* Set change index. */
        const changeIdx = _isChange ? '1' : '0'

        /* Set seed. */
        const seed = hexToBin(mnemonicToSeed(this._mnemonic))

        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)

        /* Derive a child from the Master node */
        const child = deriveHdPath(
            crypto,
            node,
            `m/${this._coinPurpose}/${this._coinType}/${this._accountIdx}/${changeIdx}/${_addressIdx}`
        )

        /* Set private key. */
        const privateKey = child.privateKey

        /* Derive the corresponding public key. */
        const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)

        /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
        const scriptPushPubKey = encodeDataPush(publicKey)

        /* Generate public key hash. */
        const publicKeyHash = ripemd160.hash(sha256(scriptPushPubKey))

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

    getBalances(_hasFiat) {
        let satoshis
        let tokens
        let usd

        satoshis = 133700

        tokens = {
            tokenid1: '333',
            tokenid2: '88888888',
        }

        if (_hasFiat) {
            usd = 13.37
        }

        return {
            satoshis,
            tokens,
            usd,
        }
    }

    setPathAccount(_index) {
        /* Set account index. */
        this._accountIdx = parseInt(_index)
    }

    setPathAddress(_index) {
        /* Set address index. */
        this._addressIdx = parseInt(_index)
    }

    async update(_subscribe = false, _hasFiat = false) {
        console.info('Wallet address:', this.address)

        /* Initialize locals. */
        let unspent
        let wif

        /* Subscribe to (receiving) addresses. */
        if (_subscribe === true) {
            /* Subscribe to address. */
            await subscribeAddress(this.address, async () => {
                await this.update()

                // emit to subscribers
                this.emit('onUpdate', {
                    balances: this.getBalances(_hasFiat),
                    coins: this._coins,
                    tokens: this._tokens,
                })
            })
        }

        /* Encode Private Key WIF. */
        wif = encodePrivateKeyWif({ hash: sha256 }, this.privateKey, 'mainnet')

        // Fetch all unspent transaction outputs for the temporary in-browser wallet.
        unspent = await listUnspent(this.address)
            .catch(err => console.error(err))
        console.log('UNSPENT', unspent)

        const mempool = await getAddressMempool(this.address)
            .catch(err => console.error(err))
        console.log('MEMPOOL', mempool)

        /* Validate unspent outputs. */
        if (unspent.length === 0) {
            return console.error('There are NO unspent outputs available.')
        }

        /* Retrieve coins. */
        this._coins = unspent
            .filter(_u => _u.isToken === false)
            .filter(_u => this._spentCoins.includes(_u.outpoint) === false)
            .map(_unspent => {
                const outpoint = _unspent.outpoint
                const satoshis = _unspent.satoshis

                return {
                    outpoint,
                    satoshis,
                    wif: this._wif,
                }
            })
        console.log('\n  Coins:', this.coins)

        /* Retrieve tokens. */
        this._tokens = unspent
            .filter(_u => _u.isToken === true)
            .filter(_u => this._spentCoins.includes(_u.outpoint) === false)
            .map(_unspent => {
                const outpoint = _unspent.outpoint
                const satoshis = _unspent.satoshis
                const tokenid = _unspent.tokenid
                const tokens = _unspent.tokens

                return {
                    outpoint,
                    satoshis,
                    tokenid,
                    tokens,
                    wif: this._wif,
                }
            })
        console.log('\n  Tokens:', this.tokens)
    }

    toObject() {
        /* Return primary details. */
        return {
            entropy: this._entropy,
            mnemonic: this._mnemonic,
            path: this._path,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            address: this.address,
            change: this.change,
        }
    }

    toString() {
        /* Return mnemonic. */
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
