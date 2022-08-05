"use strict"

// FOR DEMONSTRATION PURPOSES ONLY
module.exports = {
    add: ( num1, num2 ) => {
        return num1 + num2
    },
    badd: () => {
        throw new Error( 'it blowed up' )
    }
}
