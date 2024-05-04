/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendTokens')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import buildTokens from './buildTokens.js'

// TODO Use `buildTokens` to build a Signed Transaction
//      then broadcast using Provider.


/**
 * Send Tokens
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
export default async (_coins, _tokens, _receivers) => {
    debug('Sending tokens', _coins, _tokens, _receivers)

    /* Build a raw transaction. */
    const transaction = await buildTokens(_coins, _tokens, _receivers)
    // console.log('RAW TRANSACTION', transaction)

    /* Broadcast raw transaction (in hex format). */
    return broadcast(transaction.raw)
}
