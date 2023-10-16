/* Import modules. */
import { defineStore } from 'pinia'

import { mnemonicToEntropy } from '@nexajs/hdnode'

import {
    Wallet,
    WalletStatus,
} from '@nexajs/wallet'

/* Libauth helpers. */
import {
    instantiateRipemd160,
    instantiateSecp256k1,
} from '@bitauth/libauth'

import _broadcast from './wallet/broadcast.ts'
import _setEntropy from './wallet/setEntropy.ts'

/**
 * Wallet Store
 */
export const useWalletStore = defineStore('wallet', {
    state: () => ({
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
         * Wallet
         *
         * Currently active wallet object.
         */
        _wallet: null,
    }),

    getters: {
        /* Return wallet status. */
        address(_state) {
            return _state.wallet?.address
        },

        /* Return NexaJS wallet instance. */
        asset(_state) {
            return _state._wallet.asset
        },

        /* Return wallet status. */
        assets(_state) {
            return _state.wallet?.assets
        },

        /* Return wallet status. */
        balances(_state) {
            // FIXME: Update library to expose data OR
            //        refactor to `markets`.
            return _state.wallet?._balances
        },

        /* Return wallet status. */
        isLoading(_state) {
            if (typeof _state.wallet?.isReady === 'undefined') {
                return true
            }
            // console.log('_state.wallet?.isReady', _state.wallet?.isReady)

            return _state.wallet.isReady === WalletStatus.LOADING
        },

        /* Return wallet status. */
        isReady(_state) {
            // TEMP -- FIX WALLET STATUS
            if (!this._wallet === null) {
                return true
            }

            if (this.isLoading) {
                console.log('this.isLoading')
                return false
            }

            if (_state.wallet?.isReady !== WalletStatus.READY) {
                console.log('_state.wallet', _state.wallet, WalletStatus)
                return false
            }

            if (_state._entropy === null) {
                console.log('_state._entropy')
                return false
            }

            return true
        },

        /* Return NexaJS wallet instance. */
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
                throw new Error('Missing wallet entropy.')
            }

            /* Request a wallet instance (by mnemonic). */
            this._wallet = await Wallet.init(this._entropy, true)
            console.log('(Initialized) wallet', this._wallet)
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
