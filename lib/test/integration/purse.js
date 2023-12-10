/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import {
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import { parseWif } from '@nexajs/hdnode'

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
import { instantiateSecp256k1 } from '@bitauth/libauth'

/* Import class. */
import { Purse } from '../../index.js'

/* Import library modules. */
import {
    getCoins,
    sendCoins,
} from '../../index.js'

/* Set (test) constants. */
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_1 = 'ab93ef31c3de84f33d6a7c96a85b13f5653e93e014d5eba30f2a2353dc2b8af7' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_2 = 'f6bbef4f472ee95ec56576e84cfb640eb5e086f67c0bda5463f3e9ccc84b5f32' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_3 = '238990ddf6e84495abf641db1034ed429c3ddfd7808e8bf0900a4ac50fa00323' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const SATOSHIS = 1337n

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

/* Initialize globals. */
let parsed
let prefix
let primaryAddress
let receivingAddress

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> Get Coins', async () => {
        it( 'should retieve Coins (from UTXOs) of a given WIF', async () => {
            const coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            // console.log('ALICE COINS', coins)

            expect(coins).to.be.a('array')
            expect(coins.length).to.be.gt(0)
        } )
    } )

    describe( 'Purse -> UTXO -> Send Multi-signature Coin', async () => {
        it( 'should prepare and sign a (multi-signature) UTXO for broadcast to the network', async () => {
return
            /* Set WIFs. */
            const wifs = [
                process.env.ALICE_WIF,
                process.env.BOB_WIF,
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

            const redeemScriptHash = ripemd160(sha256.hash(redeemScript))
            console.log('REDEEM SCRIPT HASH (hex)', binToHex(redeemScriptHash))

            const scriptPubKey = hexToBin('170014' + binToHex(redeemScriptHash) + '00')
            // console.info('  Public key hash Script:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const primaryAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('PRIMARY ADDRESS', primaryAddress)

            const coins = await getCoins(wifs) // TODO
                .catch(err => console.error(err))
            console.log('COINS', coins)

            const userData = `NexaJS~UnitTest~${uuidv4()}`
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
                //     address: receivingAddress,
                //     satoshis: -1, // alias for send MAX
                // }
            ]
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            const response = await sendCoins(coins, receivers)
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
            let nullData
            let publicKey
            let publicKeyHash
            let receivers
            let response
            let scriptData
            let scriptPubKey
            let txResult
            let userData

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(process.env.ALICE_WIF).to.have.length(52)

            /* Handle prefix. */
            if (process.env.TESTNET) {
                prefix = 'nexatest'
            } else if(process.env.REGTEST) {
                prefix = 'nexareg'
            } else {
                prefix = 'nexa'
            }
            // console.log('PREFIX', prefix)

            /* Parse WIF. */
            parsed = await parseWif(process.env.ALICE_WIF, prefix)
            // console.log('PARSED', parsed)

            /* Set (primary) address. */
            primaryAddress = parsed.address

            /* Set public key. */
            publicKey = parsed.publicKey

            /* Validate (LENGTH) public key. */
            expect(publicKey).to.have.length(33)

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160(sha256(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            primaryAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            // console.info('REG ADDRESS', primaryAddress)

            coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            coins = coins.slice(0, 3)
            console.log('\n  Coins:', coins)

            userData = [
                'NexaJS\tUnitTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            /* Parse WIF. */
            parsed = await parseWif(process.env.BOB_WIF, prefix)
            // console.log('PARSED', parsed)

            /* Set (receiving) address. */
            receivingAddress = parsed.address

            receivers = [
                {
                    data: nullData,
                },
                {
                    address: receivingAddress,
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
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendCoins(coins, receivers)
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
