/* Import modules. */
import { hexToBin } from '@nexajs/utils'

import { OP } from '../index.js'
import { encodeDataPush } from '../index.js'

/**
 * Encode Null Data
 *
 * Encodes data for insertion into OP_RETURN null data field.
 *
 * Supported formats include:
 *   1. String (text)
 *   2. Hexadecimal (text)
 *   3. TypedArray (binary)
 *
 * NOTE: Data may be provided as a single element OR as an array of elements.
 */
export default (_data) => {
    /* Initialize locals. */
    let binData
    let binPart
    let code
    let hexPart
    let part
    let parts

    /* Validate array. */
    if (!Array.isArray(_data)) {
        parts = [_data]
    } else {
        parts = _data
    }

    /* Initialize binary data. */
    binData = new Uint8Array(0)

    /* Handle parts. */
    for (let i = 0; i < parts.length; i++) {
        /* Initialize hex (data) part. */
        hexPart = ''

        /* Set (data) part. */
        part = parts[i]

        /* Convert user data (string) to hex. */
        for (let j = 0; j < part.length; j++) {
            /* Convert to hex code. */
            code = part
                .charCodeAt(j)
                .toString(16)
                .padStart(2, '0')

            /* Add hex code to string. */
            hexPart += code
        }

        /* Convert to binary (data) part. */
        binPart = encodeDataPush(hexToBin(hexPart))

        /* Append binary part. */
        binData = new Uint8Array([
            ...binData,
            ...binPart,
        ])
    }

    /* Return (binary) script data. */
    return new Uint8Array([
        OP.RETURN,
        ...binData,
    ])
}
