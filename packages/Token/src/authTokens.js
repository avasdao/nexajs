/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import { Transaction } from '@nexajs/transaction'

import getChangeReceiver from './getChangeReceiver.js'

/* Set constants. */
import DUST_LIMIT from './getDustLimit.js'

/**
 * Authorize Tokens
 *
 * Authorize token assets and/or capabilities to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coins provided will be used to pay for transaction (mininig) fees.
 *
 * An authority transaction output (TXO) MUST be provided to break consensus
 * and alter token quantities, rules and permissions:
 *   - create new tokens
 *   - melt existing tokens
 *   - alter authority capabilities
 *
 * An array of authority Capabilities:
 *   - script public key (of authority)
 *   - canMint
 *   - canMelt
 *   - hasBaton
 *   - canRescript
 *   - canSubgroup
 *
 * Authorities can "renouce" ALL of their authority.
 * (NOTE: Partial authority can be retained by assigning new capabilities.)
 */
export default async (_coins, _authTxo, _capabilities, _renounce = false) => {
    console.log('Sending tokens', _coins, _authTxo, _capabilities, _renounce)
    // console.log('Sending tokens', _coins, _tokens, _capabilities, _renounce)

    /* Initialize locals. */
    let address
    let change

    // TBD...
}
