/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Meta } from '../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../index.js'

const NEXA_TEST_PARAM = 'someval'
const TESTNET_ADMIN_ADDR = '0x27a9b30dbe015842098f4cd31f0301a1cee74bfe'

describe( 'Meta Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Meta' class.` )
    } )

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
            const balance = await meta.getBalance(TESTNET_ADMIN_ADDR)
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
