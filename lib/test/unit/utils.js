/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Utils } from '../../index.js'

/* Import (individual) modules. */
import {
    bigIntToBinUint16LE,
    bigIntToBinUint32LE,
    bigIntToBinUint64LE,
    bigIntToCompactUint,
    binToHex,
    flattenBinArray,
    hexToBin,
    reverseHex,
    sleep,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    TEST_BYTES,
    TEST_BINARY,
    TEST_HEX,

    REVERSED_VERIFY,

    TEST_ARRAY_64_BIT,
    TEST_ARRAY_32_BIT,
    TEST_ARRAY_16_BIT,
} from '../test_vectors.js'

describe( 'Utils (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Utils' class.` )
    } )

    describe( 'Sleep for 5 seconds', async () => {
        /* Pause for 5 seconds. */
        await Utils.sleep(5000)

        /* Pause (again) for 5 seconds. */
        await sleep(5000)
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
            const testBytes = 252n

            expect(bigIntToCompactUint(testBytes)).to.eql(new Uint8Array([ 252 ]))
        } )

        it( 'should offer a compact version of a (large) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testBytes = 255n

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

    describe( 'Flatten an array of Uint8Array', () => {
        it( 'should join 2 Uint8Array into 1', () => {
            /* Reverse the bytes of the Hex string. */
            const first = new Uint8Array([ 0x13, 0x37 ])
            const second = new Uint8Array([ 0xbe, 0xef ])

            const joined = flattenBinArray([first, second])
            console.log('JOINED', joined)

            expect(joined).to.eql(hexToBin('1337beef'))
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
