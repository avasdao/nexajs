/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Request } from '../index.js'

/* Import (individual) modules. */
import { callUrl } from '../index.js'
// import { connectToEvents } from '../index.js'
// import { queryGraph } from '../index.js'
// import { queryRostrum } from '../index.js'
// import { subscribeToGraph } from '../index.js'
// import { subscribeToRostrum } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Request Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Request' class.` )
    } )

    describe( 'Request -> Block Data', () => {
        it( 'should return block details', async () => {
            /* TBD. */
            const response = await callUrl('https://nexa.sh/v1/block/200000')
                .catch(err => console.error(err))
            // console.log('RESPONSE', response)

            expect(response).to.be.an('object')
        } )

        it( 'should verify the HASH of the block', async () => {
            /* TBD. */
            const response = await callUrl('https://nexa.sh/v1/block/200000')
                .catch(err => console.error(err))
            // console.log('RESPONSE', response)

            expect(response.hash).to.equal('9ef5bc0a4cdd7e894c1a8496b25c206238dca9a4bdf79cca227f1807d37c8d99')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
