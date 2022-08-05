"use strict"

const assert = require( "assert" )
const { cashlib } = require('../bindings')

console.log('\nCashlib', cashlib.hello((_err, _resp) => {
    console.log('Cashlib ERR', _err)
    console.log('Cashlib RESP', _resp)
}))

describe( "CashLib Suite #1", () => {
    before( () => {
        console.info( `  ↳ targeting all of the "local functionality" of 'cashlib.cc'` )
    } )

    // after( () => {
    //     console.log( "after executes once after all tests" )
    // } )

    describe( "adding", () => {
        it( "should return 4 when adding 2 + 2", () => {
            assert.equal( cashlib.hello(), 'hello' )
        } )

        // it( "should return 0 when adding zeros", () => {
        //     assert.equal( calc.add( 0, 0 ), 0 )
        // } )
    } )

    describe( "error", () => {
        it( "should return an error", () => {
            assert.notEqual( cashlib.hello(), 'hi there!' )
        } )
        // it( "should return an error", () => {
        //     assert.throws( cashlib.badd, {
        //         name: "Error",
        //         message: "it blowed up"
        //     } )
        // } )
    } )
} )
