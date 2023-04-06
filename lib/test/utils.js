/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Utils } from '../index.js'

/* Import (individual) modules. */
import { bigIntToCompactUint } from '../index.js'
import { Opcodes } from '../index.js'
import { randomBytes } from '../index.js'
import { reverseHex } from '../index.js'

const TEST_BYTES = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'

const REVERSED_VERIFY = '3c39abc47e102a7258da4834ed51392c2fb0764222841fd3d7cc08a9202eeb3f'

describe( 'Utils Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Utils' class.` )
    } )

    describe( 'Reverse bytes', () => {
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

    describe( 'RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Operation Codes', () => {
        it( 'should match the correct operation code to push 1 byte of data', () => {
            expect(Opcodes.OP_PUSHDATA_1).to.equal(0x4c)
        } )

        it( 'should match the correct operation code to move data from the alt stack', () => {
            expect(Opcodes.OP_FROMALTSTACK).to.equal(0x6c)
        } )
    } )

    describe( 'Reverse bytes', () => {
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

    describe( 'errors', () => {
        // TBD
    } )

} )
