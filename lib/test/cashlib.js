'use strict'

const { assert } = require('chai')
var cashlib = require('bindings')('cashlib');

describe( "CashLib Test Suite #1", function () {
    before( function () {
        console.info( `  ↳ targeting all of the "local functionality" of 'cashlib.cc'` )
    } )

    after( function () {
        // cleanup
    } )

    describe( "greeting", function () {
        it( "should return `hi there!` when called", function () {
            assert.equal( cashlib.hello(), 'hi there!' )
        } )
    } )

    // describe( "async", function () {
    //     it( "should return `hi there!` when called", function (done) {
    //         cashlib.hello((_err, _resp) => {
    //             if (_err) return done(_err)
    //
    //             assert.equal( _resp, 'hi there!' )
    //
    //             done()
    //         })
    //     } )
    // } )

    describe( "error", function () {
        it( "should return an error", function () {
            assert.notEqual( cashlib.hello(), 'hello' )
        } )
        // it( "should return an error", function () {
        //     assert.throws( cashlib.badd, {
        //         name: "Error",
        //         message: "it blowed up"
        //     } )
        // } )
    } )
} )
