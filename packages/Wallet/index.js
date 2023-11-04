/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (library) modules. */
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
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    deriveHdPath,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _getAddress from './src/getAddress.js'
import _getDerivationPath from './src/getDerivationPath.js'
import _parseDerivationPath from './src/parseDerivationPath.js'
import _send from './src/send.js'
import _updateAssets from './src/updateAssets.js'
import _updateBalances from './src/updateBalances.js'

/**
 * Wallet Status
 *
 * Enumeration of all possible wallet (status) conditions.
 */
const _WalletStatus = Object.freeze({
	FAILED   : Symbol('failed'),
	LOADING  : Symbol('loading'),
	READY    : Symbol('ready'),
	UNKNOWN  : Symbol('unknown'),
	UPDATING : Symbol('updating'),
})

/* Export (local) modules. */
export const getDerivationPath = _getDerivationPath
export const parseDerivationPath = _parseDerivationPath
export const WalletStatus = _WalletStatus

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
 * Wallet Class
 *
 * A complete Wallet solution for managing a wide variety of
 * digital assets types.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Coin Model
 *
 * Coins are (UTXO) objects containing:
 *   1. Outpoint
 *   2. Satoshis
 *   3. WIF
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Token Model
 *
 * Tokens are (UTXO) objects containing:
 *   1. Outpoint
 *   2. Satoshis
 *   3. Token ID
 *   4. Token ID (Hex)
 *   5. Tokens
 *   6. WIF
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * UTXO Status Codes
 *
 * Individual UTXOs may sometimes possess "meta" qualities.
 *
 *   active   : Session address is ready to receive OR spend funds.
 *   disabled : Already received and spent funds (MUST be empty).
 *   locked   : Session address is reserved OR has received funds currently
 *              being held in reserve for a later use.
 *              (eg. CashShuffle, CashFusion, ANYONECANPAY, etc)
 *
 * NOTE: Reserved paths are used to "freeze" coins, for use with
 *       "registered" contracts.
 */
