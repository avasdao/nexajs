/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Privacy } from '../../index.js'

/* Import (individual) modules. */
import {
    sendToPeer,
    // classMethod2,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

/* Initialize locals. */
let result

describe( 'Privacy Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Privacy' class.` )
    } )

    describe( 'Privacy -> Class', () => {
        it( 'should initialize the privacy CLASS', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myPrivacy = new Privacy(params)
            // console.log('PRIVACY', myPrivacy)

            expect(myPrivacy).to.an('object')
        } )
    } )

    describe( 'Privacy -> sendToPeer', () => {
        it( 'should send a message to a PEER', async () => {
            /* Send (message) to peer. */
            result = await sendToPeer()
            // console.log('RESULT', result)

            expect(result.id).to.equal('80701f7f-b027-43b4-83d8-3f3170b90229')
            expect(result.msg).to.equal('sent!')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
