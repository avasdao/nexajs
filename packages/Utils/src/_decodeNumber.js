/**
 * Decode Number
 */
const decodeNumber = (_bufferValue) => {
    // TODO: Properly validate and error check.

    /* Parse the high and low value sets. */
    const highValue = _bufferValue.readUInt32LE(4)
    const lowValue = _bufferValue.readUInt32LE(0)

    /* Return the decoded value. */
    return highValue * Math.pow(2, 32) + lowValue
}

/* Export module. */
module.exports = decodeNumber
