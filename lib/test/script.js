/* Import (test) modules. */
import { expect } from 'chai'

import { encodeAddress } from '@nexajs/address'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

/* Import library modules. */
import {
    getCoins,
    sendCoin,
} from '@nexajs/purse'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import class. */
import { Script } from '../index.js'

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeNullData,
    OP,
} from '../index.js'

const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'

const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const SATOSHIS = 1337n

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()

describe( 'Script Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Script' class.` )
    } )

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

    describe( 'Script -> Group', () => {
        it( 'should match the GROUP opcode', () => {
            expect(OP.GROUP).to.equal(0xb6)
        } )
    } )

    describe( 'Script -> Encode NULL data', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE)
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX)
        } )
    } )

    describe( 'Script -> Encode NULL data (Array)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData([NEXA_FOR_EVERYONE, NEXA_FOR_EVERYONE])
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX + '1f' + NEXA_FOR_EVERYONE_HEX)
        } )
    } )

    describe( 'Script -> Encode NULL data (Tab)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE + '\tFTW!')
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX + '09' + '46545721')
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
            const ripemd160 = await instantiateRipemd160()

            const bin = hexToBin('6c7c6cb1756cad')
            // console.log('BINARY (data):', bin)

            const hash = ripemd160.hash(bin)
            // console.log('HASH (data):', binToHex(hash))

            // expect(hash.chunks).to.be.a('Uint8Array')
            expect(hash).to.equal('TODO')
            // expect(binary.length).to.equal(2)
        } )
    } )

    describe( 'Script -> UTXO -> Send Script', async () => {
        it( 'should prepare and sign a (Script) UTXO for broadcast to the network', async () => {
            /* Encode Private Key WIF. */
            const wif = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY), 'mainnet')
            // console.log('WALLET IMPORT FORMAT', wif)

            const script = new Uint8Array([
                OP.ONE,
                OP.THREE,
                OP.THREE,
                OP.SEVEN,
            ])
            console.info('\n  Script / Contract:', binToHex(script))

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            const scriptData = encodeDataPush(script)
            console.log('\n  Script Data:', scriptData)

            const scriptHash = ripemd160.hash(sha256.hash(scriptData))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(scriptHash))

            const scriptPubKey = new Uint8Array([
                OP.ZERO,
                ...encodeDataPush(scriptHash), // constraint
                ...encodeDataPush(scriptHash.reverse()),  // args
                ...encodeDataPush(hexToBin('199904')), // 301337
                OP.TWO,
            ])
            console.info('\n  Script Public Key:', binToHex(scriptPubKey))

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa',
                'TEMPLATE',
                encodeDataPush(scriptPubKey),
            )
            return console.info('\n  Nexa address:', nexaAddress)

            const coins = await getCoins(wif)
                .catch(err => console.error(err))
            console.log('\n  Coins:', coins)

            const userData = [
                'NexaJS\tUnitTest',
                uuidv4(),
            ]

            /* Initialize hex data. */
            const nullData = encodeNullData(userData)
            // console.log('HEX DATA', nullData)

            const receivers = [
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

            /* Set automatic fee (handling) flag. */
            const feeRate = 2.0

            /* Send UTXO request. */
            const response = await sendCoin(coins, receivers, feeRate)
            console.log('Send UTXO (response):', response)

            try {
                const txResult = JSON.parse(response)
                console.log('TX RESULT', txResult)

                if (txResult.error) {
                    return console.error(txResult.message)
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