export class Wallet extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Wallet class. */
        debug('Initializing Wallet...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        /* Initialize internals. */
        this._status = WalletStatus.UNKNOWN
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
        this._path = `m/${this._coinPurpose}/${this._coinType}/${this._accountIdx}/${DEFAULT_CHANGE}/${this._addressIdx}`

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

        /* Holds the (currently) active asset id. */
        this._assetid = null

        /* Holds a directory of (owned) asset details (metadata). */
        this._assets = null

        /* Holds real-time (market) data. */
        this._markets = null

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

        /* Validate network. */
        if (_primary?.network) {
            this._network = _primary.network
        }

        /* Validate testnet (flag). */
        if (_primary?.isTestnet) {
            this._isTestnet = _primary.isTestnet
        }

        // TODO Handle ALL parameters.
    }

    /**
     * Initialization
     *
     * Create a new Wallet instance (passing optional primary & secondary
     * parameters).
     */
    static init(_primary, _secondary) {
        const _sleep = (_ms) => {
            return new Promise(resolve => setTimeout(resolve, _ms))
        }

        /* Initialize locals. */
        let fiat
        let maxTries = 0
        let response

        /* Validate fiat conversions. */
        // NOTE: Any Boolean parameters will (default) as a `fiat` flag.
        if (_primary?.fiat) {
            fiat = _primary.fiat
        } else if (_primary === null) {
            fiat = null
        } else if (_primary === false) {
            fiat = null

            /* Overwrite to null. */
            _primary = null
        } else if (_secondary === null) {
            fiat = null
        } else if (_secondary === false) {
            fiat = null

            /* Overwrite to null. */
            _secondary = null
        } else {
            fiat = 'USD'
        }

        return (async function () {
            /* Create new instance. */
            const wallet = new Wallet(_primary, _secondary)

            /* Set (status) flag. */
            wallet._status = WalletStatus.LOADING

            // NOTE: We pause 1/2 second (~100ms probably works too) to allow
            //       the wallet time to complete its setup.
            // FIXME Reduce setup by properly detecting wallet setup completion.
            // await _sleep(500)

            /* Request an update for asset data. */
            // TODO Support "user-defined" updates.
            wallet.updateAssets(true, fiat)
                .catch(err => console.error(err))
            // await wallet.updateAssets(true, _secondary)

            /* Wait for assets to update. */
            wallet.on('assets', (_assets) => {
                // console.log('RECV MSG (assets update):', _assets)

                /* Update balances. */
                // NOTE: Depends on `updateAssets`.
                wallet.updateBalances(fiat)
                    .catch(err => console.error(err))
            })

            /* Re-try for up to 30 seconds. */
            while (wallet.address === null && maxTries < 300) {
                maxTries++
                await _sleep(100)
            }

            if (wallet.address !== null) {
                /* Set (status) flag. */
                wallet._status = WalletStatus.READY
            } else {
                /* Set (status) flag. */
                wallet._status = WalletStatus.FAILED
            }

            /* Return (initialized) instance. */
            return wallet
        })()
    }

    /* Return a short address. */
    get abbr() {
        if (!this.address) return null

        return this.address.slice(5, 17) + '...' + this.address.slice(-12)
    }

    get accountIdx() {
        /* Return current (receiving) address (index). */
        return this._accountIdx
    }

    get address() {
        /* Return current (receiving) address. */
        return this.getAddress(this._addressIdx, false)
    }

    get addressIdx() {
        /* Return current (receiving) address (index). */
        return this._addressIdx
    }

    get asset() {
        /* Validate assets. */
        if (!this.assets || this.assetid === null) {
            return null
        }

        /* Validate asset details. */
        if (this.assets[this.assetid]) {
            /* Return asset details. */
            return this.assets[this.assetid]
        }

        /* Return null. */
        return null
    }

    get assetid() {
        return this._assetid
    }

    get assets() {
        return this._assets
    }

    get change() {
        /* Return current (change) address. */
        return this.getAddress(this._addressIdx, true)
    }

    get coins() {
        return this._coins
    }

    get entropy() {
        return this._entropy
    }

    /**
     * Is Ready?
     *
     * Flag to indicate when the wallet is ready for use.
     */
    get isReady() {
        return this.status === WalletStatus.READY
    }

    get isLoading() {
        return this.status === WalletStatus.LOADING
    }

    get markets() {
        return this._markets
    }

    get mnemonic() {
        if (this._mnemonic) {
            return this._mnemonic
        }

        if (this._entropy) {
            return entropyToMnemonic(this._entropy)
        }

        return null
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
        if (!this.mnemonic) {
            return null
        }

        /* Set seed. */
        const seed = hexToBin(mnemonicToSeed(this.mnemonic))

        // TODO Where can we retrieve the xPriv and xPub??

        /* Initialize HD node. */
        const node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 }}, seed)

        /* Derive a child from the Master node */
        const child = deriveHdPath(
            crypto,
            node,
            this.path,
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

    get status() {
        return this._status
    }

    get tokens() {
        return this._tokens
    }

    get wif() {
        if (!this.privateKey) return null

        return encodePrivateKeyWif({ hash: sha256 }, this.privateKey, 'mainnet')
    }

    getAddress(_addressIdx, _isChange) {
        return _getAddress.bind(this)(_addressIdx, _isChange)
    }

    getNewAddress(_isChange = false) {
        /* Set the next address index. */
        const nextIdx = this.addressIdx + 1

        /* Set new (address) index to path. */
        this.setPathAddress(nextIdx)

        /* Return (incremented) address. */
        return this.address
    }

    /**
     * Get Balance
     *
     * Requests the real-time balance of ANY asset held in the wallet.
     *
     * (Optionally) provide a token id (for a specific asset balance).
     *
     * (Optionally) provide a fiat code, eg. 'CNY'.
     *
     * NOTE: If no token id is required, the 1st parameter can be a fiat code.
     */
    getBalance(_tokenid, _fiat) {
        // TODO Complete request queries and data responses.

        // NOTE: This is the (default) balance response.
        return this.assets[_tokenid]?.coins.satoshis
    }

    /* Set the (active) asset displayed on the UI. */
    setAsset(_assetid) {
        this._assetid = _assetid
    }

    setPathAccount(_index) {
        /* Set account index. */
        this._accountIdx = parseInt(_index).toString()
    }

    setPathAddress(_index) {
        /* Set address index. */
        this._addressIdx = parseInt(_index).toString()
    }

    async send(_tokenid, _receiver, _amount) {
        return _send.bind(this)(_tokenid, _receiver, _amount)
    }

    async updateAssets(_subscribe, _fiat) {
        return _updateAssets.bind(this)(_subscribe, _fiat)
    }

    async updateBalances(_fiat) {
        return _updateBalances.bind(this)(_fiat)
    }

    toObject() {
        /* Return primary details. */
        return {
            accountIdx: this.accountIdx,
            address: this.address,
            addressIdx: this.addressIdx,
            change: this.change,
            entropy: this.entropy,
            mnemonic: this.mnemonic,
            path: this.path,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
        }
    }

    toString() {
        /* Return mnemonic. */
        return this.mnemonic
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Wallet class. */
Nexa.Wallet = Wallet

/* Initialize Wallet modules. */
Nexa.getDerivationPath = getDerivationPath
Nexa.parseDerivationPath = parseDerivationPath
Nexa.WalletStatus = WalletStatus

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
