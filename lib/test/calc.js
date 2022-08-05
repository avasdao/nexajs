"use strict"

const assert = require( "assert" )
const calc = require( "../src/js/calc" )

describe( "Calculator", function () {
    // before( function () {
    //     console.log( "before executes once before all tests" )
    // } )

    // after( function () {
    //     console.log( "after executes once after all tests" )
    // } )

    describe( "adding", function () {
        it( "should return 4 when adding 2 + 2", function () {
            assert.equal( calc.add( 2, 2 ), 4 )
        } )

        it( "should return 0 when adding zeros", function () {
            assert.equal( calc.add( 0, 0 ), 0 )
        } )
    } )

    describe( "error", function () {
        it( "should return an error", function () {
            assert.throws( calc.badd, {
                name: "Error",
                message: "it blowed up"
            } )
        } )
    } )
} )
