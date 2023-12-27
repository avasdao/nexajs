/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { decodeAddress, encodeAddress } from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

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
const NEXAREG_RECEIVING_ADDRESS = 'nexareg:nqtsq5g5cuh44dagudrschpaztkx5gg9j2jf2fjehespnnqd'
const TOKEN_ID = 'nexareg:tqcfh2wjq3l9pd43s997282eu4esxhf4mfl5uplk5jpt7gt50vqqqa49yj5gp'
// const TOKEN_ID_HEX = '309ba9d2047e50b6b1814be51d59e573035d35da7f4e07f6a482bf21747b0000'
const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.
const TOP_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOP_TOKEN_TICKER = 'TOG'

const SAMPLE_GROUP_DATA = '6a38564c054e4558414a534e6578614a532e396139333262303268747470733a2f2f6e6578616a732e6f7267133700000000000000000000000000000000000000000000000000008888888855'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()

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

const TOKEN_PARENT_ID_HEX = '2f11036b8510df19706f0019db0c3aeb11d79ac39c7b99eb5b0faf3b46440000'
const SUBGROUP_HEX = '1337330000000000000000000000000000000000000000000000000088888888'
const TOKEN_ID_HEX = TOKEN_PARENT_ID_HEX + SUBGROUP_HEX

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

    describe( 'Token -> Create a new $TOKEN group token', () => {
        it( 'should create a new $TOKEN asset', async () => {
return
            /* Initialize locals. */
            let outpoint
            let reversed
            let scriptData
            let userData

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(primaryWif).to.have.length(52)

            /* Validate (LENGTH) public key. */
            expect(publicKey).to.have.length(33)

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160.hash(sha256(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])

            coins = await getCoins(primaryWif)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            outpoint = (coins.find(_coin => {
                return typeof _coin.outpoint !== 'undefined' && _coin.outpoint.length === 64
            })).outpoint
            console.log('OUTPOINT', outpoint)

            groupData = getGroupDataScript(params)
            console.log('GROUP DATA SCRIPT', binToHex(groupData))

            let { groupidBin, nonceBin } = await getGroupId(outpoint, groupData)
            console.log('GROUP ID (hex):', binToHex(groupidBin))
            console.log('NONCE', binToHex(nonceBin))

            reversed = '0x' + reverseHex(binToHex(nonceBin))
            console.log('REVERSED', reversed)

            console.log('NONCE (BI):', BigInt(reversed))
            // console.log('NONCE (BI):', BigInt(nonceDec))

            expect(groupidBin).to.have.length(32)
            expect(binToHex(groupidBin.slice(-2))).to.equal('0000')

            /* Encode the public key hash into a P2PKH nexa address. */
            primaryAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )

            /* Encode the public key hash into a P2PKH nexa address. */
            groupid = encodeAddress(
                prefix,
                'GROUP',
                groupidBin,
            )
            console.log('GROUP ID', groupid)
            // expect(primaryAddress).to.equal('nexa:tphe6nttre86dj4ulyppwqd7jmeamemnjkkwl3f5d7fl4zrxmyqqqn8made6x')

            tokens = []
            console.log('TOKENS (filtered):', tokens)

            userData = [
                'MINT',
                '$TOKEN',
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: groupData,
                },
                {
                    address: primaryAddress,
                    tokenid: binToHex(groupidBin), // TODO Allow auto-format conversion.
                    tokens: BigInt(reversed),
                },
                {
                    data: nullData,
                },
            ]

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

                if (txResult.error) {
                    return console.error(txResult.error)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(30000) // FIXME Remove magic number.
    } )

    describe( 'Token -> Mint new tokens (on-chain)', () => {
        it( 'should mint new tokens', async () => {
// return
            let outpoint
            let reversed
            let scriptData
            let scriptPubKey
            let userData

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(primaryWif).to.have.length(52)

            /* Validate (LENGTH) public key. */
            expect(publicKey).to.have.length(33)

            expect(tokenidHex).to.have.length(64)

            coins = await getCoins(primaryWif)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            tokens = await getTokens(primaryWif)
                .catch(err => console.error(err))
            console.log('TOKENS', tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === tokenidHex
            })
            console.log('TOKENS (filtered):', tokens)

            userData = [
                'MINT',
                '$TOKEN',
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: nullData,
                },
                {
                    address: primaryAddress,
                    // address: receivingAddress,
                    tokenid: tokenidHex, // TODO Allow auto-format conversion.
                    tokens: BigInt(TOKENS * 10n),
                },
            ]

            // NOTE: Return the authority baton.
            receivers.push({
                address: primaryAddress,
                tokenid: tokenidHex, // TODO Allow auto-format conversion.
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

                if (txResult.error) {
                    return console.error(txResult.error)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )

    describe( 'Token -> Create a new SUB-group LIVE (on-chain)', () => {
        it( 'should return a transaction id', async () => {
return
            let coins
            let nullData
            let receivers
            let response
            let tokens
            let txResult
            let userData
            let wif

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

            /* Set address. */
            primaryAddress = parsed.address

            coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            // console.log('COINS', coins)

            tokens = await getTokens(process.env.ALICE_WIF)
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

            // userData = [
            //     'MINT',
            //     'STUDIO',
            // ]

            /* Initialize hex data. */
            // nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

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

    describe( 'Purse -> UTXO -> Send Token', async () => {
        it( 'should prepare and sign a (token) UTXO for broadcast to the network', async () => {
return
            /* Initialize locals. */
            let nullData
            let scriptPubKey
            let scriptPushPubKey
            let userData

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(wif).to.have.length(52)

            /* Validate (LENGTH) public key. */
            expect(publicKey).to.have.length(33)

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            tokens = await getTokens(wif)
                .catch(err => console.error(err))
            console.log('TOKENS', tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === tokenidHex
            })
            // console.log('\n  Tokens (filtered):', tokens)

            userData = [
                'NexaJS\tUnitTest',
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
                    address: receivingAddress,
                    tokenid: tokenidHex, // TODO Allow auto-format conversion.
                    tokens: TOKENS,
                },
            ]

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

                if (txResult.error) {
                    return console.error(txResult.error)
                }

                expect(txResult.result).to.have.length(64)
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
