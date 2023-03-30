/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { App } from '../index.js'

/* Import (individual) modules. */
import { createSession } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Application Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Application' class.` )
    } )

    describe( 'App -> Method', () => {
        /* TBD. */
        const myApp = new App(params)

        it( 'should do something useful', () => {
            expect(myApp).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
