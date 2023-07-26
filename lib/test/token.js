/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'
import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'
import { broadcast } from '@nexajs/provider'
import { getCoins } from '@nexajs/purse'
import { encodeNullData } from '@nexajs/script'

/* Libauth helpers. */
import {
    binToHex,
    encodeDataPush,
    hexToBin,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

/* Import class. */
import { Token } from '../index.js'

/* Import library modules. */
import { getTokens } from '../index.js'
import { getTopTokens } from '../index.js'
import { sendToken } from '../index.js'

/* Set (test) constants. */
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const TOKEN_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
// const SATOSHIS = 1337
const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.
const TOP_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOP_TOKEN_TICKER = 'TOG'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()


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
            // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

            const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

            const scriptPubKey = hexToBin('17005114' + binToHex(publicKeyHash))
            // console.info('  Public key hash Script:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', scriptPubKey)
            console.info('\n  Nexa address:', nexaAddress)

            const coins = await getCoins(wif)
                .catch(err => console.error(err))
            // console.log('\n  Coins:', coins)

            const tokens = await getTokens(wif)
                .catch(err => console.error(err))
            // console.log('\n  Tokens:', tokens)

            /* Calculate the total balance of the unspent outputs. */
            // const unspentTokens = tokens
            //     .reduce(
            //         (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), 0n
            //     )
            // console.log('UNSPENT TOKENS', unspentTokens)

            const userData = [
                'NexaJS\tUnitTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            const nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            const receivers = [
                {
                    data: nullData
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: TOKENS,
                },
            ]

            /* Handle (automatic) TOKEN change. */
            // if (unspentTokens - TOKENS > 0n) {
            //     receivers.push({
            //         address: nexaAddress,
            //         tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
            //         tokens: (unspentTokens - TOKENS),
            //     })
            // }

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            // console.log('\n  Receivers:', receivers)

            /* Set automatic fee (handling) flag. */
            const feeRate = 2.0

            /* Send UTXO request. */
            const response = await sendToken(coins, tokens, receivers, feeRate)
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
