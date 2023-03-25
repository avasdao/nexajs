/* Import modules. */
const debug = require('debug')('nitojs:address:addaccount')

/**
 * Add Account
 *
 * Retrieves an account from the current (wallet) node.
 *
 * Path examples include:
 *   - `m/0/0` (traditionally the 1st path in a wallet)
 *   - `m/0/1` (traditionally the 2nd path)
 *   - `m/1/1` (traditionally the 2nd path of the 2nd account)
 *
 * NOTE: A "full" parent derivation path, eg. `m/44'/145'/0'/0/0`.
 */
const addAccount = function (_path) {
    debug(`Retrieving account for [ ${_path} ]`)

    /* Initialize child node. */
    const childNode = this.node.deriveChild(_path)

    /* Return child node. */
    return childNode
}

/* Export module. */
module.exports = addAccount
