/**
 * Encode Number
 */
const encodeNumber = (_satoshis) => {
    // Check if the provided satoshis is of the correct type.
    if (isNaN(_satoshis)) {
        throw `Cannot encode output value, provided satoshis '${_satoshis}' is not a number.`
    }

    // Check if the provided satoshis is an integer.
    if (!Number.isInteger(_satoshis)) {
        throw `Cannot encode output value, provided satoshis '${_satoshis}' is not an integer.`
    }

    // Check if the provided satoshis is a positive number.
    if (_satoshis < 0) {
        throw `Cannot encode output value, provided satoshis '${_satoshis}' is negative.`
    }

    // Check if the provided satoshis is within our accepted number range.
    if (_satoshis > Math.pow(2, 53)) {
        throw `Cannot encode output value, provided satoshis '${_satoshis}' is larger than javacripts 53bit limit.`
    }

    /* Allocate 8 bytes. */
    const value = Buffer.alloc(8)

    /* Split the number into high and low bits. */
    const highValue = Math.floor(_satoshis / Math.pow(2, 32))
    const lowValue = _satoshis % Math.pow(2, 32)

    /* Write the satoshi number to the buffer in 64bit. */
    value.writeUInt32LE(highValue, 4)
    value.writeUInt32LE(lowValue, 0)

    // Return the encoded value.
    return value
}

/* Export module. */
module.exports = encodeNumber
