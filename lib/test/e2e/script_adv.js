/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import {
    decodeAddress,
    encodeAddress,
} from '@nexajs/address'

import {
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

/* Import library modules. */
import {
    getCoins,
    sendCoins,
} from '@nexajs/purse'

import { getTip } from '@nexajs/rostrum'

import {
    getTokens,
    sendTokens,
} from '@nexajs/token'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import { instantiateSecp256k1 } from '@bitauth/libauth'

/* Import class. */
import { Script } from '../../index.js'

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeDataPush,
    encodeNullData,
    OP,
} from '../../index.js'

const SATOSHIS = 1337n

const ALICE_ID_HEX = '845ee20d7b603506d4fc597b3e0a1a14be9a96fbcd8bb1205f8a9a034a9a0000'

const AUTH_TOKENID_HEX = '845ee20d7b603506d4fc597b3e0a1a14be9a96fbcd8bb1205f8a9a034a9a00001337330000000000000000000000000000000000000000000000000088888888'

// NOTE: HASH160(<AUTH_TOKENID_HEX>)
const AUTH_HASH_HEX = 'd9236063bc604f8408a7e12050c4f67bb46bdcfe'

// NOTE: Treasury details
const TREASURY_HASH_HEX = '80631ec9fe69de771ccc67adce8dd81b22252590'
// nexa:nqtsq5g5sp33aj07d808w8xvv7kuarwcrv3z2fvskw2ej7dj

// const POLYMORPH_HEX = `76009c630500f2052a010320fd00c0c7517f7c76010087636d00677f7501207f756876a9577a8855798b767682777c7ec0c7012a7f7c01517e52797e7c7b82778b7f777ec0cd88577aa9587a88c0c85a7a7c7e5a7a7ea7a9587f7581567a6351b275577959799601ff81a46ea1697567765879a169687c537a968b537a7c96c0c7517f7c76010087636d00677f77517f7c76010087636d00677f7581686858547a7eea7b7b939d14${TREASURY_HASH_HEX}51cd827751cd7c0114947f7788040084d71751cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868a1696d6d7567519d14${AUTH_HASH_HEX}51c7517f7c76010087636d00677f75820120876375006868a98868`
const POLYMORPH_HEX = `76009c630500f2052a010320fd00c0c7517f7c76010087636d00677f7501207f7568567a577a7e577a7e926955798b76587a597a7e597a7e597a5a7a7e5a7a7ec0c85d7a5e7a7e5e7a7e5e7a5f7a7e5f7a7e5f7a7e5f7a607a7e607a7e607a7e727c7e7b7ea7a9515b7a635c795e799601ff81a4766d6768567a587a968b587a7c96c0c7517f7c76010087636d00677f77517f7c76010087636d00677f75816868040084d71700a2696d6d6d6d6d6d7567519d14000000000000000000000000000000000000000051c7517f7c76010087636d00677f75820120876375006868a98868`

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

/* Initialize globals. */
let coins
let contractAddress
let contractCoins
let contractTokens
let contractUnspent
let nullData
let parsed
let platformAddress
let platformWif
let publicKey
let publicKeyHash
let prefix
let primaryAddress
let primaryWif
let providerAddress
let providerSpk
let providerWif
let receivers
let response
let tokenid
let tokenidHex
let tokens
let txResult

