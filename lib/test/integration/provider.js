/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Provider } from '../../index.js'

/* Import (individual) modules. */
import {
    broadcast,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    SAMPLE_RAW_TX,
} from '../test_vectors.js'

describe( 'Provider Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Provider' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
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
