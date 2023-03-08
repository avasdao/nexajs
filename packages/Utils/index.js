


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
