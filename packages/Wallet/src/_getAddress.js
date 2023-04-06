/* Import modules. */
import Nexa from 'nexajs'

/**
 * Get Address
 *
 * Returns the next avaialble "receiving" address.
 */
const getAddress = (state, getters) => (_account) => {
    /* Validate accounts. */
    if (!getters.getAccounts) {
        return null
    }

    /* Request indices. */
    const indices = getters.getIndices
    // console.log('GET ADDRESS (indices):', indices)

    /* Initialize current (coin) index. */
    const currentIndex = indices[_account]
    // console.log('GET ADDRESS (currentIndex):', currentIndex)

    /* Initialize chain. */
    let chain = null

    /* Select chain. */
    switch(_account) {
    case 'deposit':
        chain = 0
        break
    case 'change':
        chain = 1
        break
    case 'causes':
        chain = 6767
        break
    case 'nito':
        chain = 7867
        break
    }

    /* Validate chain. */
    if (chain === null) {
        return null
    }

    /* Set derivation path. */
    const path = getters.getDerivationPath(chain, currentIndex)
    // console.log('GET ADDRESS (path)', path)

    /* Initialize HD node. */
    const hdNode = getters.getHDNode

    /* Initialize child node. */
    const childNode = hdNode.deriveChild(path)

    /* Set (receiving) address. */
    const address = Nexa.Address.toCashAddress(childNode)
    // console.log('GET ADDRESS (receiving address)', address)

    /* Return address. */
    return address
}

/* Export module. */
export default getAddress
