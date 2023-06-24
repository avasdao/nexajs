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

/* Import (local) modules. */
import { getAddressTokenUnspent } from '../index.js'


/* Import library modules. */
import { broadcast } from '../index.js'

/* Import class. */
import { Token } from '../index.js'

/* Import library modules. */
import { encodeAddress } from '../index.js'
import { sendToken } from '../index.js'

/* Set (test) constants. */
const DUST_LIMIT = 546
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

/* Initialize mempool. */
const mempool = {}

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

/* Import (individual) modules. */
import { getTopTokens } from '../index.js'

const TOP_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOP_TOKEN_TICKER = 'TOG'

describe( 'Token Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Token' class.` )
    } )

    describe( 'Token -> Top Tokens (via Otoplo API)', () => {
        it( 'should return the top 20 tokens', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens).to.have.length(20)
        } )

        it( 'should match the ID for the #1 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[0].token).to.equal(TOP_TOKEN_ID)
        } )

        it( 'should match the TICKER for the #1 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[0].ticker).to.equal(TOP_TOKEN_TICKER)
        } )

        it( 'should verify the TX COUNT for the #1 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[0].txCount).to.be.above(5000)
        } )
    } )

    describe( 'Purse -> UTXO -> Send Token', async () => {
        it( 'should prepare and sign a (token) UTXO for broadcast to the network', async () => {
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
            let unspent = await getAddressTokenUnspent(nexaAddress)
            return console.log('\n  Unspent outputs:\n', unspent)

            if (unspent.length === 0) {
                return console.error('There are NO unspent outputs available.')
            }

            /* Remove (possible) tokens. */
            // unspent = unspent.filter(_unspent => {
            //     return _unspent.value > DUST_LIMIT
            // })

            const mempool = unspent.find(_unspent=> {
                return _unspent.height === 0
            })
            console.log('MEMPOOL', mempool)

            if (mempool) {
                unspent = [mempool]
            }

            /* Build parameters. */
            const coins = unspent.map(_unspent => {
                // const outpoint = _unspent.outpointHash
                const outpoint = _unspent.outpointHash
                const satoshis = _unspent.value

                return {
                    outpoint,
                    satoshis,
                    wif,
                }
            })
            console.log('\n  Coins:', coins)

            /* Calculate the total balance of the unspent outputs. */
            const unspentSatoshis = unspent
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.value), 0
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
                    satoshis: unspentSatoshis - testVal - feeEstimate,
                })
            }
            return console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            const autoFee = false // FIXME Enable auto-fee.

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

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
