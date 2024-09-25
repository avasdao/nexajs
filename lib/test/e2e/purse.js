/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import {
    derivePublicKeyCompressed,
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import {
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import class. */
import { Purse } from '../../index.js'

/* Import library modules. */
import {
    getCoins,
    sendCoins,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_RECEIVING_ADDRESS,
    PRIVATE_KEY,
    PRIVATE_KEY_1,
    PRIVATE_KEY_2,
    PRIVATE_KEY_3,
    SATOSHIS,
} from '../test_vectors.js'

/* Initialie globals. */
let coins
let nexaAddress
let nullData
let publicKey
let publicKeyHash
let receivers
let response
let scriptData
let scriptPubKey
let txResult
let userData
let wif

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (public on-chain) JavaScript methods provided by the 'Purse' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Purse -> Get Coins', async () => {
        it( 'should retieve Coins (from UTXOs) of a given WIF', async () => {
            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif(hexToBin(PRIVATE_KEY))

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  COINS', coins)

            expect(coins).to.be.a('array')
            expect(coins.length).to.be.gt(0)
        } )
    } )

    describe( 'Purse -> UTXO -> Send Coin', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
// return
            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif(hexToBin(PRIVATE_KEY), 'mainnet')

            /* Derive the corresponding public key. */
            publicKey = derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160(sha256(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            // console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            userData = [
                'NEXA.js\tE2ETest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: nullData,
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: SATOSHIS,
                },
            ]

            userData = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            /* Add a 2nd data push. */
            // receivers.push({
            //     data: nullData,
            // })

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            txResult = await sendCoins(coins, receivers)
            console.log('Send Coins (txResult):', txResult)

            if (txResult.error) {
                return console.error(txResult.error)
            }

            expect(txResult.result).to.have.length(64)
        } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
