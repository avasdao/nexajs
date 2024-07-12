/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Blank } from '../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Class Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Class' class.` )
    } )

    describe( 'Class -> Method', () => {
        it( 'should do something useful', () => {
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
