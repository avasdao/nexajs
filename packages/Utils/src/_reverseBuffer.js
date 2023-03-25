/**
 * Reverse Buffer
 *
 * Reverses the bytes of a buffer.
 */
const reverseBuffer = (_buffer) => {
    /* Allocate space for the reversed buffer. */
    const reversed = Buffer.allocUnsafe(_buffer.length)

    /* Iterate over half of the buffers length, rounded up.. */
    for (
        let lowIndex = 0, highIndex = _buffer.length - 1;
        lowIndex <= highIndex;
        lowIndex += 1, highIndex -= 1
    ) {
        // NOTE: Swap each position from the beginning to the end.
        reversed[lowIndex] = _buffer[highIndex]
        reversed[highIndex] = _buffer[lowIndex]
    }

    /* Return the reversed buffer. */
    return reversed
}

/* Export module. */
module.exports = reverseBuffer
