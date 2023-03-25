const Utils = require('.')

/**
 * Variable Buffer
 */
const varBuf = (_buffer) => {
    /* Validate buffer. */
    if (typeof _buffer === 'string') {
        _buffer = Buffer.from(_buffer, 'hex')
    }

    /* Calculate length. */
    const prependLength = Utils.varInt(_buffer.length)

    /* Build variable buffer. */
    const result = Buffer.concat([prependLength, _buffer])

    /* Return the variable buffer encoded data. */
    return result
}

/* Export module. */
module.exports = varBuf
