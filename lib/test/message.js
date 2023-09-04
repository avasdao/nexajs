/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Message } from '../index.js'

/* Import (individual) modules. */
import {
    signMessage,
    verifyMessage,
} from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Message Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Message' class.` )
    } )

    describe( 'Message -> Method', () => {
        it( 'should do something useful', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myMessage = new Message(params)

            expect(myMessage).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
