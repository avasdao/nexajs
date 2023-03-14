/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Blank } from '../index.js'

/* Import (individual) modules. */
// import { classMethod } from '../index.js'

describe( 'Class Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Class' class.` )
    } )

    describe( 'Class -> Method', () => {
        /* Encode the address components. */
        const address = new Address(NEXA_TEST_ADDRESS)

        it( 'should initialize an address from a seed', () => {
            expect(address.toString().seed).to.equal(NEXA_TEST_ADDRESS)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
