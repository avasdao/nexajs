/* Import modules. */
import Nexa from 'nexajs'

/**
 * Get Change Address
 *
 * Returns the next avaialble "change" (account) address,
 * for the specified wallet type.
 *
 * NOTE: This function will increment the active pool of accounts; so it is
 *       presumed that the transaction WILL succeed at the point that this
 *       function is called.
 */
const getChangeAddress = (state, getters) => (_wallet) => {
    /* Validate state. */
    if (!state || !state.account) {
        return null
    }

    /* Initialize accounts. */
    const accounts = state.account

    /* Validate (wallet) accounts. */
    if (!getters.getAccountsByWallet(_wallet)) {
        return null
    }

    /* Initialize (wallet) account. */
    const walletAccount = getters.getAccountsByWallet(_wallet)

    /* Initialize current (account) index. */
    const currentIndex = Math.max(...Object.keys(walletAccount))

    /* Set change index. */
    const changeIndex = currentIndex + 1

    // FIXME
    const change = 0

    /* Set derivation path. */
    const path = `${getters.getDerivationPath('BCH')}/${change}/${changeIndex}`
    // console.log('GET CHANGE ADDRESS (path)', path)

    /* Add change index to active accounts (pool). */
    walletAccount[changeIndex] = {
        s: 'a',
        u: {},
    }

    /* Update accounts. */
    accounts[_wallet] = walletAccount

    /* Set accounts. */
    // FIXME: How can we handle this using the "traditional" dispatch??
    //        Caution against non-instant updates via dispatch.
    state.account = accounts

    /* Initialize HD node. */
    const hdNode = getters.getHDNode

    /* Initialize child node. */
    const childNode = hdNode.derivePath(path)
    // console.log('CHILD NODE', childNode)

    /* Initialize address. */
    const address = Nexa.Address.toCashAddress(childNode)
    // console.log('WALLET ADDRESS', address)

    /* Return address. */
    return address
}

/* Export module. */
export default getChangeAddress
