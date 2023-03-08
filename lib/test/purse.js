/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Import class. */
import { Purse } from '../index.js'

/* Import (Class) modules. */
import { sendUtxo } from '../index.js'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'adding', () => {
        // it( 'should return 4 when adding 2 + 2', () => {
        //     assert.equal( utils.add( 2, 2 ), 4 )
        // } )

        // it( 'should return 0 when adding zeros', () => {
        //     assert.equal( utils.add( 0, 0 ), 0 )
        // } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
