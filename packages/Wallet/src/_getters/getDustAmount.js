/**
 * Get Dust Amount
 *
 * The minimum size (in satoshis) for a transaction. More specifically,
 * an output whose spending would require more than 1/3 of its value as fees.
 *
 * Sources:
 *   - https://bitcoin.stackexchange.com/a/71782
 *   - https://bitcoin.stackexchange.com/a/86069
 */
const getDustAmount = () => {
    /* Return dust amount. */
    return 546
}

/* Export module. */
export default getDustAmount
