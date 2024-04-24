/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendCoins')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import buildCoins from './buildCoins.js'

// TODO Use `buildCoins` to build a Signed Transaction
//      then broadcast using Provider.


/**
 * Send Coins
 *
 * Simple coin sending to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coin
 *   - outpoint
 *   - satoshis
 *   - wif
 */
export default async (_coins, _receivers) => {
    debug('Sending coins', _coins, _receivers)

    /* Build a raw transaction. */
    const transaction = await buildCoins(_coins, _receivers)
    // console.log('RAW TRANSACTION', transaction)

    /* Broadcast raw transaction (in hex format). */
    return broadcast(transaction.raw)
}
