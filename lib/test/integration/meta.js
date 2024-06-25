/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Meta } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    METANET_ADMIN_ADDR,
} from '../test_vectors.js'

describe( 'Meta Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Meta' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

return // FIXME All tests are disabled until NEXA SHELL ENDPOINT is restored!!
    describe( 'Meta -> Block -> Height', () => {
        it( 'should return the current block height', async () => {
            const meta = new Meta()
            const blockHeight = await meta.getBlockHeight()
            console.log('BLOCK HEIGHT', blockHeight)

            expect(blockHeight).to.be.gt(0)
        } )
    } )

    describe( 'Meta -> Account -> Balance', () => {
        it( 'should return an account balance', async () => {
            /* TBD. */
            const meta = new Meta()
            const balance = await meta.getBalance(METANET_ADMIN_ADDR)
            console.log('BALANCE (BigInt):', balance)
            console.log('BALANCE (string):', await balance.toString())

            expect(balance).to.be.a('BigInt')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
