/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Transaction } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Transaction Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Transaction' class.` )
    } )

    describe( 'Transaction -> Create', () => {
        const params = {

        }
        /* TBD. */
        const transaction = new Transaction(params)

        it( 'should return a transaction object', () => {
            expect(transaction).to.be.an('object')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
