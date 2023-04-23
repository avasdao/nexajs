const hexByteWidth = 2

/**
 * For use before `hexToBin`. Returns true if the provided string is valid
 * hexadecimal (length is divisible by 2, only uses hexadecimal characters).
 * @param maybeHex - a string to test
 */
export default (maybeHex) =>
    maybeHex.length % hexByteWidth === 0 && !/[^a-fA-F0-9]/u.test(maybeHex)
