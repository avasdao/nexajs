/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Utils } from '../index.js'

/* Import (individual) modules. */
import { reverseBytes } from '../index.js'

const TEST_BYTES = '3feb2e20a908ccd7d31f84224276b02f2c3951ed3448da58722a107ec4ab393c'

const REVERSED_VERIFY = '3c39abc47e102a7258da4834ed51392c2fb0764222841fd3d7cc08a9202eeb3f'

describe( 'Utils Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Utils' class.` )
    } )

    describe( 'bytes', () => {
        /* Reverse the bytes of the Hex string. */
        const reversedByClass = Utils.reverseBytes(TEST_BYTES)

        it( 'should reverse the bytes of a Hex string (by Class)', () => {
            expect(reversedByClass).to.equal(REVERSED_VERIFY)
        } )

        /* Reverse the bytes of the Hex string. */
        const reversedByMethod = reverseBytes(TEST_BYTES)

        it( 'should reverse the bytes of a Hex string (by Method)', () => {
            expect(reversedByMethod).to.equal(REVERSED_VERIFY)
        } )
    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
