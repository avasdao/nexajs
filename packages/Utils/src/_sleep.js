/**
 * Sleep
 *
 * Promise based sleep function.
 */
const sleep = (_ms) => {
    return new Promise(resolve => setTimeout(resolve, _ms))
}

/* Export module. */
module.exports = sleep
