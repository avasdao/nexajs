/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Blank } from '../../index.js'

/* Import (individual) modules. */
import {
    Wallet,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

describe( 'Wallet Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Wallet' class.` )
    } )

    describe( 'Wallet -> Method', () => {
        it( 'should do something useful', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myWallet = new Wallet(params)
            console.log('WALLET', wallet)

            const address = myWallet.getAddress(2)
            console.log('ADDRESS #2', address)

            expect(address).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    // describe( 'Wallet -> getAddress', () => {
    //     it( 'should do something useful', () => {
    //         /* Set parameters. */
    //         // const params = {}
    //
    //         /* TBD. */
    //         const address = getAddress('')
    //         console.log('ADDRESS', address)
    //
    //         expect(address).to.equal(NEXA_TEST_PARAM)
    //     } )
    // } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
