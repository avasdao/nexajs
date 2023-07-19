/* Import (test) modules. */
import { expect } from 'chai'

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

/* Import class. */
import { Wallet } from '../index.js'

/* Import library modules. */
import { broadcast } from '../index.js'
import { encodeAddress } from '../index.js'
import { listUnspent } from '../index.js'
import { sendCoin } from '../index.js'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()
const sha512 = await instantiateSha512()

/* Set (BIP39) seed phrase. */
const MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
// const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9' //nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
const NEXA_CHANGE_ADDRESS = 'nexa:nqtsq5g5lqpkje95fpfnfqhpc0l8m7a4yqpvuzmm768a0kyq'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

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

describe( 'Wallet Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Wallet' class.` )
    } )

    describe( 'Wallet -> Address -> Random', () => {
        it( 'should generate a (random) RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet()

            /* Request (change) address. */
            const address = wallet.change
            // console.log('RANDOM', address)

            expect(address.slice(0, 4)).to.equal('nexa')
            expect(address.length).to.equal(53)
        } )
    } )

    describe( 'Wallet -> Address -> Receiving', () => {
        it( 'should generate a RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)

            /* Request (receiving) address. */
            const address = wallet.address
            // console.log('ADDRESS', address)

            expect(address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> Address -> Receiving', () => {
        it( 'should generate a RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)

            /* Request (receiving) address. */
            const address = wallet.getAddress()
            console.log('ADDRESS', address)

            expect(address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> Address -> Change', () => {
        it( 'should generate a CHANGE address', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)

            /* Request (change) address. */
            const address = wallet.change
            // console.log('CHANGE', address)

            expect(address).to.equal(NEXA_CHANGE_ADDRESS)
        } )
    } )

    describe( 'Wallet -> From Derivation Path', () => {
        it( 'should generate a (path-based) RECEIVING address', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet({
                path: `m/44'/29223'/0'/0/0`,
                mnemonic: MNEMONIC,
            })

            /* Request (change) address. */
            const address = wallet.address
            // console.log('CHANGE', address)

            expect(address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> UTXO -> Send Coin', async () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
return
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)
            // console.log('WALLET', wallet)

            /* Request (current) address. */
            const address = wallet.address
            console.log('ADDRESS', address)

            /* Encode Private Key WIF. */
            const wif = encodePrivateKeyWif(sha256, wallet.privateKey, 'mainnet')
            console.log('PRIVATE KEY (WIF):', wif)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            const unspent = await listUnspent(address)
            console.log('\n  Unspent outputs:\n', unspent)

            if (unspent.length === 0) {
                return console.error('There are NO unspent outputs available.')
            }

            /* Build parameters. */
            const coins = unspent.map(_unspent => {
                const outpoint = _unspent.outpoint
                const satoshis = _unspent.satoshis

                return {
                    outpoint,
                    satoshis,
                    wif,
                }
            })
            // console.log('COINS', coins)

            const receivers = [{
                data: asciiToHex(`Nexa is ready for primetime .. LFG!`),
            }, {
                address: NEXA_DUMP_ADDRESS,
                satoshis: -1, // alias for send MAX
            }]
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

    describe( 'Wallet -> To Object', () => {
        it( 'should print out the Wallet object', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)

            /* Request (receiving) address. */
            const obj = wallet.toObject()
            // console.log('WALLET (obj):', obj)

            expect(obj.address).to.equal(NEXA_RECEIVING_ADDRESS)
        } )
    } )

    describe( 'Wallet -> To String', () => {
        it( 'should print out the Wallet string (mnemonic)', async () => {
            /* Initialize wallet. */
            const wallet = new Wallet(MNEMONIC)

            /* Request (receiving) address. */
            const str = wallet.toString()
            // console.log('WALLET (string):', str)

            expect(str).to.equal(MNEMONIC)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
