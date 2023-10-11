/* Import modules. */
import { defineStore } from 'pinia'

import { listUnspent } from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    entropyToMnemonic,
    mnemonicToEntropy,
} from '@nexajs/hdnode'

import {
    getTokenInfo,
    subscribeAddress,
} from '@nexajs/rostrum'

import { Wallet } from '@nexajs/wallet'

/* Libauth helpers. */
import {
    instantiateRipemd160,
    instantiateSecp256k1,
} from '@bitauth/libauth'

import _broadcast from './wallet/broadcast.ts'
import _setEntropy from './wallet/setEntropy.ts'

let ripemd160
let secp256k1

;(async () => {
    /* Instantiate Libauth crypto interfaces. */
    ripemd160 = await instantiateRipemd160()
    secp256k1 = await instantiateSecp256k1()
})()

/**
 * Wallet Store
 */
export const useWalletStore = defineStore('wallet', {
    state: () => ({
        /**
         * Entropy
         *
         * Initialize entropy (used for HD wallet).
         *
         * NOTE: This is a cryptographically-secure "random"
         * 32-byte (256-bit) value.
         */
        _entropy: null,

        /**
         * Keychain
         *
         * Manages a collection of BIP-32 wallets.
         *
         * [
         *   {
         *     id        : '5be2e5c3-9d27-4b0f-bb3c-8b2ef6fdaafd',
         *     type      : 'studio',
         *     title     : `My Studio Wallet`,
         *     entropy   : 0x0000000000000000000000000000000000000000000000000000000000000000,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         *   {
         *     id        : 'f2457985-4b92-4025-be8d-5f11a5fc4077',
         *     type      : 'ledger',
         *     title     : `My Ledger Wallet`,
         *     createdAt : 0123456789,
         *     updatedAt : 1234567890,
         *   },
         * ]
         */
        _keychain: null,

        /**
         * Wallet
         *
         * Currently active wallet object.
         */
        _wallet: null,
    }),

    // NOTE: We NEVER expose the "sensitive" entropy values from:
    //       1. `_entropy`
    //       2. `_keychain`
    //
    getters: {
        /* Return NexaJS wallet instance. */
        wallet(_state) {
            return _state._wallet
        },




        /* Return a short address. */
        abbr(_state) {
            if (!this.address) return null

            return this.address.slice(5, 17) + '...' + this.address.slice(-12)
        },

        /* Return (default) address. */
        address(_state) {
            if (!this.wallet) return null

            return this.wallet.address
        },

        assets(_state) {
            return _state._assets
        },

        /**
         * Is Ready?
         *
         * Flag to indicate when the wallet is ready for use.
         */
        isReady(_state) {
            /* Validate entropy. */
            if (
                !this._entropy ||
                typeof this._entropy !== 'string' ||
                (this._entropy.length !== 32 && this._entropy.length !== 64)
            ) {
                return false
            }

            /* Wallet is ready. */
            return true
        },

        mnemonic(_state) {
            if (!_state._entropy) return null

            return entropyToMnemonic(_state._entropy)
        },

        asset(_state) {
            if (_state._assetid === null) {
                /* Return Nexa (static) details. */
                return {
                    group: '0',
                    name: `Nexa`,
                    ticker: 'NEXA',
                    iconUrl: '/nexa.svg',
                    token_id_hex: '0x',
                    decimal_places: 2,
                    document_hash: null,
                    document_url: null,
                }
            }

            /* Validate asset details (in directory). */
            if (!_state._assets[_state._assetid]) {
                return null
            }

            /* Return asset details. */
            return _state._assets[_state._assetid]
        },

        coins(_state) {
            return _state._coins
        },

        tokens(_state) {
            return _state._tokens
        },

        wif(_state) {
            if (!this.wallet?.privateKey) return null

            return encodePrivateKeyWif({ hash: sha256 }, this.wallet.privateKey, 'mainnet')
        },
    },

    actions: {
        /**
         * Initialize
         *
         * Setup the wallet store.
         *   1. Retrieve the saved entropy.
         *   2. Initialize a Wallet instance.
         *   3. Load assets.
         */
        async init() {
            console.info('Initializing wallet...')

            if (this._entropy === null) {
                throw new Error('Missing wallet entropy.')
            }

            if (!this.mnemonic) {
                throw new Error('Missing mnemonic (seed) phrase.')
            }

            /* Request a wallet instance (by mnemonic). */
            this._wallet = await Wallet.init(this.mnemonic)
            console.log('(Initialized) wallet', this._wallet)

            /* Load assets. */
            this.loadAssets()
        },

        createWallet(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            if (_entropy.length !== 32 && _entropy.length !== 64) {
                console.error(_entropy, 'is NOT valid entropy.')

                _entropy = null
            }

            /* Set entropy. */
            _setEntropy.bind(this)(_entropy)

            /* Initialize wallet. */
            this.init()
        },

        /**
         * Load Assets
         *
         * Retrieves all spendable UTXOs.
         */
        async loadAssets(_isReloading = false) {
            // console.info('Wallet address:', this.address)
            // console.info('Wallet address (1):', this.getAddress(1))
            // console.info('Wallet address (2):', this.getAddress(2))
            // console.info('Wallet address (3):', this.getAddress(3))

            /* Initialize locals. */
            let unspent

            /* Validate coin re-loading. */
            // FIXME: What happens if we re-subscribe??
            if (_isReloading === false) {
                /* Start monitoring address. */
                await subscribeAddress(
                    this.address,
                    () => this.loadAssets.bind(this)(true),
                )
            }

            /* Encode Private Key WIF. */
            // this._wif = encodePrivateKeyWif({ hash: sha256 }, this._wallet.privateKey, 'mainnet')

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            unspent = await listUnspent(this.address)
                .catch(err => console.error(err))
            // console.log('UNSPENT', unspent)

            /* Validate unspent outputs. */
            if (unspent.length === 0) {
                /* Clear (saved) coins. */
                this._coins = []

                /* Clear (saved) tokens. */
                this._tokens = []

                return console.error('There are NO unspent outputs available.')
            }

            /* Retrieve coins. */
            this._coins = unspent
                .filter(_unspent => _unspent.hasToken === false)
                .map(_unspent => {
                    const outpoint = _unspent.outpoint
                    const satoshis = _unspent.satoshis

                    return {
                        outpoint,
                        satoshis,
                        wif: this.wif,
                    }
                })
            // console.log('COINS', this.coins)

            /* Retrieve tokens. */
            this._tokens = unspent
                .filter(_unspent => _unspent.hasToken === true)
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
                        wif: this.wif,
                    }
                })
            // console.log('TOKENS', this.tokens)

            /* Vaildate assets (directory) is initialized. */
            if (!this.assets) {
                this._assets = {}
            }

            console.log('ASSETS', this.assets)

            /* Handle (metadata) token details. */
            this.tokens.forEach(async _token => {
                let doc
                let docUrl
                let iconUrl

                // console.log('TOKEN', _token)
                // FIXME: Update after ttl (24 hours).
                // if (!this.assets[_token.tokenid]) {
                if (!this.assets[_token.tokenid]?.iconUrl) {
                    /* Set (genesis) token details to (saved) directory. */
                    this._assets[_token.tokenid] = await getTokenInfo(_token.tokenid)
                        .catch(err => console.error(err))
                    // console.log('TOKEN DETAILS', this._assets[_token.tokenid])

                    /* Set document URL. */
                    docUrl = this.assets[_token.tokenid].document_url

                    /* Validate document URL. */
                    if (docUrl) {
                        doc = await $fetch(docUrl)
                            .catch(err => console.error(err))

                        if (doc) {
                            /* Set icon URL. */
                            iconUrl = doc[0]?.icon

                            /* Validate full URI. */
                            if (!iconUrl.includes('http')) {
                                // console.log('BASE URL', new URL(docUrl), docUrl, iconUrl)

                                /* Re-set icon URL. */
                                iconUrl = (new URL(docUrl)).origin + iconUrl
                            }

                            /* Save to assets. */
                            this._assets[_token.tokenid].iconUrl = iconUrl
                        }
                    }

                }
            })
        },

        async transfer(_receiver, _satoshis) {
            /* Validate transaction type. */
            if (this.asset.group === '0') {
                /* Send coins. */
                return await this.wallet.send(_receiver, _satoshis)
            } else {
                /* Send tokens. */
                return await this.wallet.send(this.asset.token_id_hex, _receiver, _satoshis)
            }
        },

        broadcast(_receivers) {
            /* Broadcast to receivers. */
            return _broadcast.bind(this)(_receivers)
        },

        /**
         * Select Asset
         *
         * Sets the active asset displayed on the UI.
         */
        selectAsset(_assetid) {
            this._assetid = _assetid
        },

        setEntropy(_entropy) {
            this._entropy = _entropy
        },

        setMnemonic(_mnemonic) {
            let entropy
            let error

            try {
                /* Derive entropy. */
                entropy = mnemonicToEntropy(_mnemonic)
            } catch (err) {
                /* Set error message. */
                error = err.message
            }

            /* Validate error. */
            if (error) {
                return error
            }

            /* Set entropy. */
            this._entropy = entropy

            /* Create wallet. */
            this.createWallet(entropy)

            /* Return entropy. */
            return this.wallet
        },

        getAddress(_accountIdx) {
            return this.wallet.getAddress(_accountIdx)
        },

        async groupTokens() {
            /* Validate tokens. */
            if (!this.tokens) {
                return []
            }

            /* Initialize (group) tokens. */
            const tokens = {}

            for (let i = 0; i < this.tokens.length; i++) {
                const token = this.tokens[i]
                // console.log('TOKEN (grouped):', token)

                // console.log('DETAILS', this.assets[token.tokenid])
                if (!tokens[token.tokenid]) {
                    let tokenidHex
                    let ticker

                    tokenidHex = this.assets[token.tokenid]?.token_id_hex

                    if (tokenidHex) {
                        ticker = await $fetch(`https://nexa.exchange/v1/ticker/quote/${tokenidHex}`)
                            .catch(err => console.error(err))
                    }

                    tokens[token.tokenid] = {
                        name: this.assets[token.tokenid]?.name || 'Unknown Asset',
                        decimals: this.assets[token.tokenid]?.decimal_places || 0,
                        iconUrl: this.assets[token.tokenid]?.iconUrl || '',
                        tokens: token.tokens,
                        tokenidHex,
                        ticker,
                    }
                } else {
                    tokens[token.tokenid].tokens += token.tokens
                }
            }

            return tokens
        },

        destroy() {
            /* Reset wallet. */
            this._entropy = null
            this._wallet = null
            // this._wif = null
            this._coins = null
            this._tokens = null

            console.info('Wallet destroyed successfully!')
        },
    },
})
