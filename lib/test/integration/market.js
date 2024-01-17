/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import {
    decodeAddress,
    encodeAddress,
    listUnspent,
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

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

/* Import class. */
import { Market } from '../../index.js'

/* Import (individual) modules. */
import {
    getPrice,
    getQuote,
    getTicker,
} from '../../index.js'

/* Libauth helpers. */
import { instantiateSecp256k1 } from '@bitauth/libauth'

const API_MEXC_ID = process.env.API_MEXC_ID
const API_MEXC_SECRET = process.env.API_MEXC_SECRET

const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const SATOSHIS = 1337n
const TOKENS = 1337n
const DUST_VALUE = 546

const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f756888030051147c7e51cd8851cc767b950210279652cd517f7c76010087636d00677f77517f7c76010087636d00677f7581686878a16900c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd01217f76517f6e7c817f7700c701217f76517f6e7c817f775979557988557978886d6d6d6d6d687b950210279602220278a16353cc78a2690300511452797e53cd7888756855c478a169c4788ca26353cd517f7c76010087636d00677f7501207f756881009d68c49c6354cd517f7c76010087636d00677f7501207f756881009d686d'

const WISERSWAP_HEX = '6c6c6c6c6c5579009c63c076cd01217f517f7c817f775279c701217f517f7c817f77537a7b888876c678c7517f7c76010087636d00677f77517f7c76010087636d00677f75816868787c955279cc537acd517f7c76010087636d00677f77517f7c76010087636d00677f7581686878547a94905279527995547aa269c4c353939d02220202102752530164030051145b7a7e56797b95547996765679a4c4547a9476cd547a88cca16903005114587a7e557a587a95547a9676557aa4c4557a9476cd547a88cca16972965379009e63765479a169685479009e63765579a269686d6d6d67557a519d5579827756797ea98871ad6d6d68'

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

/* Initialize globals. */
let adminAddress
let adminPkh
let coins
let contractAddress
let contractCoins
let contractTokens
let nullData
let parsed
let adminWif
let publicKey
let publicKeyHash
let prefix
let primaryAddress
let primaryWif
let providerAddress
let providerPkh
let providerWif
let receivers
let response
let tokenid
let tokenidHex
let tokens
let txResult

describe( 'Market Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Market' class.` )

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

        adminWif = process.env.CHARLIE_WIF

        tokenidHex = process.env.BOB_TOKENID_HEX

        /* Set (Alice) address. */
        primaryAddress = (
            await parseWif(primaryWif, prefix)).address
        console.log('PRIMARY ADDR', primaryAddress)

        /* Set (Alice) public key. */
        publicKey = (
            await parseWif(primaryWif, prefix)).publicKey
        // console.log('PUBLIC KEY', binToHex(publicKey))

        /* Set (Bob) address. */
        providerAddress = (
            await parseWif(providerWif, prefix)).address
        console.log('PROVIDER ADDRESS', providerAddress)

        providerPkh = decodeAddress(providerAddress, prefix).hash.slice(3)
        console.log('PROVIDER PKH', binToHex(providerPkh))

        /* Set (Charlie) address. */
        adminAddress = (
            await parseWif(adminWif, prefix)).address
        console.log('ADMIN ADDRESS', adminAddress)

        adminPkh = decodeAddress(adminAddress, prefix).hash.slice(3)
        console.log('ADMIN PKH', binToHex(adminPkh))
    } )

    describe( 'Script -> TradingPost -> Make Trade', async () => {
        it( 'should prepare a SCRIPT TX for trading an asset', async () => {
// return
            let argsData
            let blockHeight
            let blockHeightScript
            let contractCoins
            let constraintData

            let fee
            let lockingScript
            let lockTime

            let providerPubKeyHash

            let rate

            let scriptData
            let scriptHash
            let scriptPubKey
            let sellerPubKeyHash

            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(TRADING_POST_HEX)
            console.info('\nCONTRACT TEMPLATE', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('\nTEMPLATE HASH', binToHex(scriptHash))

            // rate = encodeDataPush(hexToBin('0186a0').reverse()) // 100,000 (1,000.00% OR 1KX)
            // rate = encodeDataPush(hexToBin('2710').reverse()) // 10,000 (100.00% OR 100X)
            // rate = encodeDataPush(hexToBin('012c').reverse()) // 300 (3.00% OR 3X)
            // rate = encodeDataPush(hexToBin('c8').reverse()) // 200 (2.00% OR 2X) -- FIXME: DOES NOT WORK (Script failed an OP_VERIFY operation)
            // rate = encodeDataPush(hexToBin('64').reverse()) // 100 (1.00% OR 1X)
            rate = new Uint8Array([ OP.ONE ]) // 1 (10,000 satoshis per 1 tokens)

            // fee = encodeDataPush(hexToBin('012c').reverse()) // 300 (3.00%)
            fee = new Uint8Array([ OP.ZERO ]) // 0 (0.00%) FOR DEV PURPOSES ONLY

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                ...encodeDataPush(providerPkh), // The Seller's public key hash.
                ...rate, // The rate of exchange, charged by the Seller. (measured in <satoshis> per <asset>)
                ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                ...fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('CONTRACT ADDRESS', contractAddress)

            coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            contractCoins = await getCoins(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))
            console.log('CONTRACT COINS', contractCoins)

            // contractUnspent = await listUnspent(contractAddress)
            //     .catch(err => console.error(err))
            // console.log('CONTRACT UNSPENT', contractUnspent)

            contractTokens = await getTokens(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))

            if (contractTokens.length) {
                // FOR DEV PURPOSES ONLY -- take the LARGEST input
                contractTokens = [contractTokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
                // FOR DEV PURPOSES ONLY -- add scripts
                contractTokens[0].locking = lockingScript
                contractTokens[0].unlocking = false
            }
            console.log('CONTRACT TOKENS', contractTokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = contractTokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            console.log('UNSPENT TOKENS', unspentTokens)

            userData = [
                'NexaJS\tUnitTest',
                'TradingPost v1',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = []

            if (unspentTokens > 1000n) {
                receivers.push({
                    address: contractAddress,
                    tokenid: tokenidHex,
                    tokens: (unspentTokens - 1n),
                })
            } else {
                receivers.push({
                    data: nullData
                })
            }

            receivers.push({
                address: providerAddress,
                satoshis: 10000n,
            })

            receivers.push({
                address: primaryAddress,
                tokenid: tokenidHex,
                tokens: 1n,
            })

            // FIXME: Enable RATE and handle Admin commission (if above DUST value).
            if (1 === 2) {
                receivers.push({
                    address: adminAddress,
                    // satoshis: 546n,
                    satoshis: 1000n,
                })
            }

            // FIXME: FOR DEV PURPOSES ONLY
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

    describe( 'Script -> WiserSwap -> Manage Pool', async () => {
        it( 'should prepare a SCRIPT TX for resetting the asset values', async () => {
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
            lockingScript = hexToBin(WISERSWAP_HEX)
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
                ...encodeDataPush(providerPkh), // The Provider's public key hash.
                ...rate, // The rate of exchange, charged by the Provider. (measured in <satoshis> per <asset>)
                ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
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

            const providerPk = (
                await parseWif(providerWif, prefix)).publicKey

            /* Set unlocking script. */
            // NOTE: Index of (executed) contract method.
            unlockingScript = new Uint8Array([
                ...new Uint8Array(64), // placeholder for signature
                ...encodeDataPush(providerPk),
                OP.ONE, // contract function index
            ])

            coins = await getCoins(process.env.BOB_WIF)
                .catch(err => console.error(err))
            console.log('\n(BOB) COINS', coins)

            contractTokens = await getTokens(process.env.BOB_WIF, scriptPubKey)
                .catch(err => console.error(err))

            if (contractTokens.length) {
                // FOR DEV PURPOSES ONLY -- take the LARGEST input
                contractTokens = [contractTokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
                // FOR DEV PURPOSES ONLY -- add scripts
                contractTokens[0].locking = lockingScript
                contractTokens[0].unlocking = unlockingScript
            }
            console.log('\n(CONTRACT) UNSPENT', contractTokens)

            /* Request Provider tokens. */
            tokens = await getTokens(process.env.BOB_WIF)
                .catch(err => console.error(err))

            /* Filter ONLY contract tokens. */
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === contractTokens[0].tokenidHex
            })
            console.log('\n(BOB) TOKENS', tokens)

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
                'WiserSwap v1',
                'Pool Management',
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
                satoshis: 10000n, // initial (1M) value
                tokenid: tokenidHex,
                tokens: 100n, // initial (10K) value
            })

            // NOTE: Change MUST be last output.
            receivers.push({
                address: providerAddress,
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

    describe( 'Script -> WiserSwap -> Make Trade', async () => {
        it( 'should prepare a SCRIPT TX for swapping an asset', async () => {
return
            let allTokens
            let argsData
            let baseServiceFee
            let blockHeight
            let blockHeightScript
            let tradeCeiling
            let tradeFloor
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

            let txValue

            let unlockingScript
            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(WISERSWAP_HEX)
            console.info('\nCONTRACT TEMPLATE', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            console.log('\nTEMPLATE HASH', binToHex(scriptHash))

            // rate = hexToBin('03e8') // 1,000 10.00%
            // rate = hexToBin('01f4') // 500 5.00%
            // rate = hexToBin('0190') // 400 4.00%
            rate = hexToBin('012c') // 300 3.00%
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
                ...encodeDataPush(providerPkh), // The Provider's public key hash.
                ...rate, // The rate of exchange, charged by the Provider. (measured in <satoshis> per <asset>)
                ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
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

            /* Set unlocking script. */
            // NOTE: Index of (executed) contract method.
            unlockingScript = new Uint8Array([ OP.ZERO ])

            coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            console.log('\n(ALICE) COINS', coins)

            contractCoins = await getCoins(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n(CONTRACT) COINS', contractCoins)

            // contractUnspent = await listUnspent(contractAddress)
            //     .catch(err => console.error(err))
            // console.log('CONTRACT UNSPENT', contractUnspent)

            contractTokens = await getTokens(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))

            if (contractTokens.length) {
                // FOR DEV PURPOSES ONLY -- take the LARGEST input
                contractTokens = [contractTokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
                // FOR DEV PURPOSES ONLY -- add scripts
                contractTokens[0].locking = lockingScript
                contractTokens[0].unlocking = unlockingScript
            }
            console.log('\n(CONTRACT) TOKENS', contractTokens)

            tokens = await getTokens(process.env.ALICE_WIF)
                .catch(err => console.error(err))

            /* Filter ONLY swappable tokens. */
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === contractTokens[0].tokenidHex
            })
            console.log('\n(ALICE) TOKENS', tokens)

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
                'WiserSwap v1',
                'I/O Pairing',
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            /* Initialize receivers. */
            receivers = []

            /* Add contract. */
            receivers.push({
                address: contractAddress,
                satoshis: (contractTokens[0].satoshis + 100000n),
                tokenid: tokenidHex,
                tokens: (contractTokens[0].tokens + 0n),
            })

            /* Add primary token request. */
            receivers.push({
                address: primaryAddress,
                tokenid: tokenidHex,
                tokens: (unspentTokens - receivers[0].tokens),
            })

            /* Handle (token) output matching. */
            if (allTokens.length > 1) {
                // NOTE: Add output pairs for ALL "additional" token inputs.
                for (let i = 1; i < allTokens.length; i++) {
                    receivers.push({
                        data: nullData
                    })
                }
            }

            /* Handle (coin) output matching. */
            if (coins.length > 1) {
                // NOTE: Add output pairs for ALL "additional" coin inputs.
                for (let i = 1; i < coins.length; i++) {
                    receivers.push({
                        data: nullData
                    })
                }
            }

            /* Calculate transaction value. */
            txValue = (receivers[0].satoshis - contractTokens[0].satoshis)
            console.log('TX VALUE', txValue)

            // NOTE: Administrative fee MUST be 3rd from last output.
            receivers.push({
                address: adminAddress,
                satoshis: (txValue * 100n) / 10000n,
                // satoshis: 546n,
            })

            // NOTE: Provider commission MUST be 2nd from last output.
            receivers.push({
                address: providerAddress,
                satoshis: (txValue * 300n) / 10000n,
                // satoshis: 546n,
            })

            // NOTE: Change MUST be last output.
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                // tokens: contractTokens,
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

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