describe( 'Script Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Script' class.` )

        /* Handle prefix. */
        if (process.env.TESTNET) {
            prefix = 'nexatest'
        } else if(process.env.REGTEST) {
            prefix = 'nexareg'
        } else {
            prefix = 'nexa'
        }
        // console.log('PREFIX', prefix)

        primaryWif = process.env.ALICE_WIF

        providerWif = process.env.BOB_WIF

        platformWif = process.env.CHARLIE_WIF

        tokenidHex = process.env.BOB_TOKENID_HEX

        /* Set (Alice) address. */
        primaryAddress = (
            await parseWif(primaryWif, prefix)).address
        console.log('PRIMARY ADDR', primaryAddress);

        /* Set (Alice) public key. */
        publicKey = (
            await parseWif(primaryWif, prefix)).publicKey
        // console.log('PUBLIC KEY', publicKey)

        /* Set (Bob) address. */
        providerAddress = (
            await parseWif(providerWif, prefix)).address
        console.log('PROVIDER ADDRESS', providerAddress);

        providerSpk = decodeAddress(providerAddress, prefix)
        console.log('PROVIDER SPK', providerSpk);

        /* Set (Charlie) address. */
        platformAddress = (
            await parseWif(platformWif, prefix)).address
        console.log('PLATFORM ADDRESS', platformAddress);

    } )

    describe( 'Script -> UTXO -> Manage (Polymorph) Mining Script', async () => {
        it( 'should prepare and sign a POLYMORPH MINING SCRIPT for broadcast to the network', async () => {
return
            let allCoins
            let allTokens
            let argsData
            let baseServiceFee
            let blockHeight
            let blockHeightScript
            let contractCoins
            let constraintData
            let constraintHash

            let fee
            let lockingScript
            let lockTime

            let providerPubKeyHash

            let rate

            let scriptData
            let scriptHash
            let scriptPubKey
            let sellerPubKeyHash
            let tradeCeiling
            let tradeFloor

            let unlockingScript
            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(POLYMORPH_HEX)
            console.info('\nCONTRACT TEMPLATE', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('\nTEMPLATE HASH', binToHex(scriptHash))

            // rate = hexToBin('03e8') // 1,000 10.00%
            // rate = hexToBin('01f4') // 500 5.00%
            // rate = hexToBin('0190') // 400 4.00%
            rate = hexToBin('012c') // 300 3.00%
            // rate = hexToBin('0100')
            // rate = hexToBin('c8') // 200 2.00%
            rate.reverse()
            rate = encodeDataPush(rate)
            // rate = new Uint8Array([ OP.ONE ]) // 1 (1 satoshi per 1 token)

            fee = hexToBin('012c') // 300 (3.00%)
            // fee = hexToBin('fa') // 250 (2.50%)
            fee.reverse()
            fee = encodeDataPush(fee)
            // fee = new Uint8Array([ OP.ZERO ])

            // baseServiceFee = DUST_VALUE.toString(16)
            // if (baseServiceFee.length % 2 !== 0) {
            //     baseServiceFee = baseServiceFee.padStart(baseServiceFee.length + 1, '0')
            // }
            // baseServiceFee = hexToBin(baseServiceFee)
            // baseServiceFee.reverse()
            // baseServiceFee = encodeDataPush(baseServiceFee)
            baseServiceFee = new Uint8Array([ OP.ZERO ])

            // tradeCeiling = hexToBin('78') // 120%
            // tradeCeiling.reverse()
            // tradeCeiling = encodeDataPush(tradeCeiling)
            tradeCeiling = new Uint8Array([ OP.ZERO ])

            // tradeFloor = hexToBin('50') // 80%
            // tradeFloor.reverse()
            // tradeFloor = encodeDataPush(tradeFloor)
            tradeFloor = new Uint8Array([ OP.ZERO ])

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                // ...encodeDataPush(providerPkh), // The Provider's public key hash.
                ...rate, // The rate of exchange, charged by the Provider. (measured in <satoshis> per <asset>)
                // ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                // ...fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
                // ...baseServiceFee, // The base service fee. (specified in satoshis)
                ...tradeCeiling, // An optional (trade) ceiling set by the Provider. (measured in <satoshis> per <asset>)
                ...tradeFloor, // An optional (trade) floor set by the Provider. (measured in <satoshis> per <asset>)
            ])
            console.info('\nSCRIPT PUBLIC KEY', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n(CONTRACT) ADDRESS', contractAddress)

            // const providerPk = (
            //     await parseWif(providerWif, prefix)).publicKey

            /* Set unlocking script. */
            // NOTE: Index of (executed) contract method.
            unlockingScript = new Uint8Array([ OP.ONE ])

            coins = await getCoins(primaryWif)
                .catch(err => console.error(err))
            console.log('\n(ALICE) COINS', coins)

            contractTokens = await getTokens(primaryWif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\nCONTRACT TOKENS', contractTokens)

            if (contractTokens.length) {
                // FOR DEV PURPOSES ONLY -- take the LARGEST input
                contractTokens = [contractTokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
                // FOR DEV PURPOSES ONLY -- add scripts
                contractTokens[0].locking = lockingScript
                contractTokens[0].unlocking = unlockingScript
            }
            console.log('\n(CONTRACT) UNSPENT', contractTokens)

            /* Request Provider tokens. */
            tokens = await getTokens(primaryWif)
                .catch(err => console.error(err))
            // console.log('\n(ALICE) TOKENS-1', tokens)

            /* Filter ONLY contract tokens. */
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === AUTH_TOKENID_HEX
            })
            console.log('\n(ALICE) TOKENS-2', tokens)

            /* Aggregate ALL tokens. */
            allTokens = [
                ...contractTokens,
                ...tokens,
            ]
            console.log('\nALL TOKENS', allTokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            // unspentTokens = contractTokens
            unspentTokens = allTokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            console.log('\nUNSPENT TOKENS', unspentTokens)

            userData = [
                'Polymorph v1',
                'Mining Manager',
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            /* Initialize receivers. */
            receivers = [{
                data: nullData
            }]

            /* Add contract. */
            receivers.push({
                address: contractAddress,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                // tokens: BigInt(0xfc00000000000000), // All permissions enabled
                tokens: BigInt(0xd000000000000000), // Mint + Baton permissions
            })

            // NOTE: Return the authority baton.
            receivers.push({
                address: primaryAddress,
                tokenid: AUTH_TOKENID_HEX,
                tokens: BigInt(1),
            })

            receivers.push({
                address: primaryAddress,
                // satoshis: 1337n,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                tokens: BigInt(1337),
            })

            // NOTE: Change MUST be last output.
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens: allTokens,
                receivers,
            })
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    console.error(txResult.error)
                } else {
                    expect(txResult.result).to.have.length(64)
                }
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )

    describe( 'Script -> UTXO -> Execute (Polymorph) Mining Script', async () => {
        it( 'should prepare and sign a POLYMORPH MINING SCRIPT for broadcast to the network', async () => {
// return
            let allCoins
            let allTokens
            let argsData
            let baseServiceFee
            let blockHeight
            let blockHeightScript
            let contractCoins
            let constraintData
            let constraintHash

            let fee
            let lockingScript
            let lockTime

            let providerPubKeyHash

            let rate

            let scriptData
            let scriptHash
            let scriptPubKey
            let sellerPubKeyHash
            let tradeCeiling
            let tradeFloor

            let unlockingScript
            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(POLYMORPH_HEX)
            console.info('\nCONTRACT TEMPLATE', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('\nTEMPLATE HASH', binToHex(scriptHash))

            // rate = hexToBin('03e8') // 1,000 10.00%
            // rate = hexToBin('01f4') // 500 5.00%
            // rate = hexToBin('0190') // 400 4.00%
            rate = hexToBin('012c') // 300 3.00%
            // rate = hexToBin('0100')
            // rate = hexToBin('c8') // 200 2.00%
            rate.reverse()
            rate = encodeDataPush(rate)
            // rate = new Uint8Array([ OP.ONE ]) // 1 (1 satoshi per 1 token)

            fee = hexToBin('012c') // 300 (3.00%)
            // fee = hexToBin('fa') // 250 (2.50%)
            fee.reverse()
            fee = encodeDataPush(fee)
            // fee = new Uint8Array([ OP.ZERO ])

            // baseServiceFee = DUST_VALUE.toString(16)
            // if (baseServiceFee.length % 2 !== 0) {
            //     baseServiceFee = baseServiceFee.padStart(baseServiceFee.length + 1, '0')
            // }
            // baseServiceFee = hexToBin(baseServiceFee)
            // baseServiceFee.reverse()
            // baseServiceFee = encodeDataPush(baseServiceFee)
            baseServiceFee = new Uint8Array([ OP.ZERO ])

            // tradeCeiling = hexToBin('78') // 120%
            // tradeCeiling.reverse()
            // tradeCeiling = encodeDataPush(tradeCeiling)
            tradeCeiling = new Uint8Array([ OP.ZERO ])

            // tradeFloor = hexToBin('50') // 80%
            // tradeFloor.reverse()
            // tradeFloor = encodeDataPush(tradeFloor)
            tradeFloor = new Uint8Array([ OP.ZERO ])

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                // ...encodeDataPush(providerPkh), // The Provider's public key hash.
                // ...rate, // The rate of exchange, charged by the Provider. (measured in <satoshis> per <asset>)
                // ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                // ...fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
                // ...baseServiceFee, // The base service fee. (specified in satoshis)
                // ...tradeCeiling, // An optional (trade) ceiling set by the Provider. (measured in <satoshis> per <asset>)
                // ...tradeFloor, // An optional (trade) floor set by the Provider. (measured in <satoshis> per <asset>)
            ])
            console.info('\nSCRIPT PUBLIC KEY', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n(CONTRACT) ADDRESS', contractAddress)

            // const providerPk = (
            //     await parseWif(providerWif, prefix)).publicKey

            // const assetidHex = hexToBin('5dc46900d1a7b95c22801dfade9f1a19c9cd8d6f')
            const placeholder_8 = hexToBin('ff000000000000ff')
            const placeholder_4 = hexToBin('ff0000ff')

            /* Set unlocking script. */
            // NOTE: Index of (executed) contract method.
            unlockingScript = new Uint8Array([
                OP.ZERO, // bool isPublic
                OP.ONE, // int epoch

                ...encodeDataPush(placeholder_8), // bytes20 assetid
                ...encodeDataPush(placeholder_8), // bytes20 assetid
                ...encodeDataPush(placeholder_4), // bytes20 assetid
                // OP.FIVE, // bytes20 assetid

                ...encodeDataPush(placeholder_8), // bytes20 access
                ...encodeDataPush(placeholder_8), // bytes20 access
                ...encodeDataPush(placeholder_4), // bytes20 access
                // OP.FIVE, // bytes20 access

                ...encodeDataPush(placeholder_8), // bytes20 guardian
                ...encodeDataPush(placeholder_8), // bytes20 guardian
                ...encodeDataPush(placeholder_4), // bytes20 guardian
                // OP.FIVE, // bytes20 guardian

                OP.TWO, // int difficulty
                OP.TWO, // int handicap

                ...encodeDataPush(placeholder_8), // bytes20 miner
                ...encodeDataPush(placeholder_8), // bytes20 miner
                ...encodeDataPush(placeholder_4), // bytes20 miner
                // OP.THREE,
                // OP.THREE,
                // OP.THREE,
                // OP.FIVE, // bytes20 miner

                ...encodeDataPush(placeholder_4), // bytes32 candidate
                ...encodeDataPush(placeholder_4), // bytes32 candidate
                ...encodeDataPush(placeholder_4), // bytes32 candidate
                ...encodeDataPush(placeholder_4), // bytes32 candidate
                // OP.THREE,
                // OP.THREE,
                // OP.THREE,
                // OP.THREE,
                // OP.SIX, // bytes32 candidate

                OP.THREE,
                OP.THREE,
                OP.THREE,
                OP.THREE,

                OP.ZERO, // contract function index
            ])
            // console.log('UNLOCKING', binToHex(unlockingScript));

            coins = await getCoins(primaryWif)
                .catch(err => console.error(err))
            console.log('\n(ALICE) COINS', coins)

            contractTokens = await getTokens(primaryWif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\nCONTRACT TOKENS', contractTokens)

            if (contractTokens.length) {
                // FOR DEV PURPOSES ONLY -- take the LARGEST input
                contractTokens = [contractTokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
                // FOR DEV PURPOSES ONLY -- add scripts
                contractTokens[0].locking = lockingScript
                contractTokens[0].unlocking = unlockingScript
            }
            console.log('\n(CONTRACT) UNSPENT', contractTokens)

            /* Request Provider tokens. */
            // tokens = await getTokens(primaryWif)
            //     .catch(err => console.error(err))
            // console.log('\n(ALICE) TOKENS-1', tokens)

            /* Filter ONLY contract tokens. */
            // tokens = tokens.filter(_token => {
            //     return _token.tokenidHex === AUTH_TOKENID_HEX
            // })
            // console.log('\n(ALICE) TOKENS-2', tokens)

            /* Aggregate ALL tokens. */
            // allTokens = [
            //     ...contractTokens,
            //     ...tokens,
            // ]
            // console.log('\nALL TOKENS', allTokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = contractTokens
            // unspentTokens = allTokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            console.log('\nUNSPENT TOKENS', unspentTokens)

            userData = [
                'Polymorph v1',
                'Mining Manager',
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            /* Initialize receivers. */
            receivers = [{
                data: nullData
            }]

            /* Add contract. */
            receivers.push({
                address: contractAddress,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                // tokens: BigInt(0xfc00000000000000), // All permissions enabled
                tokens: BigInt(0xd000000000000000), // Mint + Baton permissions
            })

            // NOTE: Return the authority baton.
            // receivers.push({
            //     address: primaryAddress,
            //     tokenid: AUTH_TOKENID_HEX,
            //     tokens: BigInt(1),
            // })

            receivers.push({
                address: primaryAddress,
                // satoshis: 1337n,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                tokens: BigInt(1337),
            })

            // NOTE: Change MUST be last output.
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens: contractTokens,
                receivers,
            })
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    console.error(txResult.error)
                } else {
                    expect(txResult.result).to.have.length(64)
                }
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )

    describe( 'Script -> UTXO -> Execute Waitlist', async () => {
        it( 'should prepare and sign a WAITLIST for broadcast to the network', async () => {
return
            let argsData
            let argsConstraint
            let argsScript
            let blockHeight
            let blockHeightScript
            let coins
            let constraintData
            let constraintHash
            let contractScript
            let delegateConstraint
            let headersTip
            let lockingScript
            let lockTime
            let namespace
            let nullData
            let publicKey
            let receivers
            let response
            let scriptHash
            let scriptPubKey
            let tokens
            let txResult
            let unlockingScript
            let unspentTokens
            let userData

            /* Validate (LENGTH) wallet import format (WIF). */
            expect(process.env.ALICE_WIF).to.have.length(52)

            namespace = encodeNullData('NEXAJS01').slice(2)
            console.log('NAMESPACE', binToHex(namespace))

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = new Uint8Array([
                ...encodeDataPush(namespace),
                OP.DROP,
                OP._1NEGATE,
                OP.PLACE,
                OP.HASH160,
                OP.FROMALTSTACK,
                OP.EQUALVERIFY,
                // NOTE: All Script parameters [...] MUST be inserted here
                //       during transaction execution (as per `OP_EXEC` specs).
                //       Add `OP.FROMALTSTACK` calls equal to the
                //       # of *hidden* constraints.
                OP.EXEC,
            ])
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            contractScript =  new Uint8Array([
                // OP.FROMALTSTACK, // FOR DEV ONLY
                // ...encodeDataPush(hexToBin('1337')),
                OP.TWO, // FOR DEV ONLY
                OP.EQUALVERIFY,
                // OP.DROP, // FOR DEV ONLY
                OP.THREE, // FOR DEV ONLY
                OP.EQUALVERIFY,
                OP.ONE, // FOR DEV ONLY
                OP.EQUALVERIFY,
                OP.TWO, // FOR DEV ONLY
                OP.EQUALVERIFY,
                // OP.DROP, // FOR DEV ONLY
                // OP.FROMALTSTACK, // FOR DEV ONLY
                // OP.DROP, // FOR DEV ONLY
                // OP.ZERO, // FOR DEV ONLY
                // OP.EQUALVERIFY,
                // OP._2DROP, // FOR DEV ONLY
            ])
            console.log('CONTRACT SCRIPT', binToHex(contractScript))

            argsScript = new Uint8Array([
                OP.ZERO,
            ])

            /* Build unlocking script. */
            unlockingScript = new Uint8Array([
                // ...encodeDataPush([ OP.THREE, OP.SIX ]), // FOR DEV PURPOSES
                // ...encodeDataPush(argsScript), // Script parameters
                OP.ZERO, // Script template placeholder
                // NOTE: All Script parameters [...] MUST be inserted here
                //       during transaction execution (as per `OP_EXEC` specs).
                OP.TWO, // params
                OP.THREE, // params
                OP.ONE, // params
                OP.TWO, // params
                OP.FOUR, // # params
                OP.ZERO, // # returns
                ...encodeDataPush(contractScript),
            ])
            console.log('UNLOCKING SCRIPT', binToHex(unlockingScript))

            delegateConstraint = ripemd160(sha256(contractScript))
            console.log('DELEGATE CONSTRAINT', binToHex(delegateConstraint))

            argsConstraint = ripemd160(sha256(argsScript))
            console.log('ARGS CONSTRAINT', binToHex(argsConstraint))

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // PUSH HASH160(script template)
                OP.ZERO, // HASH160(args script) or empty stack item
                // ...encodeDataPush(argsConstraint), // HASH160(args script) or empty stack item
                // NOTE: Insert other constraints here...
                ...encodeDataPush(delegateConstraint), // *** DELEGATE CONSTRAINT MUST BE THE LAST DATA PUSH, LEFT AT THE TOP OF THE STACK ***
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('CONTRACT ADDRESS', contractAddress)
            // nexareg:nqtsq9q2wwv65p4hraae0etlu2w32trv9zn66mcqxz96expj

            coins = await getCoins(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            userData = [
                'NexaJS\tUnitTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = [
                {
                    data: nullData
                },
                {
                    address: primaryAddress,
                    satoshis: SATOSHIS,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: contractAddress,
            })
            console.log('RECEIVERS', receivers)

            /* Send UTXO request. */
            response = await sendCoins({
                coins,
                receivers,
                locking: lockingScript,
                unlocking: unlockingScript,
            })
            console.log('Send UTXO (response):', response)

            try {
                txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    console.error(txResult.message)
                }

                expect(txResult.result).to.have.length(64)
            } catch (err) {
                console.error(err)
            }

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )

    describe( 'errors', () => {
        it( 'should fail to return an opcode', () => {
            expect(OP.UNKNOWN256).to.not.exist
        } )
    } )

} )
