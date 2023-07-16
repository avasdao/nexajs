/**
 * Encode Null Data
 *
 * Encodes data for insertion into OP_RETURN null data field.
 */
export default (_data) => {
    /* Initialize locals. */
    let code
    let hexData
    let part
    let parts

    /* Validate array. */
    if (!Array.isArray(_data)) {
        parts = [_data]
    } else {
        parts = _data
    }

    /* Initialize hex data. */
    hexData = ''

    /* Handle parts. */
    for (let i = 0; i < parts.length; i++) {
        /* Set (data) part. */
        part = parts[i]

        /* Add special (unit separator) character. */
        if (i > 0) {
            hexData += '1f'
        }

        /* Convert user data (string) to hex. */
        for (let j = 0; j < part.length; j++) {
            /* Convert to hex code. */
            code = part
                .charCodeAt(j)
                .toString(16)
                .padStart(2, '0')
            // console.log('CODE', part[j], code, code.length)

            /* Add hex code to string. */
            hexData += code
        }
        // console.log('HEX DATA', hexData)
    }

    /* Return (encoded) hex data. */
    return hexData
}
