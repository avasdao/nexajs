/* global BigInt */

/**
 * Variable Integer
 */
const varInt = (_number) => {
    // Declare storage for the results.
    let result

    // NOTE: If the number should be encoded in 1 byte..
    if (_number < 0xfd) {
        result = Buffer.alloc(1)
        result.writeUInt8(_number)
    }
    // NOTE: If the number should be encoded in 3 bytes..
    else if (_number < 0xffff) {
        result = Buffer.alloc(3)
        result.writeUInt8(0xfd)
        result.writeUInt16LE(_number, 1)
    }
    // NOTE: If the number should be encoded in 5 bytes..
    else if (_number < 0xffffffff) {
        result = Buffer.alloc(5)
        result.writeUInt8(0xfe)
        result.writeUInt32LE(_number, 1)
    }
    // NOTE: If the number should be encoded in 9 bytes..
    else {
        result = Buffer.alloc(9)
        result.writeUInt8(0xff)
        result.writeBigUInt64LE(BigInt(_number), 1)
    }

    /* Return the variable integer buffer. */
    return result
}

/* Export module. */
module.exports = varInt
