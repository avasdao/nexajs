/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import { getCoins } from '@nexajs/purse'

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import class. */
import { Token } from '../../index.js'

/* Import library modules. */
import {
    getGroupDataScript,
    getGroupId,
    getSubgroupDataScript,
    getTokens,
    getTopTokens,
    sendTokens,
} from '../../index.js'

/* Set (test) constants. */
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const TOKEN_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
// const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
// const SATOSHIS = 1337
const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.
const TOG_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOG_TOKEN_TICKER = 'TOG'

const SAMPLE_GROUP_DATA = '6a38564c054e4558414a534e6578614a532e396139333262303268747470733a2f2f6e6578616a732e6f7267133700000000000000000000000000000000000000000000000000008888888855'

const TOKEN_PARENT_ID_HEX = '845ee20d7b603506d4fc597b3e0a1a14be9a96fbcd8bb1205f8a9a034a9a0000'
const SUBGROUP_HEX = '1337330000000000000000000000000000000000000000000000000088888888'
const TOKEN_ID_HEX = TOKEN_PARENT_ID_HEX + SUBGROUP_HEX

const randomIntFromInterval = (_min, _max) => {
    return Math.floor(Math.random() * (_max - _min + 1) + _min)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

/* Initialize globals. */
let coins
let groupData
let groupid
let nullData
let params
let parsed
let prefix
let primaryAddress
let primaryWif
let publicKey
let publicKeyHash
let receivers
let receivingAddress
let receivingWif
let response
let scriptPubKey
let tokenid
let tokenidHex
let tokens
let txResult

describe( 'Token Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Token' class.` )

        /* Handle prefix. */
        if (process.env.TESTNET) {
            prefix = 'nexatest'
        } else if(process.env.REGTEST) {
            prefix = 'nexareg'
        } else {
            prefix = 'nexa'
        }
        // console.log('PREFIX', prefix)

        primaryWif = process.env.BOB_WIF

        receivingWif = process.env.CHARLIE_WIF

        tokenidHex = process.env.BOB_TOKENID_HEX

        /* Set (Alice) address. */
        primaryAddress = (
            await parseWif(primaryWif, prefix)).address

        /* Set (Alice) public key. */
        publicKey = (
            await parseWif(primaryWif, prefix)).publicKey
        // console.log('PUBLIC KEY', publicKey)

        /* Set (Bob) address. */
        receivingAddress = (
            await parseWif(receivingWif, prefix)).address

        params = {
            // ticker: 'ALICE',
            // name: `AliceCoin.${uuidv4().slice(0, 8)}`,
            // uri: 'https://alice.me/alice.json',
            // hash: '3322110000000000000000000000000000000000000000000000000088888888',
            ticker: 'BOB',
            name: `BobCoin.${uuidv4().slice(0, 8)}`,
            uri: 'https://bob.me/bob.json',
            hash: '9988770000000000000000000000000000000000000000000000000033333333',
            decimals: randomIntFromInterval(0, 8),
        }
    } )

    describe( 'Token -> Top Tokens (via Otoplo API)', () => {
return
        it( 'should return the top 20 tokens', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens).to.have.length(20)
        } )

        it( 'should match the ID for the #2 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[1].token).to.equal(TOG_TOKEN_ID)
        } )

        it( 'should match the TICKER for the #2 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[1].ticker).to.equal(TOG_TOKEN_TICKER)
        } )

        it( 'should verify the TX COUNT for the #1 token', async () => {
            /* TBD. */
            const tokens = await getTopTokens()
            // console.log('TOKENS', tokens)

            expect(tokens[0].txCount).to.be.above(5000)
        } )
    } )

    describe( 'Token -> Create a new SUB-group LIVE (on-chain)', () => {
        it( 'should return a transaction id', async () => {
// return
            let coins
            let nullData
            let receivers
            let response
            let tokens
            let txResult
            let userData
            let wif

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(primaryWif).to.have.length(52)

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
            parsed = await parseWif(primaryWif, prefix)
            // console.log('PARSED', parsed)

            /* Set address. */
            primaryAddress = parsed.address

            coins = await getCoins(primaryWif)
                .catch(err => console.error(err))
            // console.log('COINS', coins)

            tokens = await getTokens(primaryWif)
                .catch(err => console.error(err))
            // console.log('TOKENS', tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            // TODO Improve filter for the parent (authority) UTXO.
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === TOKEN_PARENT_ID_HEX
            })
            // console.log('\n  Tokens (filtered):', tokens)

            params = {
                name: `NFT.${uuidv4().slice(0, 8)}`,
                infoHash: SUBGROUP_HEX,
                uri: 'ipfs://thisisjustasampleipfshash',
                fileHash: SUBGROUP_HEX,
            }

            groupData = await getSubgroupDataScript(params)
            console.log('GROUP DATA SCRIPT', binToHex(groupData))

            receivers = [
                {
                    data: groupData,
                },
                {
                    address: primaryAddress,
                    tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: BigInt(1),
                },
            ]

            // NOTE: Return the authority baton.
            receivers.push({
                address: primaryAddress,
                tokenid: TOKEN_PARENT_ID_HEX, // TODO Allow auto-format conversion.
                tokens: BigInt(0xfc00000000000000), // All permissions enabled
            })

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendTokens(coins, tokens, receivers)
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
