/* Set constants. */
const NEXA_COIN_TYPE = '29223' // 0x7227 is hex value

/**
 * Get Derivation Path
 *
 * Based on (BIP-44) derivation paths.
 * (m / purpose' / coin_type' / account' / change / address_index)
 * source: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
 *
 * The `address_index` allows for an unlimited number of addresses to be
 * generated for each Wallet.
 */
export default () => (_addressIdx = 0, _isChange = false, _accountIdx = 0) => {
    /* Set change flag/value. */
    const changeIdx = _isChange ? 1 : 0

    /* Validate account index. */
    if (!Number.isInteger(_accountIdx)) {
        throw new Error('Invalid account index.')
    }

    /* Validate adress index. */
    if (!Number.isInteger(_addressIdx)) {
        throw new Error('Invalid address index.')
    }

    /* Return (hardened) derivation path. */
    return `m/44'/${NEXA_COIN_TYPE}'/${_accountIdx}'/${changeIdx}/${_addressIdx}`
}
