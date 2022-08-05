'use strict'

const { assert } = require('chai')
const { cashlib } = require('../bindings')

describe( "CashLib Test Suite #1", function () {
    before( function () {
        console.info( `  ↳ targeting all of the "local functionality" of 'cashlib.cc'` )
    } )

    after( function () {
        // cleanup
    } )

    describe( "adding", function () {
        it( "should return `hi there!` when called", function (done) {
            cashlib.hello((_err, _resp) => {
                if (_err) return done(_err)

                assert.equal( _resp, 'hi there!' )

                done()
            })
        } )

        // it( "should return 0 when adding zeros", function () {
        //     assert.equal( calc.add( 0, 0 ), 0 )
        // } )
    } )

    describe( "error", function () {
        it( "should return an error", function (done) {
            cashlib.hello((_err, _resp) => {
                if (_err) return done(_err)

                assert.notEqual( _resp, 'hello' )

                done()
            })
        } )
        // it( "should return an error", function () {
        //     assert.throws( cashlib.badd, {
        //         name: "Error",
        //         message: "it blowed up"
        //     } )
        // } )
    } )
} )
