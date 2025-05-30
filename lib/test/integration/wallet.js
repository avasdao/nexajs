/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    mnemonicToSeed,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import {
    getCoins,
    sendCoins,
} from '@nexajs/purse'

import {
    encodeDataPush,
    encodeNullData,
} from '@nexajs/script'

import {
    getTokens,
    sendTokens,
} from '@nexajs/token'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import class. */
import { Wallet } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    TEST_MNEMONIC,
} from '../test_vectors.js'

/* Set (BIP39) seed phrase. */
// const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
// const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9' //nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
const NEXA_NEW_RECEIVING_ADDRESS = 'nexa:nqtsq5g5qxjvuapshq04djqwkt08j9ptfz0lvnrjjrlhzs0u'
const NEXA_CHANGE_ADDRESS = 'nexa:nqtsq5g5lqpkje95fpfnfqhpc0l8m7a4yqpvuzmm768a0kyq'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const TOKEN_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
const SATOSHIS = 1337n
const TOKENS = 1337n

const asciiToHex = (_str) => {
    /* Initialize (hex) array. */
    const arr = []

    for (var i = 0, l = _str.length; i < l; i ++) {
        /* Convert character to hex. */
        const hex = Number(_str.charCodeAt(i)).toString(16)

        /* Add hex (value) to array. */
        // FIXME A note on this implementation: you must manually insert a "0" when the hex value is between 0x0 and 0x9. For this, I change your arr.push(hex) to arr.push(hex.length > 1 && hex || "0" + hex);
        arr.push(hex)
    }

    /* Return (hex) array. */
    return arr.join('')
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

describe( 'Wallet Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Wallet' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Wallet -> Address -> Receiving', () => {
        it( 'should generate a RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, false)

            /* Request (receiving) address. */
            const address = wallet.address
            console.log('ADDRESS', address)

            expect(address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> Address -> Random', () => {
        it( 'should generate a (random) RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(false)

            /* Request (change) address. */
            const address = wallet.address
            // console.log('ADDRESS', address)

            expect(address.slice(0, 4)).to.equal('nexa')
            expect(address.length).to.equal(53)
        } )
    } )

    describe( 'Wallet -> Address -> Change', () => {
        it( 'should generate a CHANGE address', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, false)

            /* Request (change) address. */
            const address = wallet.change
            // console.log('CHANGE', address)

            expect(address).to.equal(NEXA_CHANGE_ADDRESS)
        } )
    } )

    describe( 'Wallet -> Address -> New', () => {
        it( 'should generate a NEW address', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, false)

            /* Request (change) address. */
            const address = wallet.getNewAddress()
            // console.log('NEW ADDRESS', address)

            expect(address).to.equal(NEXA_NEW_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> From Derivation Path', () => {
        it( 'should generate a (path-based) RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init({
                path: `m/44'/29223'/0'/0/0`,
                mnemonic: TEST_MNEMONIC,
            }, false)

            /* Request (change) address. */
            const address = wallet.address
            // console.log('CHANGE', address)

            expect(address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> Update Balances', () => {
        it( 'should request UPDATED BALANCES for all assets', async () => {
return
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, 'USD')

            wallet.on('balances', (_assets) => {
                console.log('WALLET (_assets)', _assets)
                console.log('WALLET (assets)', wallet.assets)

                expect(wallet.assets['0'].fiat.USD).to.be.gt(0)
                expect(wallet.assets[TOKEN_ID_HEX].fiat.USD).to.be.gt(0)
            })
        } )
    } )

    describe( 'Wallet -> UTXO -> Send Coin', async () => {
        it( 'should prepare and sign a SINGLE UTXO for broadcast to the network', async () => {
// return
            let address
            let response
            let txResult
            let wallet

            /* Initialize wallet. */
            wallet = await Wallet.init(TEST_MNEMONIC, false)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            address = wallet.address
            console.log('ADDRESS', address)

            /* Send UTXO request. */
            response = await wallet.send(NEXA_DUMP_ADDRESS, SATOSHIS)
            console.log('Send (Coin) UTXO (response):', response)
        } ).timeout(60000)
    } )

    describe( 'Wallet -> UTXO -> Send Token', async () => {
        it( 'should prepare and sign a TOKEN UTXO for broadcast to the network', async () => {
return
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            await sleep(5000)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            let address
            let coins
            let receivers
            let response
            let tokens
            let txBuilder
            let txResult
            let unspentTokens
            let wallet

            /* Initialize wallet. */
            wallet = await Wallet.init(TEST_MNEMONIC, false)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            address = wallet.address
            // console.log('ADDRESS', address)

            /* Wait for balance update. */
            wallet.on('balances', async (_assets) => {
                // console.log('BALANCE UPDATE', _assets)

                /* Add primary (asset) receiver. */
                receivers = [
                    {
                        address: NEXA_DUMP_ADDRESS,
                        tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                        tokens: TOKENS,
                    },
                ]

                /* Set coins. */
                coins = wallet.coins

                /* Set tokens. */
                tokens = wallet.tokens.filter(_token => {
                    return _token.tokenidHex === TOKEN_ID_HEX
                })

                /* Calculate the total balance of the unspent outputs. */
                unspentTokens = tokens
                    .reduce(
                        (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                    )
                // console.log('UNSPENT TOKENS', unspentTokens)

                /* Handle (automatic) TOKEN change. */
                if (unspentTokens - TOKENS > BigInt(0)) {
                    receivers.push({
                        address: wallet.address,
                        tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                        tokens: (unspentTokens - TOKENS),
                    })
                }

                // FIXME: FOR DEV PURPOSES ONLY
                receivers.push({
                    address: wallet.address,
                })
                // console.log('RECEIVERS', receivers)

                txBuilder = {
                    coins,
                    tokens,
                    receivers,
                }
                // console.log('TX BUILDER', txBuilder)

                /* Send UTXO request. */
                // response = await wallet.send(TOKEN_ID_HEX, NEXA_DUMP_ADDRESS, TOKENS)
                response = await wallet.send(txBuilder)
                console.log('Send (Token) UTXO (response):', response)
            })
        } ).timeout(10000) // NOTE: Increase timeout for combo test.
    } )

    describe( 'Wallet -> UTXO -> Send Coin and Token', async () => {
        it( 'should prepare and sign both COIN and TOKEN UTXOs for broadcast to the network', async () => {
return
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            await sleep(5000)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


            let address
            let coins
            let feeRate
            let nullData
            let receivers
            let response
            let tokens
            let txResult
            let unspentCoins
            let unspentTokens
            let userData
            let wallet
            let wif

            /* Initialize wallet. */
            wallet = await Wallet.init(TEST_MNEMONIC)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            address = wallet.address
            // console.log('ADDRESS', address)

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif(wallet.privateKey, 'mainnet')
            // console.log('PRIVATE KEY (WIF):', wif)

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            tokens = await getTokens(wif)
                .catch(err => console.error(err))
            console.log('\n  Tokens:', tokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = tokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + parseInt(unspentOutput.tokens)), 0
                )
            console.log('UNSPENT TOKENS', unspentTokens)

            userData = [
                'NEXA.js\tComboTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: nullData
                },
                {
                    address: NEXA_DUMP_ADDRESS,
                    tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: TOKENS,
                },
            ]

            /* Handle (automatic) TOKEN change. */
            if (unspentTokens - TOKENS > 0) {
                receivers.push({
                    address: wallet.address,
                    tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: (unspentTokens - TOKENS),
                })
            }

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: wallet.address,
            })
            console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            feeRate = 2.0

            /* Send UTXO request. */
            response = await sendTokens(coins, tokens, receivers, feeRate)
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    return console.error(txResult.message)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }


// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            await sleep(5000)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------


            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentCoins = coins
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
                )
            console.log('UNSPENT COINS', unspentCoins)

            userData = [
                'NEXA.js\tComboTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: nullData
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: SATOSHIS,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: wallet.address,
            })
            console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            feeRate = 2.0

            /* Send UTXO request. */
            response = await sendCoins(coins, receivers, feeRate)
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    return console.error(txResult.message)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }
        } ).timeout(10000) // NOTE: Increase timeout for combo test.
    } )

    describe( 'Wallet -> UTXO -> Build Coin', async () => {
        it( 'should BUILD and sign a SINGLE UTXO', async () => {
return
            let address
            let response
            let txResult
            let wallet

            /* Initialize wallet. */
            // wallet = await Wallet.init(TEST_MNEMONIC, false)
            console.log('ALICE_SHORT_MNEMONIC', process.env.ALICE_SHORT_MNEMONIC)
            wallet = await Wallet.init(process.env.ALICE_SHORT_MNEMONIC, false)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            address = wallet.address
            console.log('ADDRESS', address)

            /* Send UTXO request. */
            response = await wallet.build(NEXA_DUMP_ADDRESS, SATOSHIS)
            console.log('Build (Coin) UTXO (response):', response)
        } ).timeout(10000)
    } )

    describe( 'Wallet -> UTXO -> Build Token', async () => {
        it( 'should BUILD and sign a TOKEN UTXO', async () => {
return
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            await sleep(5000)
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
            let address
            let coins
            let receivers
            let response
            let tokens
            let txBuilder
            let txResult
            let unspentTokens
            let wallet

            /* Initialize wallet. */
            wallet = await Wallet.init(TEST_MNEMONIC, false)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            address = wallet.address
            // console.log('ADDRESS', address)

            /* Wait for balance update. */
            wallet.on('balances', async (_assets) => {
                // console.log('BALANCE UPDATE', _assets)

                /* Add primary (asset) receiver. */
                receivers = [
                    {
                        address: NEXA_DUMP_ADDRESS,
                        tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                        tokens: TOKENS,
                    },
                ]

                /* Set coins. */
                coins = wallet.coins

                /* Set tokens. */
                tokens = wallet.tokens.filter(_token => {
                    return _token.tokenidHex === TOKEN_ID_HEX
                })

                /* Calculate the total balance of the unspent outputs. */
                unspentTokens = tokens
                    .reduce(
                        (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                    )
                // console.log('UNSPENT TOKENS', unspentTokens)

                /* Handle (automatic) TOKEN change. */
                if (unspentTokens - TOKENS > BigInt(0)) {
                    receivers.push({
                        address: wallet.address,
                        tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                        tokens: (unspentTokens - TOKENS),
                    })
                }

                // FIXME: FOR DEV PURPOSES ONLY
                receivers.push({
                    address: wallet.address,
                })
                // console.log('RECEIVERS', receivers)

                txBuilder = {
                    coins,
                    tokens,
                    receivers,
                }
                // console.log('TX BUILDER', txBuilder)

                /* Send UTXO request. */
                // response = await wallet.send(TOKEN_ID_HEX, NEXA_DUMP_ADDRESS, TOKENS)
                response = await wallet.build(txBuilder)
                console.log('Build (Token) UTXO (response):', response)
            })
        } ).timeout(10000) // NOTE: Increase timeout for combo test.
    } )

    describe( 'Wallet -> Subscribe Address', () => {
        it( 'should REGISTER AN ADDRESS for real-time updates', async () => {
return
            // const _handler = (_data) => {
            //     console.log('Subscription handler (data):', _data)
            //
            //     expect(_data).to.be.an('array')
            //     expect(_data[0]).to.equal(NEXA_TEST_ADDRESS)
            // }

            let wallet

            wallet = await Wallet.init(TEST_MNEMONIC, false)

            wallet.on('changes', (_data) => {
                console.log('THERE WAS AN UPDATE')
                console.log('DATA', _data);
            })
            console.log('WAITING FOR RECEIPT...', wallet.address)

            /* Request transaction details. */
            // const result = await subscribeAddress(NEXA_TEST_ADDRESS, _handler)
            // console.log('ADDRESS SUB', result)
        } )

    } )

    describe( 'Wallet -> To Object', () => {
        it( 'should print out the Wallet object', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, false)

            /* Request (receiving) address. */
            const obj = wallet.toObject()
            // console.log('WALLET (obj):', obj)

            expect(obj.address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> To String', () => {
        it( 'should print out the Wallet string (mnemonic)', async () => {
            /* Initialize wallet. */
            const wallet = await Wallet.init(TEST_MNEMONIC, false)

            /* Request (receiving) address. */
            const str = wallet.toString()
            // console.log('WALLET (string):', str)

            expect(str).to.equal(TEST_MNEMONIC)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
