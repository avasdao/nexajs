/* Import modules. */
import { defineStore } from 'pinia'

import {
    encodePrivateKeyWif,
    entropyToMnemonic,
    mnemonicToEntropy,
} from '@nexajs/hdnode'

import {
    getAddressMempool,
    subscribeAddress,
} from '@nexajs/rostrum'

import { listUnspent } from '@nexajs/address'
import { sha256 } from '@nexajs/crypto'
import { Wallet } from '@nexajs/wallet'

import _createWallet from './wallet/create.ts'
// import _transfer from './wallet/transfer.ts'


const getCoinBalance = async (_address) => {
    let balance
    let unspent

    unspent = await listUnspent(_address)
        .catch(err => console.error(err))
    console.log('UNSPENT', unspent)

    balance = unspent.reduce(
        (totalBalance, unspent) => unspent.hasToken ? 0 : (totalBalance + unspent.satoshis), 0
    )

    return balance
}


/**
 * Wallet Store
 */
export const useWalletStore = defineStore('wallet', {
    state: () => ({
        /* Initialize entropy (used for HD wallet). */
        // NOTE: This is a cryptographically-secure "random" 32-byte (256-bit) value. */
        _entropy: null,

        _wallet: null,

        _wif: null,

        _coins: null,

        _tokens: null,
    }),

    getters: {
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

        address(_state) {
            if (!_state._wallet) return null

            return _state._wallet.address
        },

        abbr(_state) {
            if (!_state._wallet) return null

            console.log('_state._wallet', _state._wallet)

            return _state._wallet.address.slice(0, 19) + '...' + _state._wallet.address.slice(-6)
        },

        mnemonic(_state) {
            if (!_state._entropy) return null

            return entropyToMnemonic(_state._entropy)
        },
        entropy(_state) {
            return _state._entropy || null
        },

        wallet(_state) {
            return _state._wallet || null
        },

        wif(_state) {
            return _state._wif || null
        },

        coins(_state) {
            return _state._coins || []
        },

        tokens(_state) {
            return _state._tokens || []
        },

        balance(_state) {
            // return _state._balance
        },
    },

    actions: {
        async init() {
            console.info('Initializing wallet...')

            if (this._entropy === null) {
                throw new Error('Missing wallet entropy.')
            }

            if (!this.mnemonic) {
                throw new Error('Missing mnemonic (seed) phrase.')
            }

            this._wallet = new Wallet(this.mnemonic)
            // console.log('RE-CREATED WALLET', this._wallet)

            // FIXME Workaround to solve race condition.
            setTimeout(this.loadCoins, 1000)
        },

        createWallet(_entropy) {
            /* Validate entropy. */
            // NOTE: Expect HEX value to be 32 or 64 characters.
            if (_entropy.length !== 32 && _entropy.length !== 64) {
                console.error(_entropy, 'is NOT valid entropy.')

                _entropy = null
            }

            _createWallet.bind(this)(_entropy)

            /* Initialize wallet. */
            this.init()
        },

        /**
         * Load Coins
         *
         * Retrieves all spendable UTXOs.
         */
        async loadCoins(_isReloading = false) {
            console.info('Wallet address:', this.address)
            // console.info('Wallet address (1):', this.getAddress(1))
            // console.info('Wallet address (2):', this.getAddress(2))
            // console.info('Wallet address (3):', this.getAddress(3))

            /* Initialize locals. */
            // let satoshis
            let unspent

            /* Validate coin re-loading. */
            // FIXME: What happens if we re-subscribe??
            if (_isReloading === false) {
                /* Start monitoring address. */
                await subscribeAddress(
                    this.address,
                    () => this.loadCoins.bind(this)(true),
                )
            }

            /* Encode Private Key WIF. */
            this._wif = encodePrivateKeyWif({ hash: sha256 }, this._wallet.privateKey, 'mainnet')

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            unspent = await listUnspent(this.address)
                .catch(err => console.error(err))
            console.log('UNSPENT', unspent)

            /* Validate unspent outputs. */
            if (unspent.length === 0) {
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
                        wif: this._wif,
                    }
                })
            console.log('\n  Coins:', this.coins)

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
                        wif: this._wif,
                    }
                })
            console.log('\n  Tokens:', this.tokens)
        },

        async transfer(_receiver, _satoshis) {
            return await this.wallet.send(_receiver, _satoshis)
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

        destroy() {
            /* Reset wallet. */
            this._entropy = null
            this._wallet = null
            this._wif = null
            this._coins = null
            this._tokens = null

            console.info('Wallet destroyed successfully!')
        },

    },
})
