/*******************************************************************************
 *
 * NexaJS Main Entry Module
 *
 * This file offers access to the entire NexaJS Package Suite.
 *
 * Please visit https://docs.nexajs.org for more details.
 */

/* Import NexaJS classes */
// NOTE: This allows us to export a (default) module.
import { Address as _Address } from '@nexajs/address'
import { Purse as _Purse } from '@nexajs/purse'
import { Rpc as _Rpc } from '@nexajs/rpc'

/* Export (individual) NexaJS classes */
// NOTE: This allows us to export a (default) module.
export const Address = _Address
export const Purse = _Purse
export const Rpc = _Rpc

/* Export Address methods */
export { decodeAddress } from '@nexajs/address'
export { encodeAddress } from '@nexajs/address'
export { testAddr } from '@nexajs/address'

/* Export Purse methods */
export { testPurse } from '@nexajs/purse'
export { sendUtxo } from '@nexajs/purse'

/* Export RPC methods */
export { callNode } from '@nexajs/rpc'
export { connectToNode } from '@nexajs/rpc'

/* Export Default module. */
// NOTE: This allows importing the (NexaJS) module without curly braces.
export default {
    Address,
    Purse,
    Rpc,
}
