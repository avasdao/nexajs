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
    instantiateSha256,
} from '@bitauth/libauth'

/* Import class. */
import { Token } from '../../index.js'

/* Import library modules. */
import {
    getGroupDataScript,
    getGroupId,
    getTokens,
    getTopTokens,
    sendToken,
} from '../../index.js'

/* Set (test) constants. */
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const TOKEN_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
// const SATOSHIS = 1337
const TOKENS = 1337n // NOTE: This MUST be a type of BigInt.
const TOP_TOKEN_ID = 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p'
const TOP_TOKEN_TICKER = 'TOG'

const SAMPLE_GROUP_DATA = '6a38564c054e4558414a534e6578614a532e396139333262303268747470733a2f2f6e6578616a732e6f7267133700000000000000000000000000000000000000000000000000008888888855'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

const randomIntFromInterval = (_min, _max) => {
    return Math.floor(Math.random() * (_max - _min + 1) + _min)
}

describe( 'Token Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Token' class.` )
    } )

    describe( 'Token -> Create a new group LIVE (on-chain)', () => {
        it( 'should return a transaction id', async () => {
return
            let coins
            let groupData
            let groupid
            let nexaAddress
            let nullData
            let outpoint
            let params
            let publicKey
            let publicKeyHash
            let receivers
            let response
            let reversed
            let scriptData
            let scriptPubKey
            let tokens
            let txResult
            let userData
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY), 'mainnet')

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptData = encodeDataPush(publicKey)

            publicKeyHash = ripemd160.hash(sha256.hash(scriptData))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('COINS', coins)

            outpoint = (coins.find(_coin => {
                return typeof _coin.outpoint !== 'undefined' && _coin.outpoint.length === 64
            })).outpoint
            console.log('OUTPOINT', outpoint)

            params = {
                ticker: 'NEXAJS',
                name: `NexaJS.${uuidv4().slice(0, 8)}`,
                uri: 'https://nexajs.org/nexajs.json',
                hash: '1337000000000000000000000000000000000000000000000000000088888888',
                decimals: randomIntFromInterval(0, 8),
            }

            groupData = await getGroupDataScript(params)
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
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )

            /* Encode the public key hash into a P2PKH nexa address. */
            groupid = encodeAddress(
                'nexa',
                'GROUP',
                groupidBin,
            )
            console.log('GROUP ID', groupid)
            // expect(nexaAddress).to.equal('nexa:tphe6nttre86dj4ulyppwqd7jmeamemnjkkwl3f5d7fl4zrxmyqqqn8made6x')




            tokens = await getTokens(wif)
                .catch(err => console.error(err))
            console.log('TOKENS', tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            tokens = tokens.filter(_token => {
                // return _token.tokenidHex === TOKEN_ID_HEX
                return _token.tokenidHex === groupid
            })
            console.log('TOKENS (filtered):', tokens)

            userData = [
                'NexaJS\tUnitTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            // nullData = encodeNullData(userData)
            // console.log('HEX DATA-1', binToHex(nullData))
            // console.log('HEX DATA-2', binToHex(groupData))

            receivers = [
                {
                    data: groupData,
                },
                {
                    address: NEXA_RECEIVING_ADDRESS,
                    tokenid: binToHex(groupidBin), // TODO Allow auto-format conversion.
                    tokens: BigInt(reversed),
                },
                // {
                //     data: nullData,
                // },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendToken(coins, tokens, receivers)
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

        } ).timeout(30000) // FIXME Remove magic number.

    } )

    describe( 'Purse -> UTXO -> Send Token', async () => {
        it( 'should prepare and sign a (token) UTXO for broadcast to the network', async () => {
// return
            let coins
            let nexaAddress
            let nullData
            let publicKey
            let publicKeyHash
            let receivers
            let response
            let scriptPubKey
            let scriptPushPubKey
            let tokens
            let txResult
            let userData
            let wif

            /* Encode Private Key WIF. */
            wif = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY), 'mainnet')

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            scriptPushPubKey = encodeDataPush(publicKey)

            publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))

            scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            coins = await getCoins(wif)
                .catch(err => console.error(err))
            // console.log('\n  Coins:', coins)

            tokens = await getTokens(wif)
                .catch(err => console.error(err))
            // console.log('\n  Tokens:', tokens)

            /* Filter tokens. */
            // NOTE: Currently limited to a "single" Id.
            tokens = tokens.filter(_token => {
                return _token.tokenidHex === TOKEN_ID_HEX
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
                    address: NEXA_RECEIVING_ADDRESS,
                    tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: TOKENS,
                },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            // console.log('\n  Receivers:', receivers)

            /* Send UTXO request. */
            response = await sendToken(coins, tokens, receivers)
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
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
