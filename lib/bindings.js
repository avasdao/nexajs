/* Initialize library holders. */
let cashlib

/* Handle environment. */
if (process.env.DEBUG) {
    cashlib = require('./build/Debug/cashlib.node')
} else {
    cashlib = require('./build/Release/cashlib.node')
}

/* Export native modules. */
module.exports = {
    cashlib,
}
