/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Pedersen } from '../../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

describe( 'Zero Knowledge Protocol Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Zero Knowledge Protocol' class.` )
    } )

    describe( 'ZKP -> Pedersen', () => {
        it( 'should initialize a Pedersen commitment', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myZkp = new Pedersen(1, 539)
            // console.log('PEDERSEN (g)', myZkp.g)

            expect(myZkp.g.value).to.equal(BigInt(1337))
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
