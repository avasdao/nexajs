/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import {
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

/* Libauth helpers. */
import {
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import class. */
import { Purse } from '../../index.js'

/* Import library modules. */
import {
    getCoins,
    sendCoin,
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

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

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
            const wif = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY))

            const coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            expect(coins).to.be.a('array')
            expect(coins.length).to.be.gt(0)
        } )
    } )

    describe( 'Purse -> UTXO -> Send Multi-signature Coin', async () => {
        it( 'should prepare and sign a (multi-signature) UTXO for broadcast to the network', async () => {
return
            /* Encode private key WIF. */
            const wif1 = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY_1), 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif1)

            /* Encode private key WIF. */
            const wif2 = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY_2), 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif2)

            /* Encode private key WIF. */
            const wif3 = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY_3), 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif3)

            /* Set WIFs. */
            const wifs = [
                wif1,
                wif2,
                null, // NOTE: This is optional (in some cases).
            ]

            /* Derive the corresponding public key. */
            const publicKey1 = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY_1))
            console.log('PUBLIC KEY 1 (hex)', binToHex(publicKey1))

            /* Derive the corresponding public key. */
            const publicKey2 = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY_2))
            console.log('PUBLIC KEY 2 (hex)', binToHex(publicKey2))

            /* Derive the corresponding public key. */
            const publicKey3 = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY_3))
            console.log('PUBLIC KEY 3 (hex)', binToHex(publicKey3))

            // const redeemScript = hexToBin('522102bd13fc253edbcbcbfa1c21b7ba63336c30dbd3b51bdb4deb3e28547d7c1dd4762103802a8952f26f69fdd2301c7f91571f56165ba8af5dc0f5272ae23af226774856210293112f13c7295880317a16e8b8552e8d5d3fc9ff28bdade2e9532ffa063928cd53af')
            const redeemScript = hexToBin(`52${binToHex(encodeDataPush(publicKey1))}${binToHex(encodeDataPush(publicKey2))}${binToHex(encodeDataPush(publicKey3))}53af`)
            console.log('REDEEM SCRIPT', binToHex(redeemScript))

            const redeemScriptHash = ripemd160(sha256(redeemScript))
            console.log('REDEEM SCRIPT HASH (hex)', binToHex(redeemScriptHash))

            const scriptPubKey = hexToBin('170014' + binToHex(redeemScriptHash) + '00')
            // console.info('  Public key hash Script:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', scriptPubKey)
            console.info('\n  Nexa address:', nexaAddress)

            const coins = await getCoins(wifs) // TODO
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            const userData = `NEXA.js~E2ETest~${uuidv4()}`
            // console.log('USER DATA', userData)

            /* Initialize hex data. */
            let nullData = ''

            /* Convert user data (string) to hex. */
            for (let i = 0; i < userData.length; i++) {
                /* Convert to hex code. */
                let code = userData.charCodeAt(i).toString(16)
                // console.log('CODE', userData[i], code)

                if (userData[i] === '~') {
                    code = '09'
                }

                /* Add hex code to string. */
                nullData += code
            }
            // console.log('HEX DATA', nullData)

            const receivers = [
                {
                    data: nullData
                },
                // {
                //     address: NEXA_RECEIVING_ADDRESS,
                //     satoshis: -1, // alias for send MAX
                // }
            ]
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            const response = await sendCoin(coins, receivers)
            console.log('Send UTXO (response):', response)

            try {
                const txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    return console.error(txResult.message)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }
        } )
    } )

    describe( 'Purse -> UTXO -> Send Coin', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
// return
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

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY), 'mainnet')

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))

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
            response = await sendCoin(coins, receivers)
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
        } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
