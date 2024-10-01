/* Setup environment. */
import '../env.js'

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
    NEXA_TEST_ADDRESS,
    SAMPLE_RAW_TX,
} from '../test_vectors.js'

/* Initialize globals. */
let response

describe( 'Provider Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Provider' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Provider -> Broadcast', () => {
        it( 'should attempt to broadcast a transaction', async () => {
            response = await broadcast(SAMPLE_RAW_TX)
                .catch(err => console.error(err))
            // console.log('BROADCAST', response)

            expect(response).to.be.an('object')
        } )
    } )

    describe( 'Rostrum -> getAddressBalance', () => {
        it( 'should receive an OBJECT (by Class) from the REMOTE server', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-1', response)

            expect(response).to.be.an('object')
        } )

        it( 'should receive CONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-2', response)

            expect(response.confirmed).to.be.above(546)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-3', response)

            expect(response.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
