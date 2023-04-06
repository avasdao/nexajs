/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Crypto } from '../index.js'

/* Import (individual) modules. */
import { randomBytes } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Crypto Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Crypto' class.` )
    } )

    describe( 'RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
