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
    PRIVATE_KEY,
} from '../test_vectors.js'

/* Initialize globals. */
let address
let wallet

describe( 'Wallet Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Wallet' class.` )
    } )

    describe( 'Wallet -> Method', () => {
        it( 'should do something useful', async () => {


            /* TBD. */
            // const wallet = await Wallet.init(false)
            // wallet = new Wallet(PRIVATE_KEY)
            wallet = new Wallet('easily choose wasp cherry repeat arrive harbor castle library poverty jaguar lecture')
            console.log('WALLET', wallet)

            expect(wallet).to.be.an('object')

            address = wallet.getAddress(0)
            console.log('ADDRESS #0', address)
            expect(address).to.equal('nexa:nqtsq5g5084n9vxhzkpssype9fkp73tksn0xt2lylet24rxq')

            address = wallet.getAddress(1)
            console.log('ADDRESS #1', address)
            expect(address).to.equal('nexa:nqtsq5g5jhdj6mgtxucumqgkvcvtmyvypksvq80ajyjz4hgc')

            address = wallet.getAddress(2)
            console.log('ADDRESS #2', address)
            expect(address).to.equal('nexa:nqtsq5g5egfffxf4eapaht7n906w0c3uj8wcgzxl0eza5ph4')
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
