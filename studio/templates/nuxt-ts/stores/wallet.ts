/* Import modules. */
import { defineStore } from 'pinia'

import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    mnemonicToEntropy,
} from '@nexajs/hdnode'

import { getCoins } from '@nexajs/purse'

import {
    getOutpoint,
    getTip,
    getTokenInfo,
    getTransaction,
    subscribeAddress,
} from '@nexajs/rostrum'

import {
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    getTokens,
    sendToken,
} from '@nexajs/token'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

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

/* Set ($STUDIO) token id. */
const STUDIO_TOKENID = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000'

const TX_GAS_AMOUNT = 1000 // 10.00 NEXA

/* Build (contract) script. */
const STAKELINE_V1_SCRIPT = new Uint8Array([
    OP.FROMALTSTACK,
        OP.DROP,
    OP.FROMALTSTACK,
        OP.CHECKSEQUENCEVERIFY,
        OP.DROP,
    OP.FROMALTSTACK,
        OP.CHECKSIGVERIFY,
])

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
        /* Return NexaJS wallet instance. */
        wallet(_state) {
            return _state._wallet
        },

        /* Return wallet status. */
        isReady(_state) {
            return _state.wallet?.isReady
        },

        /* Return wallet status. */
        address(_state) {
            return _state.wallet?.address
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

        /**
         * Stakeline
         *
         * Generates a stakeline contract.
         */
        stakeline(_state) {
            /* Validate private key. */
            if (!_state._wallet?.privateKey) {
                return null
            }

            /* Initialize locals. */
            let constraintData
            let constraintHash
            let nexaAddress
            let publicKey
            let scriptHash
            let scriptPubKey
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, _state._wallet.privateKey, 'mainnet')

            /* Hash (contract) script. */
            scriptHash = ripemd160.hash(sha256(STAKELINE_V1_SCRIPT))
            console.log('SCRIPT HASH:', scriptHash)

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(_state._wallet.privateKey)

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            constraintData = encodeDataPush(publicKey)

            constraintHash = ripemd160.hash(sha256(constraintData))
            // console.log('CONSTRAINT HASH:', constraintHash)

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // script template
                ...encodeDataPush(scriptHash), // script hash
                ...encodeDataPush(constraintHash),  // arguments hash
                ...encodeDataPush(hexToBin('010040')), // relative-time block (512 seconds ~8.5mins)
                // ...encodeDataPush(hexToBin('a90040')), // relative-time block (86,528 seconds ~1day)
                // ...encodeDataPush(hexToBin('c71340')), // relative-time block (2,592,256 seconds ~30days)
                ...encodeNullData('STUDIO').slice(1), // // NOTE: Remove `OP_RETURN` prefix.
            ])

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            return nexaAddress
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

        /**
         * Activate Stakeline
         *
         * Creates a transaction and broadcasts on-chain.
         */
        async activateStakeline(_amount) {
            let headersTip
            let nexaAddress
            let publicKey
            let publicKeyHash
            let receivers
            let response
            let scriptCoins
            let scriptData
            let scriptPubKey
            let scriptTokens
            let txResult
            let wif

            console.info('\n  Nexa address:', this.address)

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, this._wallet.privateKey, 'mainnet')

            /* Reques header's tip. */
            headersTip = await getTip()
            console.log('HEADERS TIP', headersTip)

            scriptCoins = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Script Coins:', scriptCoins)

            scriptTokens = await getTokens(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Script Tokens:', scriptTokens)

            scriptTokens = scriptTokens.filter(_token => {
                return _token.tokenidHex === STUDIO_TOKENID
            })

            receivers = [
                {
                    address: this.stakeline,
                    tokenid: STUDIO_TOKENID,
                    tokens: _amount,
                },
                {
                    address: this.stakeline,
                    satoshis: BigInt(TX_GAS_AMOUNT),
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: this.address,
            })
            console.log('\n  Receivers:', receivers)

            // lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendToken(scriptCoins, scriptTokens, receivers)
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    console.error(txResult.message)
                }

                return txResult
            } catch (err) {
                console.error(err)
            }
        },

        /**
         * Closeout
         *
         * Redeem your assets AFTER the stakeline expires.
         */
        async closeout(_redeemToken) {
            console.log('REDEEM TOKEN', _redeemToken)

            let coinOutpoint
            let constraintData
            let constraintHash
            let contractAddress
            let headersTip
            let lockTime
            let outpointDetails
            let outpointTx
            let publicKey
            let receivers
            let redeemCoin
            let redeemToken
            let response
            let scriptCoins
            let scriptHash
            let scriptPubKey
            let scriptTokens
            let txResult
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, this._wallet.privateKey, 'mainnet')

            scriptHash = ripemd160.hash(sha256(STAKELINE_V1_SCRIPT))
            console.log('SCRIPT HASH', binToHex(scriptHash))

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(this._wallet.privateKey)
            console.log('PUBLIC KEY', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            constraintData = encodeDataPush(publicKey)
            console.log('PUBLIC KEY (push):', binToHex(constraintData))

            constraintHash = ripemd160.hash(sha256(constraintData))
            console.log('CONTRAINT HASH', binToHex(constraintHash))

            console.log('STUDIO (slice):', binToHex(encodeNullData('STUDIO')));


            /* Reques header's tip. */
            headersTip = await getTip()

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // script template
                ...encodeDataPush(scriptHash), // script hash
                ...encodeDataPush(constraintHash),  // arguments hash
                ...encodeDataPush(hexToBin('010040')), // relative-time block (512 seconds ~8.5mins)
                // ...encodeDataPush(hexToBin('a90040')), // relative-time block (86,528 seconds ~1day)
                // ...encodeDataPush(hexToBin('c71340')), // relative-time block (2,592,256 seconds ~30days)
                ...encodeNullData('STUDIO').slice(1), // // NOTE: Remove `OP_RETURN` prefix.
            ])

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('CONTRACT ADDRESS', contractAddress)

            outpointDetails = await getOutpoint(_redeemToken.outpoint)
                .catch(err => console.error(err))

            outpointTx = await getTransaction(outpointDetails.tx_hash)
                .catch(err => console.error(err))

            coinOutpoint = outpointTx.vout.find(_output => {
                return _output.value_satoshi === TX_GAS_AMOUNT
            })

            scriptCoins = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Script Coins:', scriptCoins)

            scriptTokens = await getTokens(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Script Tokens:', scriptTokens)

            redeemToken = scriptTokens.find(_token => {
                return _token.outpoint === _redeemToken.outpoint
            })

            redeemCoin = scriptCoins.find(_coin => {
                return _coin.outpoint === coinOutpoint.outpoint_hash
            })

            receivers = [
                {
                    address: this.address,
                    tokenid: STUDIO_TOKENID,
                    tokens: redeemToken.tokens,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: this.address,
            })
            console.log('\n  Receivers:', receivers)

            lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendToken({
                coins: [redeemCoin],
                tokens: [redeemToken],
                receivers,
                lockTime,
                sequence: 0x400001, // set (timestamp) flag + 1 (512-second) cycle
                // sequence: 0x4000a9, // set (timestamp) flag + 169 (512-second) cycles
                // sequence: 0x4013c7, // set (timestamp) flag + 5,063 (512-second) cycles
                locking: STAKELINE_V1_SCRIPT,
            })
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    console.error(txResult.message)
                }

                // expect(txResult.result).to.have.length(64)
                return txResult
            } catch (err) {
                console.error(err)
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
