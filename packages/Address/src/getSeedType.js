/**
 * Get Seed Type
 *
 * Will parse the seed to determine the address type.
 */
export default (_seed) => {
    if (!_seed) return null

    if (_seed.toLowerCase().startsWith('nexa:')) {
        return '(Mainnet) address'
    }

    if (_seed.toLowerCase().startsWith('nexatest:')) {
        return '(Testnet) address'
    }

    // FIXME
    if (_seed.length > 0) {
        return 'privatekey'
    }

    /* Return null. */
    return null
}
