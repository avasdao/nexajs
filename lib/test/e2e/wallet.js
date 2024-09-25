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
