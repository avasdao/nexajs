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

const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'
const SAMPLE_NULL_DATA = '6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054' // Token creation for NexaJS

const MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
const AVAS_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const AVAS_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
const STUDIO_ID = 'nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8'
const STUDIO_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000'
const SATOSHIS = 1337n
const TOKENS = 1337n

const RECYCLING_HEX = '00cd00c788' // OG
const RECYCLING_GROUP_HEX = '00cd82777601380141a56900cd7c0115947f7701147f7588' // OG

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
            // if (process.env.TESTNET) {
            //     prefix = 'nexatest'
            // } else if(process.env.REGTEST) {
            //     prefix = 'nexareg'
            // } else {
            //     prefix = 'nexa'
            // }
            // console.log('PREFIX', prefix)

            /* Parse WIF. */
            // parsed = await parseWif(process.env.ALICE_WIF, prefix)
            // console.log('PARSED', parsed)

            /* Set (primary) address. */
            // primaryAddress = parsed.address

            /* Parse WIF. */
            // parsed = await parseWif(process.env.BOB_WIF, prefix)
            // console.log('PARSED', parsed)

            /* Set (primary) address. */
            // providerAddress = parsed.address

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = new Uint8Array([
                OP.TXOUTPUTCOUNT,
                OP.THREE,
                OP.NUMEQUALVERIFY,
            ])
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160(sha256(lockingScript))
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

            await sleep(5000) // pause 5 seconds (for RPC avail)
        } ).timeout(10000) // FIXME Remove magic number.
    } )
