/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Markets } from '../index.js'

/* Import (individual) modules. */
// import { classMethod } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Markets Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Markets' class.` )
    } )

    describe( 'Markets -> Method', () => {
        /* TBD. */
        const myMarkets = new Markets(params)

        it( 'should do something useful', () => {
            expect(myMarkets).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
