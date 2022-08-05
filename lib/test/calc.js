"use strict"

const assert = require( "assert" )
const calc = require( "../src/js/calc" )

describe( "Calculator", () => {
    // before( () => {
    //     console.log( "before executes once before all tests" )
    // } )

    // after( () => {
    //     console.log( "after executes once after all tests" )
    // } )

    describe( "adding", () => {
        it( "should return 4 when adding 2 + 2", () => {
            assert.equal( calc.add( 2, 2 ), 4 )
        } )

        it( "should return 0 when adding zeros", () => {
            assert.equal( calc.add( 0, 0 ), 0 )
        } )
    } )

    describe( "error", () => {
        it( "should return an error", () => {
            assert.throws( calc.badd, {
                name: "Error",
                message: "it blowed up"
            } )
        } )
    } )
} )
