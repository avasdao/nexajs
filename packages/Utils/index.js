

/**
 * Reverse Bytes
 *
 * Reverse the bytes of a HEX string.
 */
export const reverseBytes = (_bytes) => {
    return _bytes.match(/[a-fA-F0-9]{2}/g).reverse().join('')
}


/**
 * Utils Class
 *
 * A suite of useful utilities.
 */
export class Utils {
    // NOTE: We won't use a constructor, as this is a purely utility class.

    static reverseBytes(_bytes) {
        return reverseBytes(_bytes)
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Utilities class. */
Nexa.Utils = Utils

/* Initialize Utilities modules. */
Nexa.reverseBytes = reverseBytes

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = { ...Nexa }
