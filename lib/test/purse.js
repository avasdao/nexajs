/* Import (test) modules. */
import { expect } from 'chai'

import {
    encodePrivateKeyWif,
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

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

/* Import (local) modules. */
import { listUnspent } from '../index.js'


/* Import library modules. */
import { broadcast } from '../index.js'

/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
import { encodeAddress } from '../index.js'
import { sendCoin } from '../index.js'

/* Set (test) constants. */
const PRIVATE_KEY_1 = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY_2 = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> UTXO -> Multi-signature', async () => {
        it( 'should prepare and sign an (multi-signature) UTXO for broadcast to the network', async () => {
            const privateKey = hexToBin(PRIVATE_KEY_1)
            // console.log('PRIVATE KEY (hex)', binToHex(privateKey))

            /* Derive the corresponding public key. */
            const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            const scriptPushPubKey = encodeDataPush(publicKey)
            // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

            const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

            const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
            // console.info('  Public key hash Script:', binToHex(pkhScript))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', pkhScript)
            console.info('\n  Nexa address:', nexaAddress)

            /* Encode Private Key WIF. */
            const wif = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
            // console.log('PRIVATE KEY (WIF):', wif)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            const unspent = await listUnspent(nexaAddress)
            // console.log('\n  Unspent outputs:\n', unspent)

            if (unspent.length === 0) {
                return console.error('There are NO unspent outputs available.')
            }

            /* Build parameters. */
            const coins = unspent.map(_unspent => {
                const outpoint = _unspent.outpointHash
                const satoshis = _unspent.value

                return {
                    outpoint,
                    satoshis,
                    wif,
                }
            })
            console.log('\n  Coins:', coins)

            const receivers = [
                {
                    data: '1337deadbeef'
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: -1, // alias for send MAX
                }
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
            const privateKey = hexToBin(PRIVATE_KEY_1)
            // console.log('PRIVATE KEY (hex)', binToHex(privateKey))

            /* Derive the corresponding public key. */
            const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            const scriptPushPubKey = encodeDataPush(publicKey)
            // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

            const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

            const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
            // console.info('  Public key hash Script:', binToHex(pkhScript))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', pkhScript)
            console.info('\n  Nexa address:', nexaAddress)

            /* Encode Private Key WIF. */
            const wif = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
            // console.log('PRIVATE KEY (WIF):', wif)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            const unspent = await listUnspent(nexaAddress)
            // console.log('\n  Unspent outputs:\n', unspent)

            if (unspent.length === 0) {
                return console.error('There are NO unspent outputs available.')
            }

            /* Build parameters. */
            const coins = unspent.map(_unspent => {
                const outpoint = _unspent.outpointHash
                const satoshis = _unspent.value

                return {
                    outpoint,
                    satoshis,
                    wif,
                }
            })
            console.log('\n  Coins:', coins)

            const receivers = [
                {
                    data: '1337deadbeef'
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: -1, // alias for send MAX
                }
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

    describe( 'error', () => {
        it( 'should return an error', () => {
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
