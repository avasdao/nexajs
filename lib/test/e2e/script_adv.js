/* Setup environment. */
import '../env.js'

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

/* Import class. */
import { Script } from '../../index.js'

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeDataPush,
    encodeNullData,
    OP,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    ALICE_ID_HEX,
    AUTH_TOKENID_HEX,
    POLYMORPH_HEX,
    SATOSHIS,
} from '../test_vectors.js'

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
        console.info( `  ↳ targeting all (public on-chain) JavaScript methods provided by the 'Script' class.` )

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
        console.log('PROVIDER SPK', binToHex(providerSpk.hash));

        /* Set (Charlie) address. */
        platformAddress = (
            await parseWif(platformWif, prefix)).address
        console.log('PLATFORM ADDRESS', platformAddress);

    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
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
            let headersTip
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

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
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

            /* Reques header's tip. */
            headersTip = await getTip()

            lockTime = headersTip.height
            console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens: allTokens,
                receivers,
                lockTime,
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
            let contractScript
            let constraintData
            let constraintHash

            let delegateConstraint

            let fee
            let headersTip
            let lockingScript
            let lockTime

            let namespace

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

            /* Set contract script. */
            contractScript = hexToBin(POLYMORPH_HEX)
            console.info('\nCONTRACT SCRIPT', binToHex(contractScript))

            namespace = encodeNullData('POLYPOW01').slice(2)
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
            console.info('\nDELEGATE TEMPLATE', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('\nTEMPLATE HASH', binToHex(scriptHash))

            delegateConstraint = ripemd160(sha256(contractScript))
            console.log('DELEGATE CONSTRAINT', binToHex(delegateConstraint))

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                // NOTE: Insert other constraints here...
                ...encodeDataPush(delegateConstraint), // *** DELEGATE CONSTRAINT MUST BE THE LAST DATA PUSH, LEFT AT THE TOP OF THE STACK ***
            ])
            console.info('\nSCRIPT PUBLIC KEY', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n(CONTRACT) ADDRESS', contractAddress)

            /* Set unlocking script. */
            // NOTE: Index of (executed) contract method.
            unlockingScript = new Uint8Array([
                // ...encodeDataPush(hexToBin('0000000000000000000000000000000000000000000000000000000000000000')), // bytes32 candidate
                // ...encodeDataPush(hexToBin('0000000000000000000000000000000000000000')), // bytes20 miner
                // ...encodeDataPush(hexToBin('ad6ce46f7f1ea8519dc02ce8ce0c278c6ff329b2')), // bytes20 access
                // OP.ZERO, // contract function index

                OP.ZERO, // Script template placeholder

                /* Contract Parameters */
                OP.ZERO, // contract function index
                ...encodeDataPush(hexToBin('0b500c7d2dfcbb5dc8c5fb218f33ec5da451a22d')), // bytes20 access HASH160<"Merhaba Satoshi!">
                ...encodeDataPush(hexToBin('0000000000000000000000000000000000000000')), // bytes20 miner
                ...encodeDataPush(hexToBin('0000000000000000000000000000000000000000000000000000000000000000')), // bytes32 candidate

                OP.FOUR, // # params
                OP.ZERO, // # returns
                ...encodeDataPush(contractScript),
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

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = contractTokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            console.log('\nUNSPENT TOKENS', unspentTokens)

            /* Initialize receivers. */
            receivers = []

            /* Add contract. */
            // NOTE: Only the Manager can set the contract to Output #0
            receivers.push({
                address: contractAddress,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                // tokens: BigInt(0xfc00000000000000), // All permissions enabled
                tokens: BigInt(0xd000000000000000), // Mint + Baton permissions
            })

            /* Add tribute. */
            receivers.push({
                address: providerAddress,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                tokens: BigInt(400000000),
            })

            /* Add mining reward. */
            receivers.push({
                address: primaryAddress,
                tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
                tokens: BigInt(4600000000),
            })

            // !! IMPORTANT !!
            // Try to create a new authority!
            // receivers.push({
            //     address: primaryAddress,
            //     tokenid: ALICE_ID_HEX, // TODO Allow auto-format conversion.
            //     tokens: BigInt(0xd000000000000000), // Mint + Baton permissions
            // })

            // NOTE: Change MUST be last output.
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Reques header's tip. */
            headersTip = await getTip()

            lockTime = headersTip.height
            console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens: contractTokens,
                receivers,
                lockTime,
                sequence: 0x01,
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
                'NEXA.js\tUnitTest',
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
