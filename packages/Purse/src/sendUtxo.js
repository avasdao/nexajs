/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendUtxo')

export default (_params) => {
    debug('Sending UTXO...')
    debug(JSON.stringify(_params, null, 2))

    return {
        msg: 'TESTING!',
        success: true,
    }
}
