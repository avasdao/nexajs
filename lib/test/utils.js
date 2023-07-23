/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Utils } from '../index.js'

/* Import (individual) modules. */
import { bigIntToBinUint16LE } from '../index.js'
import { bigIntToBinUint32LE } from '../index.js'
import { bigIntToBinUint64LE } from '../index.js'
import { bigIntToCompactUint } from '../index.js'
import { binToHex } from '../index.js'
import { hexToBin } from '../index.js'
import { reverseHex } from '../index.js'

const TEST_BYTES = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'
const TEST_BINARY = new Uint8Array([21, 31, 41])
const TEST_HEX = '151f29'
const REVERSED_VERIFY = '3c39abc47e102a7258da4834ed51392c2fb0764222841fd3d7cc08a9202eeb3f'

const TEST_ARRAY_64_BIT = [ 57, 5, 0, 0, 0, 0, 0, 0 ]
const TEST_ARRAY_32_BIT = [ 57, 5, 0, 0 ]
const TEST_ARRAY_16_BIT = [ 57, 5 ]

describe( 'Utils Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Utils' class.` )
    } )

    describe( 'Reverse HEX', () => {
        /* Reverse the bytes of the Hex string. */
        const reversedByClass = Utils.reverseHex(TEST_BYTES)

        it( 'should reverse the bytes of a Hex string (by Class)', () => {
            expect(reversedByClass).to.equal(REVERSED_VERIFY)
        } )

        /* Reverse the bytes of the Hex string. */
        const reversedByMethod = reverseHex(TEST_BYTES)

        it( 'should reverse the bytes of a Hex string (by Method)', () => {
            expect(reversedByMethod).to.equal(REVERSED_VERIFY)
        } )
    } )

    describe( 'Binary to Hex', () => {
        /* Reverse the bytes of the Hex string. */
        const hex = binToHex(TEST_BINARY)

        it( 'should convert a binary value to hex', () => {
            expect(hex).to.equal(TEST_HEX)
        } )
    } )

    describe( 'Hex To Binary', () => {
        /* Reverse the bytes of the Hex string. */
        const bin = hexToBin(TEST_HEX)

        it( 'should convert a hex value to binary', () => {
            expect(bin[0]).to.equal(21)
            expect(bin[1]).to.equal(31)
            expect(bin[2]).to.equal(41)
        } )
    } )

    describe( 'Big Integer to Compact UInt', () => {
        it( 'should offer a compact version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testBytes = BigInt(252)

            expect(bigIntToCompactUint(testBytes)).to.eql(new Uint8Array([ 252 ]))
        } )

        it( 'should offer a compact version of a (large) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testBytes = BigInt(255)

            expect(bigIntToCompactUint(testBytes)).to.eql(new Uint8Array([ 253, 255, 0 ]))
        } )
    } )

    describe( 'Big Integer to Unsigned 64-bit', () => {
        it( 'should offer a 64-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint64LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_64_BIT))
        } )

    } )

    describe( 'Big Integer to Unsigned 32-bit', () => {
        it( 'should offer a 32-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint32LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_32_BIT))
        } )

    } )

    describe( 'Big Integer to Unsigned 16-bit', () => {
        it( 'should offer a 16-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint16LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_16_BIT))
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
