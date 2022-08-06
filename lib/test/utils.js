'use strict'

const { assert, expect } = require('chai')
const utils = require( '../src/js/utils' )

describe( '(JS) Utilities Test Suite', function () {
    before( function () {
        console.info( `  ↳ targeting all JavaScript utilities provided by 'utils.js'` )
    } )

    describe( 'adding', function () {
        it( 'should return 4 when adding 2 + 2', function () {
            assert.equal( utils.add( 2, 2 ), 4 )
        } )

        it( 'should return 0 when adding zeros', function () {
            assert.equal( utils.add( 0, 0 ), 0 )
        } )
    } )

    describe( 'error', function () {
        it( 'should return an error', function () {
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
