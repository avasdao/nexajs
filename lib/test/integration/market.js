/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

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
import {
    instantiateSecp256k1,
} from '@bitauth/libauth'

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

const API_MEXC_ID = process.env.API_MEXC_ID
const API_MEXC_SECRET = process.env.API_MEXC_SECRET
const NEXA_TEST_PARAM = 'someval'

const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'
const SAMPLE_NULL_DATA = '6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054' // Token creation for NexaJS

const MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const AVAS_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const AVAS_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
const STUDIO_ID = 'nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8'
const STUDIO_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000'
const SATOSHIS = 1337n
const TOKENS = 1337n

const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f756888030051147c7e51cd8851cc767b9652cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868789d00c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd01217f76517f6e7c817f7700c701217f76517f6e7c817f775979557988557978886d6d6d6d6d687b950210279602220278a16353cc78a2690300511452797e53cd7888756855c478a169c4788ca26353cd517f7c76010087636d00677f7501207f756881009d68c49c6354cd517f7c76010087636d00677f7501207f756881009d686d'

/* Instantiate Libauth crypto interfaces. */
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

/* Initialize globals. */
let parsed
let prefix
let contractAddress
let primaryAddress
let receivingAddress

describe( 'Market Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Market' class.` )
    } )

    describe( 'Script -> UTXO -> Execute (Permissionless) Script', async () => {
        it( 'should prepare and sign a PERMISSIONLESS SCRIPT for broadcast to the network', async () => {
// return
            let argsData
            let blockHeight
            let blockHeightScript
            let coins
            let constraintData
            let constraintHash
            let headersTip
            let lockingScript
            let lockTime
            let nullData
            let publicKey
            let receivers
            let response
            let scriptHash
            let scriptPubKey
            let tokens
            let txResult
            let unspentTokens
            let userData

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

            /* Set (primary) address. */
            primaryAddress = parsed.address

            /* Parse WIF. */
            parsed = await parseWif(process.env.BOB_WIF, prefix)
            // console.log('PARSED', parsed)

            /* Set (primary) address. */
            receivingAddress = parsed.address

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = new Uint8Array([
                OP.TXOUTPUTCOUNT,
                OP.THREE,
                OP.NUMEQUALVERIFY,
            ])
            // script = hexToBin('6c6c6c6c6c5579009c63577a5779ad567aa9765379877c557a879b6900cd827700cd7c0114947f777b8800cd517f7c76010087636d00677f7501207f7568885152c47b9cc47b9c51cd517f7c76010087636d00677f7501207f75680100879a9b696d7567557a519d00cd827700cd7c0114947f777b8800cc76537a9651cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868a16951cd517f7c76010087636d00677f7501207f75687b887b950164967600a0630300511452797e52cd788852cc5279a26975686d68')
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // PUSH HASH160(script template)
                OP.ZERO, // HASH160(args script) or empty stack item
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
                    address: receivingAddress,
                    satoshis: SATOSHIS,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: primaryAddress,
            })
            console.log('RECEIVERS', receivers)

            /* Send UTXO request. */
            response = await sendCoins({
                coins,
                receivers,
                locking: lockingScript,
                unlocking: null, // NOTE: disables "automatic" transaction signing.
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
        } )
    } )

    describe( 'Script -> TradingPost -> Make Trade', async () => {
        it( 'should prepare a SCRIPT TX for trading an asset', async () => {
return
            let argsData
            let blockHeight
            let blockHeightScript
            let coins
            let coinsGuest
            let constraintData
            let constraintHash
            let contractAddress
            let fee
            let headersTip
            let lockingScript
            let lockTime
            let nullData
            let providerPubKeyHash
            let publicKey
            let publicKeyHash
            let rate
            let receivers
            let response
            let scriptData
            let scriptHash
            let scriptPubKey
            let sellerPubKeyHash
            let tokens
            let tokensGuest
            let txResult
            let unlockingScript
            let unspentTokens
            let userData

            /* Encode Private Key WIF. */
            // wif = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY), 'mainnet')
            // console.log('WALLET IMPORT FORMAT', wif)

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160.hash(sha256(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])
            // console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            primaryAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('PRIMARY ADDRESS', primaryAddress)

//----------------------------------

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = hexToBin(TRADING_POST_HEX)
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160.hash(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            constraintData = encodeDataPush(publicKey)
            // console.log('\n  Arguments Data:', constraintData)

            constraintHash = ripemd160.hash(sha256(constraintData))
            console.log('CONSTRAINT HASH (hex):', binToHex(constraintHash))

            /* Reques header's tip. */
            headersTip = await getTip()
            // console.log('HEADERS TIP', headersTip)

            sellerPubKeyHash = hexToBin('f03819cd0e741e3fb2196211cd08c0c3d7bb79b1') // nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6
            rate = 0x01 // 1 (1 satoshi per 1 token)
            providerPubKeyHash = new Uint8Array(20)
            // fee = 0x012c // 300 (3.00%)
            fee = 0x0 // 0 (0.00%) FOR DEV PURPOSES ONLY

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
                ...encodeDataPush(sellerPubKeyHash), // The Sellers' public key hash.
                OP.ONE, // The rate of exchange, charged by the Seller. (measured in <satoshis> per asset)
                ...encodeDataPush(providerPubKeyHash), // An optional 3rd-party (specified by the Seller) used to facilitate the tranaction.
                fee, // An optional amount charged by the Provider. (measured in <basis points> (bp), eg. 5.25% = 525bp)
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Contract address:', contractAddress)

            coins = await getCoins(process.env.ALICE_WIF)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            coinsGuest = await getCoins(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Coins GUEST:', coinsGuest)

            tokens = await getTokens(process.env.ALICE_WIF, scriptPubKey)
                .catch(err => console.error(err))

            // FOR DEV PURPOSES ONLY -- take the LARGEST input
            tokens = [tokens.sort((a, b) => Number(b.tokens) - Number(a.tokens))[0]]
            // FOR DEV PURPOSES ONLY -- add scripts
            tokens[0].locking = encodeDataPush(lockingScript)
            tokens[0].unlocking = false
            console.log('\n  Tokens GUEST:', tokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = tokens
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

            receivers = [
                {
                    data: nullData
                },
                // {
                //     address: contractAddress,
                //     // address: 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz',
                //     tokenid: STUDIO_ID_HEX,
                //     tokens: 600n,
                // },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: 600n,
                },
                {
                    address: NEXA_DUMP_ADDRESS,
                    tokenid: STUDIO_ID_HEX,
                    tokens: 600n,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: primaryAddress,
            })
            console.log('\n  Receivers:', receivers)

            // lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens,
                receivers,
                // lockTime,
                // sequence: 0x400001, // set (timestamp) flag + 1 (512-second) cycle
                // locking: lockingScript,
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
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
