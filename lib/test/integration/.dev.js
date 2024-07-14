/* Import (test) modules. */
import { expect } from 'chai'

import { getOutpoint } from '@nexajs/rostrum'

/* Import class. */
// import { Blank } from '../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../index.js'

/* Import test(-ing) vectors. */
import {
    SAMPLE_OUTPOINT,
    TIMEOUT,
} from '../test_vectors.js'

/* Initialize globals. */
let result

describe( 'Class Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Class' class.` )
    } )

    describe( 'Market -> payPartialOffer', () => {
        it( 'should complete the payment on a partially signed offer', async () => {
            /* Set parameters. */
            // const params = {}

            /* TBD. */
            // result = await getOutpoint('3c1aa38e1f96ab10ddbb91b166ad7111e713f5cd5fd24081bbae8f7a5737a956')
            result = await getOutpoint(SAMPLE_OUTPOINT)
                .catch(err => console.error(err))
            console.log('RESULT', result)

            expect(myClass).to.equal(NEXA_TEST_PARAM)
        } ).timeout(TIMEOUT*3)
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
