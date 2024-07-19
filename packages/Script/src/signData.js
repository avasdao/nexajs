/**
 * Sign Data
 *
 * Sign data for use with the CHECKDATASIG instruction.
 *
 * There are (5x) supported "format" options available:
 *   1. binary
 *   2. hash (previously SHA256-hashed)
 *   3. hex
 *   4. json
 *   5. string (UTF-8)
 *
 * NOTE: As per the CHECKDATASIG operation, this method normally signs
 *       the SHA256 of the provided message unless the 'hash' message
 *       format is specified.
 *       If using the 'hash' message format, provide the hex encoded
 *       SHA256 hash of the message intended to be passed to CHECKDATASIG.
 */
export default async (_privkey, _msgbuf, _format = 'string') => {
    // TODO

    // NOTE Remember to reverse the bytes of the "hashed" buffer.
}
