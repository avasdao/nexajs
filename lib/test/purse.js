/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

/* Libauth helpers. */
import {
    binToHex,
    encodeDataPush,
    hexToBin,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

/* Import library modules. */
import { broadcast } from '../index.js'
import { getCoins } from '../index.js'

/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
import { encodeAddress } from '../index.js'
import { sendCoin } from '../index.js'

/* Set (test) constants. */
const DUST_LIMIT = 546
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_1 = 'ab93ef31c3de84f33d6a7c96a85b13f5653e93e014d5eba30f2a2353dc2b8af7' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_2 = 'f6bbef4f472ee95ec56576e84cfb640eb5e086f67c0bda5463f3e9ccc84b5f32' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_3 = '238990ddf6e84495abf641db1034ed429c3ddfd7808e8bf0900a4ac50fa00323' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

/* Initialize mempool. */
const mempool = {}

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> UTXO -> Send Multi-signature Coin', async () => {
        it( 'should prepare and sign a (multi-signature) UTXO for broadcast to the network', async () => {
return
            /* Encode private key WIF. */
            const wif1 = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY_1), 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif1)

            /* Encode private key WIF. */
            const wif2 = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY_2), 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif2)

            /* Encode private key WIF. */
            const wif3 = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY_3), 'mainnet')
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

            const redeemScriptHash = ripemd160.hash(sha256.hash(redeemScript))
            console.log('REDEEM SCRIPT HASH (hex)', binToHex(redeemScriptHash))

            const scriptPubKey = hexToBin('170014' + binToHex(redeemScriptHash) + '00')
            // console.info('  Public key hash Script:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', scriptPubKey)
            console.info('\n  Nexa address:', nexaAddress)

            // // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            // const unspent = await listUnspent(nexaAddress)
            // // console.log('\n  Unspent outputs:\n', unspent)
            //
            // if (unspent.length === 0) {
            //     return console.error('There are NO unspent outputs available.')
            // }
            //
            // /* Build parameters. */
            // const coins = unspent
            //     .filter(_utxo => _utxo.isToken === false)
            //     .map(_unspent => {
            //         const outpoint = _unspent.outpoint
            //         const satoshis = _unspent.satoshis
            //
            //         return {
            //             outpoint,
            //             satoshis,
            //             wifs,
            //         }
            //     })
            const coins = await getCoins(wifs) // TODO
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            // NOTE: 150b (per input), 35b (per output), 10b (misc)
            // NOTE: Double the estimate (for safety).
            const feeEstimate = ((coins.length * 150) + (35 * 2) + 10) * 2
            console.log('FEE ESTIMATE', feeEstimate)

            const userData = `NexaJS~UnitTest~${uuidv4()}`
            // console.log('USER DATA', userData)

            /* Initialize hex data. */
            let hexData = ''

            /* Convert user data (string) to hex. */
            for (let i = 0; i < userData.length; i++) {
                /* Convert to hex code. */
                let code = userData.charCodeAt(i).toString(16)
                // console.log('CODE', userData[i], code)

                if (userData[i] === '~') {
                    code = '09'
                }

                /* Add hex code to string. */
                hexData += code
            }
            // console.log('HEX DATA', hexData)

            const receivers = [
                {
                    data: hexData
                },
                // {
                //     address: NEXA_RECEIVING_ADDRESS,
                //     satoshis: -1, // alias for send MAX
                // }
            ]
            console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            const autoFee = true

            /* Send UTXO request. */
            const response = await sendCoin(coins, receivers, autoFee)
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
            /* Encode Private Key WIF. */
            const wif = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY), 'mainnet')
            // console.log('PRIVATE KEY (WIF):', wif)

            /* Derive the corresponding public key. */
            const publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            const scriptPushPubKey = encodeDataPush(publicKey)
            console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

            const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

            const scriptPubKey = hexToBin('17005114' + binToHex(publicKeyHash))
            // console.info('  Public key hash Script:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', scriptPubKey)
            console.info('\n  Nexa address:', nexaAddress)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            // let unspent = await listUnspent(nexaAddress)
            // console.log('\n  Unspent outputs:\n', unspent)
            //
            // if (unspent.length === 0) {
            //     return console.error('There are NO unspent outputs available.')
            // }
            //
            // /* Remove (possible) tokens. */
            // unspent = unspent.filter(_unspent => {
            //     return _unspent.isToken === false
            // })
            //
            // const mempool = unspent.find(_unspent=> {
            //     return _unspent.height === 0
            // })
            // console.log('MEMPOOL', mempool)
            //
            // if (mempool) {
            //     unspent = [mempool]
            // }
            //
            // /* Build parameters. */
            // const coins = unspent.map(_unspent => {
            //     const outpoint = _unspent.outpoint
            //     const satoshis = _unspent.satoshis
            //
            //     return {
            //         outpoint,
            //         satoshis,
            //         wif,
            //     }
            // })
            // console.log('\n  Coins:', coins)
            const coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            /* Calculate the total balance of the unspent outputs. */
            const unspentSatoshis = coins
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
                )
            console.log('UNSPENT SATOSHIS', unspentSatoshis)

            const testVal = 1337

            // NOTE: 150b (per input), 35b (per output), 10b (misc)
            // NOTE: Double the estimate (for safety).
            const feeEstimate = ((coins.length * 150) + (35 * 2) + 10) * 2
            console.log('FEE ESTIMATE', feeEstimate)

            const userData = `NexaJS~UnitTest~${uuidv4()}`
            // console.log('USER DATA', userData)

            /* Initialize hex data. */
            let hexData = ''

            /* Convert user data (string) to hex. */
            for (let i = 0; i < userData.length; i++) {
                /* Convert to hex code. */
                let code = userData.charCodeAt(i).toString(16)
                // console.log('CODE', userData[i], code)

                if (userData[i] === '~') {
                    code = '09'
                }

                /* Add hex code to string. */
                hexData += code
            }
            // console.log('HEX DATA', hexData)

            const receivers = [
                {
                    data: hexData
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: testVal,
                },
            ]

            /* Handle (automatic) change. */
            if (unspentSatoshis - testVal - feeEstimate > DUST_LIMIT) {
                receivers.push({
                    address: nexaAddress,
                    // satoshis: unspentSatoshis - testVal - feeEstimate,
                })
            }
            return console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            const feeRate = 2.0

            /* Send UTXO request. */
            const response = await sendCoin(coins, receivers, feeRate)
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

    describe( 'error', () => {
        it( 'should return an error', () => {
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
