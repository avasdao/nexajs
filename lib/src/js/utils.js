"use strict"

// FOR DEMONSTRATION PURPOSES ONLY
module.exports = {
    // Add
    add: ( num1, num2 ) => {
        return num1 + num2
    },

    // Force error.
    badd: () => {
        throw new Error( 'it blowed up' )
    }
}
