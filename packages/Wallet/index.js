/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:wallet')

/* Import modules. */
import { EventEmitter } from 'events'

/* Import (library) modules. */
import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

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

import {
    getCoins,
    sendCoin,
} from '@nexajs/purse'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    getTokens,
    sendToken,
} from '@nexajs/token'

/* Libauth helpers. */
import {
    deriveHdPath,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import (local) modules. */
import _getDerivationPath from './src/getDerivationPath.js'
import _parseDerivationPath from './src/parseDerivationPath.js'

/* Export (local) modules. */
export const getDerivationPath = _getDerivationPath
export const parseDerivationPath = _parseDerivationPath

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

        /* Currently active asset id. */
        this._assetid = null

        /* Directory of (owned) asset details (metadata). */
        this._assets = null

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

        return (async function () {
            /* Create new instance. */
            const wallet = new Wallet(_primary, _secondary)

            // NOTE: We pause 1/2 second (~100ms probably works too) to allow
            //       the wallet time to complete its setup.
            // FIXME Reduce setup by properly detecting wallet setup completion.
            await _sleep(500)

            /* Request an update for asset data. */
            await wallet.update()

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
        if (this.assetid === null) {
            /* Return Nexa (static) details. */
            return {
                group: '0',
                name: `Nexa`,
                ticker: 'NEXA',
                iconUrl: 'https://bafkreigyp7nduweqhoszakklsmw6tbafrnti2yr447i6ary5mrwjel7cju.nexa.garden', // nexa.svg
                token_id_hex: '0x',
                decimal_places: 2,
                document_hash: null,
                document_url: null,
            }
        }

        /* Validate asset details (in directory). */
        if (this.assets && this.assets[this.assetid]) {
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
        /* Validate entropy. */
        if (!this._entropy) {
            return WalletStatus.LOADING
        }

        /* Validate entropy. */
        if (typeof this._entropy !== 'string') {
            return WalletStatus.LOADING
        }

        /* Validate entropy. */
        if (this._entropy.length !== 32 && this._entropy.length !== 64) {
            return WalletStatus.LOADING
        }

        /* Wallet is ready. */
        return WalletStatus.READY
    }

    get isLoading() {
        return this.isReady === WalletStatus.LOADING
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
        return {
            isReady: this.isReady,
        }
    }

    get tokens() {
        return this._tokens
    }

    get wif() {
        if (!this.privateKey) return null

        return encodePrivateKeyWif({ hash: sha256 }, this.privateKey, 'mainnet')
    }

    /**
     * Get Address
     *
     * Retrieve any address contained in the BIP-32 wallet.
     */
    getAddress(_addressIdx = '0', _isChange) {
        /* Validate mnemonic. */
        if (!this.mnemonic) {
            return null
        }

        /* Initialize locals. */
        let address
        let changeIdx
        let child
        let node
        let privateKey
        let publicKey
        let publicKeyHash
        let scriptPubKey
        let scriptPushPubKey
        let seed

        /* Set change index. */
        changeIdx = _isChange ? '1' : '0'

        /* Set seed. */
        seed = hexToBin(mnemonicToSeed(this.mnemonic))

        /* Initialize HD node. */
        node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)

        /* Derive a child from the Master node */
        child = deriveHdPath(
            crypto,
            node,
            `m/${this._coinPurpose}/${this._coinType}/${this._accountIdx}/${changeIdx}/${_addressIdx}`
        )

        /* Set private key. */
        privateKey = child.privateKey

        /* Derive the corresponding public key. */
        publicKey = secp256k1.derivePublicKeyCompressed(privateKey)

        /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
        scriptPushPubKey = encodeDataPush(publicKey)

        /* Generate public key hash. */
        publicKeyHash = ripemd160.hash(sha256(scriptPushPubKey))

        /* Generate public key hash script. */
        scriptPubKey = new Uint8Array([
            OP.ZERO,
            OP.ONE,
            ...encodeDataPush(publicKeyHash),
        ])

        /* Encode the public key hash into a P2PKH nexa address. */
        address = encodeAddress(
            'nexa',
            'TEMPLATE',
            scriptPubKey,
        )

        /* Return address. */
        return address
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
     * Get Balances
     *
     * Retrieve balances for ALL wallet assets, ie.
     *   - coins / satoshis
     *   - all tokens
     *
     * (Optionally) convert all asset values to fiat.
     */
    getBalances(_fiat) {
        let fiat
        let satoshis
        let tokens
        let usd

        satoshis = 133700

        tokens = {
            tokenid1: {
                amount: '333',
                fiat: {
                    usd: 0.00,
                }
            },
            tokenid2: {
                amount: '88888888',
                fiat: {
                    usd: 0.00,
                }
            },
        }

        if (_fiat) {
            fiat = {
                usd: 13.37,
            }
        }

        return {
            satoshis,
            tokens,
            fiat,
        }
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
        /* Initialize locals. */
        let address
        let coins
        let error
        let locking
        let lockTime
        let nullData
        let receiver
        let receivers
        let response
        let satoshis
        let sequence
        let suggestions
        let tokenAmount
        let tokens
        let txidem
        let txResult
        let unlocking
        let unspentCoins
        let unspentTokens

        /* Validate amount. */
        if (typeof _amount === 'bigint') {
            /* Set token amount. */
            tokenAmount = _amount

            // console.log('TOKENID', _tokenid)
            // console.log('TOKENS', this.tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            tokens = this.tokens.filter(_token => {
                return _token.tokenidHex === _tokenid
            })
            // console.log('TOKENS (filtered)', tokens)

            /* Calculate the total balance of the unspent outputs. */
            unspentTokens = tokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            // console.log('UNSPENT TOKENS', unspentTokens)

            /* Add primary (asset) receiver. */
            receivers = [
                {
                    address: _receiver,
                    tokenid: _tokenid, // TODO Allow auto-format conversion.
                    tokens: tokenAmount,
                },
            ]

            /* Handle (automatic) TOKEN change. */
            if (unspentTokens - tokenAmount > BigInt(0)) {
                receivers.push({
                    address: this.address,
                    tokenid: _tokenid, // TODO Allow auto-format conversion.
                    tokens: (unspentTokens - tokenAmount),
                })
            }

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: this.address,
            })
            // console.log('RECEIVERS', receivers)

            /* Send UTXO request. */
            response = await sendToken(this.coins, tokens, receivers)
            // console.log('Send UTXO (response):', response)
        } else if (typeof _receiver === 'bigint') {
            /* Set receiver. */
            receiver = _tokenid

            /* Set satoshis. */
            satoshis = _receiver

            const receivers = [
                {
                    address: receiver,
                    satoshis,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: this.address,
            })
            // console.log('RECEIVERS', receivers)

            /* Send UTXO request. */
            response = await sendCoin(this.coins, receivers)
            // console.log('Send UTXO (response):', response)
        } else if (
            (_tokenid.coins || _tokenid.tokens) &&
            _tokenid.receivers.length > 0
        ) {
            /* Initialize transaction (object) builder. */
            const txBuild = {}

            /* Set coins. */
            txBuild.coins = _tokenid.coins

            /* Set tokens. */
            txBuild.tokens = _tokenid.tokens

            /* Set receivers. */
            txBuild.receivers = _tokenid.receivers

            /* Set lockTime. */
            txBuild.lockTime = _tokenid.lockTime

            /* Set sequence. */
            txBuild.sequence = _tokenid.sequence

            /* Set locking. */
            txBuild.locking = _tokenid.locking

            /* Set unlocking. */
            txBuild.unlocking = _tokenid.unlocking

            // TODO Add validation for each (object) parameter.

            /* Validate tokens. */
            if (txBuild.tokens) {
                /* Send CUSTOM token(s). */
                response = await sendToken(txBuild)
            } else {
                /* Send CUSTOM coin(s). */
                response = await sendCoin(txBuild)
            }
        } else {
            throw new Error('Oops! Your transaction parameters are invalid.')
        }

        /* Handle transaction result. */
        try {
            txResult = JSON.parse(response)
            // console.log('TX RESULT', txResult)

            /* Validate result (txidem). */
            if (txResult.result) {
                console.log(txResult.result)

                /* Set transaction idem. */
                txidem = txResult.result

                /* Set error. */
                error = null
            }

            /* Validate error. */
            if (txResult.error?.message) {
                // console.error(txResult.error.message)
                /* Set transaction idem. */
                txidem = null

                /* Initialize suggestions. */
                suggestions = []

                // FIXME FOR DEV PURPOSES ONLY
                suggestions.push('Sorry, no advice.')

                /* Set error. */
                error = {
                    ...txResult.error,
                    suggestions,
                }
            }
        } catch (err) {
            console.error(err)
        }

        return {
            txidem,
            error,
        }
    }

    /**
     * Update (Coins & Tokens)
     *
     * Will retrieve real-time asset info and save the details locally.
     */
    async update(_subscribe = false, _fiat = 'USD') {
        /* Initialize locals. */
        let unspent

        /* Subscribe to (receiving) addresses. */
        if (_subscribe === true) {
            /* Subscribe to address. */
            await subscribeAddress(this.address, async () => {
                await this.update()

                // emit to subscribers
                this.emit('onUpdate', {
                    balances: this.getBalances(_fiat),
                    coins: this._coins,
                    tokens: this._tokens,
                })
            })
        }

        // Fetch all unspent transaction outputs for the temporary in-browser wallet.
        unspent = await listUnspent(this.address)
            .catch(err => console.error(err))
        // console.log('\nUNSPENT', unspent)

        /* Validate unspent outputs. */
        if (unspent.length === 0) {
            return console.error('There are NO unspent outputs available.')
        }

        /* Retrieve coins. */
        this._coins = unspent
            .filter(_u => _u.hasToken === false)
            .map(_unspent => {
                const outpoint = _unspent.outpoint
                const satoshis = _unspent.satoshis

                return {
                    outpoint,
                    satoshis,
                    wif: this.wif,
                }
            })
        // console.log('\nCOINS', this.coins)

        /* Retrieve tokens. */
        this._tokens = unspent
            .filter(_u => _u.hasToken === true)
            .map(_unspent => {
                const outpoint = _unspent.outpoint
                const satoshis = _unspent.satoshis
                const tokenid = _unspent.tokenid
                const tokenidHex = _unspent.tokenidHex
                const tokens = _unspent.tokens

                return {
                    outpoint,
                    satoshis,
                    tokenid,
                    tokenidHex,
                    tokens,
                    wif: this.wif,
                }
            })
        // console.log('\nTOKENS', this.tokens)

        /* Completed successfully. */
        return true
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

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
