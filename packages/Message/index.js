/* Import modules. */
import { utf8ToBin } from '@nexajs/utils'

/* Import (local) modules. */
import _sign from './src/sign.js'
import _verify from './src/verify.js'

/* Export (local) modules. */
export const sign = _sign
export const verify = _verify

export const MAGIC_BYTES = utf8ToBin('Bitcoin Signed Message:\n')

/**
 * Message Class
 *
 * Manages message functions.
 */
export class Message {
    static sign(_wif, _message) {
        return sign(_wif, _message)
    }

    static verify(_address, _message, _signature) {
        return verify(_address, _message, _signature)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Message class. */
Nexa.Message = Message

/* Initialize Message modules. */
Nexa.signMessage = sign
Nexa.verifyMessage = verify

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
