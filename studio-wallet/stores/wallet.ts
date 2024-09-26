/* Import modules. */
import { defineStore } from 'pinia'

import { encodeAddress } from '@nexajs/address'
import { hash160 } from '@nexajs/crypto'
import { mnemonicToEntropy } from '@nexajs/hdnode'
import { sendCoins } from '@nexajs/purse'
import {
    encodeDataPush,
    OP,
} from '@nexajs/script'
import {
    Wallet,
    WalletStatus,
} from '@nexajs/wallet'

/* Import (local) modules. */
import _setEntropy from './wallet/setEntropy.ts'

/* Set constants. */
// FIXME Move these constants to System.
const FEE_AMOUNT = 1000
const MAX_INPUTS_ALLOWED = 250
const GROUP_TYPE_TEMPLATE = 'TEMPLATE'

/**
 * Wallet Store
 */
export const useWalletStore = defineStore('wallet', {
    state: () => ({
        /**
         * Assets
         *
         * Will hold ALL assets that the wallet manages.
         */
        _assets: null,

        /**
         * Entropy
         * (DEPRECATED -- MUST REMAIN SUPPORTED INDEFINITELY)
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
         * Networks
         *
         * Manages all Layer1 Networks, Layer1+ (Plus) Supernets,
         * and Layer1 (EVM) MetaNets "managed by" the Nexa Core blockchain.
         */
        _networks: [
            'METANEXA', // Nexa (MetaNet)
            'METANXY',  // Nxy  (MetaNet)
            'METATELR', // TΞLR (MetaNet)
            'NEXA',     // Nexa (Core/Base Network)
            'NXY',      // Nxy  (Supernet)
            'TELR',     // TΞLR (Supernet)
        ],

        /**
         * Wallet
         *
         * Currently active wallet object.
         */
        _wallet: null,
    }),

    getters: {
        /* Return (abbreviated) wallet status. */
        abbr(_state) {
            if (!_state._wallet) {
                return null
            }

            return _state._wallet.abbr
        },

        /* Return wallet status. */
        address(_state) {
            if (!_state._wallet) {
                return null
            }

            return _state._wallet.address
        },

        asset(_state) {
            if (!this.assets || !this.wallet) {
                return null
            }

            return this.assets[this.wallet.assetid]
        },

        assets(_state) {
            if (_state._assets) {
                return _state._assets
            }

            if (!_state._wallet) {
                return null
            }

            return _state._wallet.assets
        },

        /* Return wallet status. */
        isLoading(_state) {
            if (!_state._wallet) {
                return true
            }

            return _state._wallet.isLoading
        },

        /* Return wallet status. */
        isReady(_state) {
            if (!_state._wallet) {
                return false
            }

            if (_state._wallet._entropy) {
                return true
            }

            return _state._wallet.isReady
        },

        networks(_state) {
            return _state._networks
        },

        wallet(_state) {
            return _state._wallet
        },

        WalletStatus() {
            return WalletStatus
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
                this._wallet = 'NEW' // FIXME TEMP NEW WALLET FLAG
                // throw new Error('Missing wallet entropy.')
                return console.error('Missing wallet entropy.')
            }

            /* Request a wallet instance (by mnemonic). */
            this._wallet = await Wallet.init(this._entropy, true)
            console.info('(Initialized) wallet', this.wallet)

            // this._assets = { ...this.wallet.assets } // cloned assets

            /* Set (default) asset. */
            this.wallet.setAsset('0')

            /* Handle balance updates. */
            this.wallet.on('balances', async (_assets) => {
                // console.log('Wallet Balances (onChanges):', _assets)

                /* Close asset locally. */
// FIXME Read ASSETS directly from library (getter).
                this._assets = { ..._assets }
            })
        },

        /**
         * Create Wallet
         *
         * Create a fresh wallet.
         *
         * @param _entropy A 32-byte (hex-encoded) random value.
         */
        createWallet(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            if (_entropy?.length !== 32 && _entropy?.length !== 64) {
                console.error(_entropy, 'is NOT valid entropy.')

                /* Clear (invalid) entropy. */
                _entropy = null
            }

            /* Set entropy. */
            _setEntropy.bind(this)(_entropy)

            /* Initialize wallet. */
            this.init()
        },

        getNetwork(_networkid) {
            if (
                this.wallet &&
                this.wallet.publicKey &&
                this.networks.includes(_networkid.toUpperCase())
            ) {
                /* Initialize locals. */
                let publicKeyHash
                let scriptData
                let scriptPubkey

                /* Initialize network handler (object). */
                const network = {}

                /* Set network ID. */
                network.id = _networkid.toUpperCase()

                /* Set address prefix. */
                network.prefix = _networkid.toLowerCase()

                /* Set (Script PUSH) public key. */
                scriptData = encodeDataPush(this.wallet.publicKey)

                /* Set public key hash. */
                publicKeyHash = hash160(scriptData)

                /* Set script pubkey. */
                scriptPubkey = new Uint8Array([
                    OP.ZERO,
                    OP.ONE,
                    ...encodeDataPush(publicKeyHash),
                ])

                /* Set address. */
                network.address = encodeAddress(
                    network.prefix,
                    GROUP_TYPE_TEMPLATE,
                    scriptPubkey
                )

                /* Return network. */
                return network
            } else {
                /* Return empty network (object). */
                return {
                    id: null,
                    hrf: null,
                    address: null,
                }
            }
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

        async consolidate() {
            console.log('start the consolidation ... to', this.address)

            /* Initialize locals. */
            let amount
            let coins
            let receivers
            let response
            let sendAmount
            let tokens

            coins = this.wallet.coins
            console.log('COINS-1', coins.length, coins)

            /* Validate number of coin inputs. */
            if (coins.length > MAX_INPUTS_ALLOWED) {
                /* Sort coins descending values. */
                coins = coins.sort((a, b) => {
                    /* Calculate comparison. */
                    const compare = b.satoshis - a.satoshis

                    /* Compare values. */
                    if (compare > BigInt(0)) {
                        return 1
                    } else if (compare < BigInt(0)) {
                        return -1
                    } else {
                        return 0
                    }
                })

                /* Trim coins to MAX ALLOWED inputs. */
                coins = coins.slice(0, MAX_INPUTS_ALLOWED)
            }
            console.log('COINS-2', coins.length, coins)

            tokens = this.wallet.tokens
            console.log('TOKENS', tokens)

            amount = coins.reduce(
                (acc, coin) => acc + coin.satoshis, BigInt(0)
            )
            console.log('CONSOLIDATION AMOUNT', amount)

            sendAmount = amount - (BigInt(FEE_AMOUNT) * BigInt(coins.length))
            console.log('SEND AMOUNT', sendAmount)

            if (sendAmount < 0) {
                return alert(`Oops! There IS NOT enough value to consolidate these coins.`)
            }

            /* Set receivers. */
            receivers = [
                {
                    address: this.address,
                    satoshis: sendAmount,
                },
                {
                    address: this.address,
                }
            ]
            console.log('RECEIVERS', receivers)

            /* Send UTXO request. */
            response = await sendCoins(coins, receivers)
            // console.log('Consolidate UTXOs (response)', response)

            /* Return response. */
            return response
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

        destroy() {
            /* Reset wallet. */
            this._entropy = null
            this._wallet = null

            console.info('Wallet destroyed successfully!')
        },
    },
})
