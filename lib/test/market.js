/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

/* Import library modules. */
import {
    getCoins,
    sendCoin,
} from '@nexajs/purse'

import { getTip } from '@nexajs/rostrum'

import {
    getTokens,
    sendToken,
} from '@nexajs/token'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    instantiateRipemd160,
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
import { Market } from '../index.js'

/* Import (individual) modules. */
import {
    getPrice,
    getQuote,
    getTicker,
} from '../index.js'

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

// const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f75687888030051147b7e51cd8851cc76537a9652cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868789d00c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd00c78800cd517f7c76010087636d00677f7501207f756852798868537a950210279602220278a16353cc78a2690300511453797e53cd7888756855c478a169c47852949c53cd517f7c76010087636d00677f7501207f75680100879b69c47c8c9c54cd517f7c76010087636d00677f7501207f75680100879b696d75'
const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f75687888030051147b7e51cd8851cc76537a9652cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868789d00c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd00c78800cd517f7c76010087636d00677f7501207f756852798868537a950210279602220278a16353cc78a2690300511453797e53cd7888756855c478a169c4788ca26353cd517f7c76010087636d00677f7501207f756881009d68c49c6354cd517f7c76010087636d00677f7501207f756881009d686d75'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

describe( 'Market Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Market' class.` )
    } )

    describe( 'Market -> Get Market instance', () => {
        it( 'should instantiate a new Market object', () => {
            /* TBD. */
            const myMarket = new Market()
            // console.log('MY MARKETS', myMarket)

            expect(myMarket).to.be.an('object')
        } )
    } )

    describe( 'Market -> Get Price', () => {
        it( 'should retrieve the live NEXA/USD price', async () => {
            const price = await getPrice()
            // console.log('PRICE', price)

            expect(price).to.gte(0.00)
        } )
    } )

    describe( 'Market -> Get Ticker', () => {
        it( 'should retrieve the live NEXA/USD ticker', async () => {
            const ticker = await getTicker()
            // console.log('TICKER', ticker)

            expect(ticker).to.be.an('object')
            expect(ticker.maxSupply).to.equal(21000000000000)
            expect(ticker.quote.USD.price).to.gte(0.00)
        } )
    } )

    describe( 'Script -> UTXO -> Execute (Script) Trade', async () => {
        it( 'should prepare and sign a Trading Post SCRIPT for broadcast to the network', async () => {
return
            let argsData
            let blockHeight
            let blockHeightScript
            let coins
            let constraintData
            let constraintHash
            let headersTip
            let lockingScript
            let lockTime
            let nexaAddress
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
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY), 'mainnet')
            // console.log('WALLET IMPORT FORMAT', wif)

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = new Uint8Array([
                OP.TXOUTPUTCOUNT,
                OP.THREE,
                OP.NUMEQUALVERIFY,
            ])
            // script = hexToBin('6c6c6c6c6c5579009c63577a5779ad567aa9765379877c557a879b6900cd827700cd7c0114947f777b8800cd517f7c76010087636d00677f7501207f7568885152c47b9cc47b9c51cd517f7c76010087636d00677f7501207f75680100879a9b696d7567557a519d00cd827700cd7c0114947f777b8800cc76537a9651cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868a16951cd517f7c76010087636d00677f7501207f75687b887b950164967600a0630300511452797e52cd788852cc5279a26975686d68')
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160.hash(sha256(lockingScript))
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
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            coins = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

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
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: SATOSHIS,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendCoin({
                coins,
                receivers,
                locking: lockingScript,
                unlocking: false, // NOTE: disables "automatic" transaction signing.
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
// return
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
            let nexaAddress
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
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY), 'mainnet')
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
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

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

            unlockingScript = new Uint8Array([

            ])

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
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Contract address:', contractAddress)

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            coinsGuest = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Coins GUEST:', coinsGuest)

            tokens = await getTokens(wif, scriptPubKey)
                .catch(err => console.error(err))
            tokens = tokens.filter(_token => _token.tokens === 900n) // FOR DEV PURPOSES ONLY
            tokens[0].locking = lockingScript
            tokens[0].unlocking = null
            console.log('\n  Tokens GUEST:', tokens)
            // tokens = [
            //     // INSERT TRADINGPOST
            // ]

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
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    satoshis: 900n,
                },
                {
                    address: NEXA_DUMP_ADDRESS,
                    tokenid: STUDIO_ID_HEX,
                    tokens: 900n,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            console.log('\n  Receivers:', receivers)

            // lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendToken({
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
