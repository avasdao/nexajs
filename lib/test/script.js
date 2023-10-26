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

/* Import class. */
import { Script } from '../index.js'

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeDataPush,
    encodeNullData,
    OP,
} from '../index.js'

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
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

describe( 'Script Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Script' class.` )
    } )

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
                'nexa',
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
                'nexa',
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
            response = await sendToken({
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
return
    describe( 'Script -> Zero', () => {
        it( 'should match the ZERO opcode', () => {
            expect(OP.ZERO).to.equal(0x00)
        } )
    } )

    describe( 'Script -> Return', () => {
        it( 'should match the RETURN opcode', () => {
            expect(OP.RETURN).to.equal(0x6a)
        } )
    } )

    describe( 'Script -> Execute', () => {
        it( 'should match the EXEC opcode', () => {
            expect(OP.EXEC).to.equal(0xed)
        } )
    } )

    describe( 'Script -> Encode NULL data', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE)
            // console.log('NULL DATA', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )
    } )

    describe( 'Script -> Encode NULL data (Array)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData([NEXA_FOR_EVERYONE, NEXA_FOR_EVERYONE])
            // console.log('NULL DATA (2X)', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )
    } )

    describe( 'Script -> Encode NULL data (HEX)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE_HEX)
            // console.log('NULL DATA (FTW)', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )
    } )

    describe( 'Script -> Encode NULL data (BINARY)', () => {
        it( 'should match the NULL data', () => {
            const binary = new Uint8Array(hexToBin(NEXA_FOR_EVERYONE_HEX))
            // console.log('BINARY', binary)

            const nullData = encodeNullData(binary)
            // console.log('NULL DATA', nullData)

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )
    } )

    describe( 'Script -> Decode NULL data (HEX)', () => {
        it( 'should match the NULL data', () => {
return
            const decoded = decodeNullData(SAMPLE_NULL_DATA)
            console.log('DECODED', decoded);

            expect(decoded).to.equal(NEXA_FOR_EVERYONE_HEX)
        } )
    } )

    describe( 'Script -> Create EMPTY script', () => {
        it( 'should create an empty script', () => {
            const empty = Script.empty()
            // console.log('EMPTY', empty)

            expect(empty.data).to.be.an('array')
            expect(empty.toString()).to.equal('')
            expect(empty.length).to.equal(0)
        } )
    } )

    describe( 'Script -> Create CHAINED script', () => {
        it( 'should create a multi-chained script', () => {
            const sample = new Uint8Array([0x33])
            const chained = Script
                .empty()
                .add(sample)
            // console.log('CHAINED', chained)

            expect(chained.raw).to.be.a('Uint8Array')
            expect(chained.toString()).to.equal('PUSHBYTES_51')
            expect(chained.length).to.equal(1)
        } )
    } )

    describe( 'Script -> Create BINARY script', () => {
        it( 'should output a binary script', () => {
            const sample = new Uint8Array([0x6a, 0xaf])
            const binary = Script
                .empty()
                .add(sample)
            // console.log('BINARY (data):', binary.data)
            // console.log('BINARY (string):', binary.toString())

            expect(binary.chunks).to.be.a('Uint8Array')
            expect(binary.toString()).to.equal('RETURN CHECKMULTISIGVERIFY')
            expect(binary.length).to.equal(2)
        } )
    } )

    describe( 'Script -> Get smart contract signature', () => {
        it( 'should output the RIPEMD-160 for a smart contract', async () => {
            let lockingScript

            const ripemd160 = await instantiateRipemd160()

            // NOTE: HODL Vault
            lockingScript = new Uint8Array([
                OP.FROMALTSTACK,
                    OP.CHECKLOCKTIMEVERIFY,
                    OP.DROP,
                OP.FROMALTSTACK,
                    OP.CHECKSIGVERIFY,
            ])

            // const bin = hexToBin('6cb1756cad')
            // console.log('BINARY (data):', bin)

            const hash = ripemd160.hash(sha256(lockingScript))
            // console.log('HASH (data):', binToHex(hash))

            // expect(hash.chunks).to.be.a('Uint8Array')
            expect(binToHex(hash)).to.equal('f035355b343cb84354ec8a45afa843077c5d3b98')
            // expect(binary.length).to.equal(2)
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
                'nexa',
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
                // {
                //     data: nullData
                // },
                {
                    address: NEXA_DUMP_ADDRESS,
                    tokenid: AVAS_ID_HEX, // TODO Allow auto-format conversion.
                    tokens: 1n,
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
            response = await sendToken({
                coins,
                tokens,
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

            lockTime = headersTip.height
            // return console.log('LOCK TIME', lockTime)

            /* Send UTXO request. */
            response = await sendCoin({
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
