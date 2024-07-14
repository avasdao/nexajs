/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Utils } from '../../index.js'

/* Import (individual) modules. */
import {
    base58ToBin,
    bigIntToBinUint16LE,
    bigIntToBinUint32LE,
    bigIntToBinUint64LE,
    bigIntToCompactUint,
    binToBase58,
    binToHex,
    binToUtf8,
    flattenBinArray,
    hexToBin,
    numberToBinUint16LE,
    numberToBinUint32LE,
    reverseHex,
    sleep,
    utf8ToBin,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    REVERSED_VERIFY,

    SLEEP_DURATION,
    TIMEOUT,

    TEST_BYTES,
    TEST_BINARY,
    TEST_HEX,
    TEST_ARRAY_64_BIT,
    TEST_ARRAY_32_BIT,
    TEST_ARRAY_16_BIT,
} from '../test_vectors.js'

/* Initialize globals. */
let result

describe( 'Utils (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Utils' class.` )
    } )

    describe( 'Utils -> base58ToBin', () => {
        it( 'should convert a BASE58 string to BINARY', () => {
            // TBD
            const testVal = 'zst15Lo6otE4' // Nexa FTW!
            const binVal = base58ToBin(testVal)
            // console.log('BASE58BIN', binVal)

            expect(binToHex(binVal)).to.eq('4e6578612046545721')
        } )

    } )

    describe( 'Utils -> bigIntToBinUint16LE', () => {
        it( 'should offer a 16-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint16LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_16_BIT))
        } )

    } )

    describe( 'Utils -> bigIntToBinUint32LE', () => {
        it( 'should offer a 32-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint32LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_32_BIT))
        } )

    } )

    describe( 'Utils -> bigIntToBinUint64LE', () => {
        it( 'should offer a 64-bit version of a (small) big integer', () => {
            /* Reverse the bytes of the Hex string. */
            const testVal = 1337n

            expect(bigIntToBinUint64LE(testVal)).to.eql(new Uint8Array(TEST_ARRAY_64_BIT))
        } )

    } )

    describe( 'Utils -> bigIntToCompactUint', () => {
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

    describe( 'Utils -> binToBase58', () => {
        it( 'should convert a BINARY string to BASE58', () => {
            // TBD
            const testVal = hexToBin('4e6578612046545721') // Nexa FTW!
            const base58Val = binToBase58(testVal)
            // console.log('BINBASE58', base58Val)

            expect(base58Val).to.eq('zst15Lo6otE4')
        } )

    } )

    describe( 'Utils -> binToHex', () => {
        /* Reverse the bytes of the Hex string. */
        const hex = binToHex(TEST_BINARY)

        it( 'should convert a binary value to hex', () => {
            expect(hex).to.equal(TEST_HEX)
        } )
    } )

    describe( 'Utils -> binToUtf8', () => {
        it( 'should convert a BINARY string to UTF-8', () => {
            // TBD
            const testVal = hexToBin('4e6578612046545721') // Nexa FTW!
            const utf8Val = binToUtf8(testVal)
            // console.log('BINUTF8', utf8Val)

            expect(utf8Val).to.eq('Nexa FTW!')
        } )

    } )

    describe( 'Utils -> flattenBinArray', () => {
        it( 'should flatten 2x Uint8Array arrays into 1', () => {
            /* Reverse the bytes of the Hex string. */
            const first = new Uint8Array([ 0x13, 0x37 ])
            const second = new Uint8Array([ 0xbe, 0xef ])

            const joined = flattenBinArray([first, second])
            // console.log('JOINED', joined)

            expect(joined).to.eql(hexToBin('1337beef'))
        } )

    } )

    describe( 'Utils -> hexToBin', () => {
        /* Reverse the bytes of the Hex string. */
        const bin = hexToBin(TEST_HEX)

        it( 'should convert a hex value to binary', () => {
            expect(bin[0]).to.equal(21)
            expect(bin[1]).to.equal(31)
            expect(bin[2]).to.equal(41)
        } )
    } )

    describe( 'Utils -> numberToBinUint16LE', () => {
        // TBD
        const num = 1337
        const uint = numberToBinUint16LE(num)

        it( 'should convert a Number to (binary) Uint16LE', () => {
            expect(uint).to.eql(new Uint8Array(TEST_ARRAY_16_BIT))
        } )
    } )

    describe( 'Utils -> numberToBinUint32LE', () => {
        // TBD
        const num = 1337
        const uint = numberToBinUint32LE(num)

        it( 'should convert a Number to (binary) Uint32LE', () => {
            expect(uint).to.eql(new Uint8Array(TEST_ARRAY_32_BIT))
        } )
    } )

    describe( 'Utils -> reverseHex', () => {
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

    describe( 'Utils -> sleep', async () => {
return
        it( 'should sleep for 5 seconds', async () => {
            /* Pause for 5 seconds. */
            result = await Utils.sleep(SLEEP_DURATION)
            expect(result).to.equal(undefined)
        } ).timeout(TIMEOUT)

        it( 'should sleep (again) for 5 seconds', async () => {
            /* Pause (again) for 5 seconds. */
            result = await sleep(SLEEP_DURATION)
            expect(result).to.equal(undefined)
        } ).timeout(TIMEOUT)
    } )

    describe( 'Utils -> utf8ToBin', () => {
        it( 'should convert a BINARY string to UTF-8', () => {
            // TBD
            const testVal = 'Nexa FTW!'
            const binVal = utf8ToBin(testVal)
            // console.log('UTF8BIN', binVal)

            expect(binToHex(binVal)).to.eq('4e6578612046545721') // Nexa FTW!
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
