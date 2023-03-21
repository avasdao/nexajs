/**
 * Lookup Transaction Fingerprint
 *
 * Possible values
 * ---------------
 *   - lock_time: 0, rare, block_id, big_value, timestamp
 *   - version: 1, 2, unknown
 *   - has_witness: true, false
 */
export default {
    'lock_time': `Depending on wallet software, lock_time property can either be 0, or a block height, or some timestamp. In rare cases it's some other value (rare or big_value)`,
    'version': `Versions 1 and 2 are distributed almost equally these days`,
    'has_witness': `SegWit usage is a distinctive property — there are wallets and exchanges who are known to be using or not using SegWit`,
}
