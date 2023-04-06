/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Wallet } from '../index.js'

/* Import (individual) modules. */
// import { createSession } from '../index.js'

const NEXA_TEST_PARAM = 'nexa:SampleAddress'

describe( 'Wallet Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Wallet' class.` )
    } )

    describe( 'Wallet -> Method', () => {
        /* TBD. */
        const myWallet = new Wallet()

        it( 'should do something useful', () => {
            expect(myWallet.address).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
