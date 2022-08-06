'use strict'

const { assert } = require('chai')
var addon = require('bindings')('addon');

describe( '(Native) Add-on Test Suite', function () {
    before( function () {
        console.info( `  ↳ targeting all of the 'local functionality' of 'addon.cpp'` )
    } )

    after( function () {
        // cleanup
    } )

    describe( 'greeting', function () {
        it( 'should return `hi there!` when called', function () {
            assert.equal( addon.hello(), 'hi there!' )
        } )
    } )

    // describe( 'async', function () {
    //     it( 'should return `hi there!` when called', function (done) {
    //         addon.hello((_err, _resp) => {
    //             if (_err) return done(_err)
    //
    //             assert.equal( _resp, 'hi there!' )
    //
    //             done()
    //         })
    //     } )
    // } )

    describe( 'error', function () {
        it( 'should return an error', function () {
            assert.notEqual( addon.hello(), 'hello' )
        } )
        // it( 'should return an error', function () {
        //     assert.throws( addon.badd, {
        //         name: 'Error',
        //         message: 'it blowed up'
        //     } )
        // } )
    } )
} )
