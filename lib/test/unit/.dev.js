/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Blank } from '../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../index.js'

/* Import test(-ing) vectors. */
import {
    SAMPLE_INPUT,
} from '../test_vectors.js'

describe( 'Singleton Test', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Class' class.` )
    } )

    describe( 'Market -> payPartialOffer', () => {
        it( 'should complete the payment on a partially signed offer', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myClass = new Class(params)

            expect(myClass).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
