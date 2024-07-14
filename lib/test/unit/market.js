/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Market } from '../../index.js'

/* Import (individual) modules. */
import {
    getPrice,
    getQuote,
    getTicker,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

/* Initialize globals. */
let myMarket

describe( 'Market (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Market' class.` )
    } )

    describe( 'Market -> Class', () => {
        it( 'should instantiate a new Market instance', () => {
            /* Initialize new market. */
            myMarket = new Market()
            // console.log('\nMY MARKET', myMarket)

            expect(myMarket).to.be.an('object')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return an object', () => {
            /* Initialize new market. */
            myMarket = new Market()

            expect(myMarket).to.not.be.null
        } )
    } )

} )
