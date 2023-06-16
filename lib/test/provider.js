/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Provider } from '../index.js'

/* Import (individual) modules. */
import { broadcast } from '../index.js'

const SAMPLE_RAW_TX = '0001e405cfdb6865fbbf6ef6a2328d13b599d57f1736634ce81608375759f7db98ca6441850f48143a95b3225ede77a81d985cd0468d58b3fe91cd163c3e522ef677c92ba330c2ef72c45562cc70c6194a3aa4f4a93c04c5f55bfbe5375ea43e4de66226002102bd3f95e1b1b90286955c5f99d804b9baa8f825bf9bbcb087aa3b5546d5eb0c7d0000000039050000000000000100000000'

describe( 'Provider Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Provider' class.` )
    } )

    describe( 'Provider -> Broadcast', () => {
        it( 'should attempt to broadcast a transaction', async () => {
            const response = await broadcast(SAMPLE_RAW_TX)
                .catch(err => console.error(err))
            console.log('BROADCAST', response)

            expect(response).to.be.an('object')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
