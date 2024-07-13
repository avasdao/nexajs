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
import { getCoins } from '@nexajs/purse'

import { getTip } from '@nexajs/rostrum'

import { getTokens } from '@nexajs/token'

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
    NEXA_FOR_EVERYONE,
    NEXA_FOR_EVERYONE_HEX,
    SAMPLE_NULL_DATA,
} from '../test_vectors.js'

const sleep = ms => new Promise(r => setTimeout(r, ms))

describe( 'Script (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Script' class.` )
    } )

    describe( 'Script -> Class', () => {
        it( 'should create EMPTY script', () => {
            const empty = Script.empty()
            // console.log('EMPTY', empty)

            expect(empty.data).to.be.an('array')
            expect(empty.toString()).to.equal('')
            expect(empty.length).to.equal(0)
        } )

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

    describe( 'Script -> OP', () => {
        it( 'should match the ZERO opcode', () => {
            expect(OP.ZERO).to.equal(0x00)
        } )

        it( 'should match the RETURN opcode', () => {
            expect(OP.RETURN).to.equal(0x6a)
        } )

        it( 'should match the EXEC opcode', () => {
            expect(OP.EXEC).to.equal(0xed)
        } )

        it( 'should Get smart contract signature and output the RIPEMD-160 for a smart contract', async () => {
            let lockingScript

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

            const hash = ripemd160(sha256(lockingScript))
            // console.log('HASH (data):', binToHex(hash))

            // expect(hash.chunks).to.be.a('Uint8Array')
            expect(binToHex(hash)).to.equal('f035355b343cb84354ec8a45afa843077c5d3b98')
            // expect(binary.length).to.equal(2)
        } )
    } )

    describe( 'Script -> encodeNullData', () => {
        it( 'should encode NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE)
            // console.log('NULL DATA', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )

        it( 'should encode NULL data (Array)', () => {
            const nullData = encodeNullData([NEXA_FOR_EVERYONE, NEXA_FOR_EVERYONE])
            // console.log('NULL DATA (2X)', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )

        it( 'should encode NULL data (HEX)', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE_HEX)
            // console.log('NULL DATA (FTW)', binToHex(nullData))

            const match = new Uint8Array([
                OP.RETURN,
                ...encodeDataPush(hexToBin(NEXA_FOR_EVERYONE_HEX)),
            ])

            expect(nullData).to.eql(match)
        } )

        it( 'should encode NULL data (BINARY)', () => {
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

    describe( 'Script -> decodeNullData', () => {
        // it( 'should decode NULL data (HEX)', () => {
        //     const decoded = decodeNullData(SAMPLE_NULL_DATA)
        //     console.log('DECODED', decoded);
        //
        //     expect(decoded).to.equal(NEXA_FOR_EVERYONE_HEX)
        // } )
    } )

    describe( 'errors', () => {
        it( 'should fail to return an opcode', () => {
            expect(OP.UNKNOWN256).to.not.exist
        } )
    } )

} )
