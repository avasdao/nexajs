/* Import (test) modules. */
import { assert, expect } from 'chai'

import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    mnemonicToSeed,
} from '@nexajs/hdnode'

/* Libauth helpers. */
import {
    binToHex,
    deriveHdPath,
    encodeDataPush,
    hexToBin,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
    instantiateSha512,
} from '@bitauth/libauth'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()
const sha512 = await instantiateSha512()

/* Import (local) modules. */
import { listUnspent } from '../index.js'


/* Import library modules. */
import { broadcast } from '../index.js'

/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
// import { createNexaTransaction } from '../index.js'
import { encodeAddress } from '../index.js'
import { sendCoin } from '../index.js'

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
// const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9' //nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
// const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> UTXO -> Send Coin', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
            /* Calculate seed. */
            const seed = hexToBin(mnemonicToSeed(TEST_MNEMONIC))
            // console.log('SEED', binToHex(seed))

            /* Initialize HD node. */
            const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)

            /* Derive a child from the Master node */
            const child = deriveHdPath({ ripemd160, sha256, sha512, secp256k1 }, node, `m/44'/29223'/0'/0/0`)

            const privateKey = child.privateKey
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
            console.log('PRIVATE KEY (WIF):', wif)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            const unspent = await listUnspent(nexaAddress)
            console.log('\n  Unspent outputs:\n', unspent)

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
            console.log('COINS', coins)

            const receivers = [
                NEXA_TEST_ADDRESS,
            ]
            console.log('RECEIVERS', receivers)

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
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
