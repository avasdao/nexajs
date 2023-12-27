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

const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f756888030051147c7e51cd8851cc767b9652cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868789d00c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd01217f76517f6e7c817f7700c701217f76517f6e7c817f775979557988557978886d6d6d6d6d687b950210279602220278a16353cc78a2690300511452797e53cd7888756855c478a169c4788ca26353cd517f7c76010087636d00677f7501207f756881009d68c49c6354cd517f7c76010087636d00677f7501207f756881009d686d'

const WISER_SWAP_HEX = '6c6c6c6c6c5579009c63c076cd01217f517f7c817f775279c701217f517f7c817f77537a7b888876c678c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689578cc7bcd517f7c76010087636d00677f77517f7c76010087636d00677f758168686e95537aa269c4c353939d02220203005114567a7e5379577a9502102796765379a4c4539476cd547a88cca16903005114557a7e5479567a950210279676547aa4c4529476cd547a88cca1695479009e637096765679a26975686d6d6d67557a519d5579a98871ad6d6d68'

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
        // console.log('PUBLIC KEY', publicKey)

        /* Set (Bob) address. */
        providerAddress = (
            await parseWif(providerWif, prefix)).address
        console.log('PROVIDER ADDRESS', providerAddress)

        providerPkh = decodeAddress(providerAddress, prefix).hash.slice(3)
        console.log('PROVIDER PKH', providerPkh)

        /* Set (Charlie) address. */
        adminAddress = (
            await parseWif(adminWif, prefix)).address
        console.log('ADMIN ADDRESS', adminAddress)

        adminPkh = decodeAddress(adminAddress, prefix).hash.slice(3)
        console.log('ADMIN PKH', adminPkh)
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

            let unlockingScript
            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(TRADING_POST_HEX)
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            // sellerPubKeyHash = hexToBin('f03819cd0e741e3fb2196211cd08c0c3d7bb79b1') // nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6
            rate = OP.ONE // 1 (1 satoshi per 1 token)
            // providerPubKeyHash = new Uint8Array(20)
            // fee = 0x012c // 300 (3.00%)
            fee = OP.ZERO // 0 (0.00%) FOR DEV PURPOSES ONLY

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                ...encodeDataPush(providerPkh), // The Seller's public key hash.
                rate, // The rate of exchange, charged by the Seller. (measured in <satoshis> per asset)
                ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
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
                    tokens: (unspentTokens - 1000n),
                })
            } else {
                receivers.push({
                    data: nullData
                })
            }

            receivers.push({
                address: providerAddress,
                satoshis: 1000n,
            })

            receivers.push({
                address: primaryAddress,
                tokenid: tokenidHex,
                tokens: 1000n,
            })

            // FIXME: Enable RATE and handle Admin commission (if above DUST value).
            if (1 === 2) {
                receivers.push({
                    address: adminAddress,
                    satoshis: 546n,
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

    describe( 'Script -> WiserSwap -> Make Trade', async () => {
        it( 'should prepare a SCRIPT TX for swapping an asset', async () => {
return
            let argsData
            let blockHeight
            let blockHeightScript
            let contractCoins
            let constraintData
            let constraintHash

            let fee
            let floor
            let lockingScript
            let lockTime

            let providerPubKeyHash

            let rate

            let scriptData
            let scriptHash
            let scriptPubKey
            let sellerPubKeyHash

            let unlockingScript
            let unspentTokens
            let userData

            /* Set locking script. */
            lockingScript = hexToBin(WISER_SWAP_HEX)
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            // sellerPubKeyHash = hexToBin('f03819cd0e741e3fb2196211cd08c0c3d7bb79b1') // nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6
            rate = OP.ONE // 1 (1 satoshi per 1 token)
            // providerPubKeyHash = new Uint8Array(20)
            // fee = 0x012c // 300 (3.00%)
            fee = OP.ZERO // 0 (0.00%) FOR DEV PURPOSES ONLY
            floor = OP.ZERO // 0 (0.00%) FOR DEV PURPOSES ONLY

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                ...encodeDataPush(providerPkh), // The Provider's public key hash.
                rate, // The rate of exchange, charged by the Provider. (measured in <satoshis> per asset)
                ...encodeDataPush(adminPkh), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
                floor, // An optional (trade) floor set by the Provider. (measured in <satoshis> per asset)
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
return
            userData = [
                'NexaJS\tUnitTest',
                'TradingPost v1',
                uuidv4(),
            ]

            /* Initialize hex data. */
            nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            receivers = [
                // {
                //     data: nullData
                // },
                {
                    address: contractAddress,
                    tokenid: tokenidHex,
                    tokens: 1000n,
                },
                {
                    address: providerAddress,
                    satoshis: 1000n,
                },
                {
                    address: primaryAddress,
                    tokenid: tokenidHex,
                    tokens: 1000n,
                },
            ]

            // FIXME: Handle Admin commission (if above DUST value).
            if (1 === 2) {
                receivers.push({
                    address: adminAddress,
                    satoshis: 546n,
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

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