return
    describe( 'Script -> Recycling -> Restrict Receiver', async () => {
        it( 'should prepare a RECYCLING TX for restricting asset recipient', async () => {
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
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

//----------------------------------

            // NOTE: NexScript v0.1.0 offers a less-than optimized version
            //       of this (script) contract (w/ the addition of `OP_SWAP`).
            lockingScript = hexToBin(RECYCLING_GROUP_HEX)
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160.hash(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                OP.ZERO, // arguments hash or empty stack item
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            contractAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Contract address:', contractAddress)

            coins = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            tokens = await getTokens(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Tokens:', tokens)

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
                    address: contractAddress,
                    tokenid: STUDIO_ID_HEX,
                    tokens: 1000n,
                },
                // {
                //     address: NEXA_RECEIVING_ADDRESS,
                //     tokenid: STUDIO_ID_HEX,
                //     tokens: 1000n,
                // },
                {
                    address: contractAddress,
                    satoshis: 1000n,
                },
                // {
                //     address: NEXA_RECEIVING_ADDRESS,
                //     satoshis: 1000n,
                // },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: contractAddress,
            })
            console.log('\n  Receivers:', receivers)

            lockingScript = encodeDataPush(lockingScript)

            // unlockingScript = hexToBin('001473b2d85ec2d628e07d24dd0a4001faaabadfe1bf00')
            // unlockingScript = hexToBin('001414e8681b13a7516bca88d780a541d20f230000ee00')
            unlockingScript = encodeDataPush(scriptHash)

            /* Send UTXO request. */
            response = await sendTokens({
                coins,
                tokens,
                receivers,
                // lockTime,
                // sequence: 0x400001, // set (timestamp) flag + 1 (512-second) cycle
                locking: lockingScript,
                unlocking: unlockingScript,
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

    describe( 'Script -> UTXO -> Send Tokens w/ Script', async () => {
        it( 'should prepare and sign a (Script) UTXO for broadcast to the network', async () => {
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
                OP.FROMALTSTACK,
                OP.FROMALTSTACK,            // un-optimized version
                    OP.SWAP,                // un-optimized version
                    OP.CHECKSEQUENCEVERIFY,
                        OP.DROP,
                // OP.FROMALTSTACK,            // optimized version
                    OP.CHECKSIGVERIFY,
            ])
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160.hash(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            constraintData = encodeDataPush(publicKey)
            console.log('\n  Arguments Data:', constraintData)

            constraintHash = ripemd160.hash(sha256(constraintData))
            // console.log('CONSTRAINT HASH:', constraintHash)
            console.log('CONSTRAINT HASH (hex):', binToHex(constraintHash))

            /* Reques header's tip. */
            headersTip = await getTip()
            // console.log('HEADERS TIP', headersTip)

            /* Set block height. */
            // blockHeight = Number(headersTip.height)
            // blockHeight = 343350
            // console.log('BLOCK HEIGHT', blockHeight)

            /* Set block height (script). */
            // FIXME Use a "better" method (but good until block 0xFFFFFF).
            // blockHeightScript = hexToBin(reverseHex(
            //     blockHeight
            //         .toString(16)
            //         .padStart(6, '0') // 12-bits
            // ))
            // console.log('BLOCK HEIGHT (script):', blockHeightScript)

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                ...encodeDataPush(constraintHash),  // arguments hash
                // ...encodeDataPush(blockHeightScript), // block height (script)
                ...encodeDataPush(hexToBin('010040')), // relative-time block (512 seconds ~8.5mins)
                // ...encodeDataPush(hexToBin('4e4558414a53')), // NEXAJS (service id)
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('\n  Nexa address:', nexaAddress)

            coins = await getCoins(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            tokens = await getTokens(wif, scriptPubKey)
                .catch(err => console.error(err))
            console.log('\n  Tokens:', tokens)

            /* Calculate the total balance of the unspent outputs. */
            // FIXME: Add support for BigInt.
            unspentTokens = tokens
                .reduce(
                    (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
                )
            console.log('UNSPENT TOKENS', unspentTokens)

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
                    address: NEXA_DUMP_ADDRESS,
                    satoshis: SATOSHIS,
                },
                // {
                //     address: NEXA_DUMP_ADDRESS,
                //     tokenid: AVAS_ID_HEX, // TODO Allow auto-format conversion.
                //     tokens: 1n,
                // },
            ]

            // FIXME: FOR DEV PURPOSES ONLY
            receivers.push({
                address: nexaAddress,
            })
            console.log('\n  Receivers:', receivers)

            lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            lockingScript = encodeDataPush(lockingScript)

            /* Send UTXO request. */
            response = await sendCoins({
                coins,
                // tokens,
                receivers,
                lockTime,
                sequence: 0x400001, // set (timestamp) flag + 1 (512-second) cycle
                locking: lockingScript,
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

    describe( 'Script -> UTXO -> Send Coins w/ Script', async () => {
        it( 'should prepare and sign a (Script) UTXO for broadcast to the network', async () => {
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
                OP.FROMALTSTACK,
                    OP.FROMALTSTACK,    // un-optimized version
                    OP.SWAP,            // un-optimized version
                    OP.CHECKSEQUENCEVERIFY,
                        OP.DROP,
                // OP.FROMALTSTACK,        // optimized version
                    OP.CHECKSIGVERIFY,
            ])
            console.info('\n  Script / Contract:', binToHex(lockingScript))

            scriptHash = ripemd160.hash(sha256(lockingScript))
            // console.log('SCRIPT HASH:', scriptHash)
            console.log('SCRIPT HASH (hex):', binToHex(scriptHash))

            /* Derive the corresponding public key. */
            publicKey = secp256k1.derivePublicKeyCompressed(hexToBin(PRIVATE_KEY))
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            constraintData = encodeDataPush(publicKey)
            console.log('\n  Arguments Data:', constraintData)

            constraintHash = ripemd160.hash(sha256(constraintData))
            // console.log('CONSTRAINT HASH:', constraintHash)
            console.log('CONSTRAINT HASH (hex):', binToHex(constraintHash))

            /* Reques header's tip. */
            headersTip = await getTip()
            // console.log('HEADERS TIP', headersTip)

            /* Set block height. */
            // blockHeight = Number(headersTip.height)
            // blockHeight = 343350
            // console.log('BLOCK HEIGHT', blockHeight)

            /* Set block height (script). */
            // FIXME Use a "better" method (but good until block 0xFFFFFF).
            // blockHeightScript = hexToBin(reverseHex(
            //     blockHeight
            //         .toString(16)
            //         .padStart(6, '0') // 12-bits
            // ))
            // console.log('BLOCK HEIGHT (script):', blockHeightScript)

            /* Build script public key. */
            scriptPubKey = new Uint8Array([
                OP.ZERO, // groupid or empty stack item
                ...encodeDataPush(scriptHash), // script hash
                ...encodeDataPush(constraintHash),  // arguments hash
                // ...encodeDataPush(blockHeightScript), // block height (script)
                ...encodeDataPush(hexToBin('010040')), // relative-time block (512 seconds ~8.5mins)
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            nexaAddress = encodeAddress(
                prefix,
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

            lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendCoins({
                coins,
                receivers,
                lockTime,
                sequence: 0x400001, // set (timestamp) flag + 1 (512-second) cycle
                locking: lockingScript,
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

    describe( 'errors', () => {
        it( 'should fail to return an opcode', () => {
            expect(OP.UNKNOWN256).to.not.exist
        } )
    } )

} )
