/**
 * Encode a positive BigInt as little-endian Uint8Array. Negative values will
 * return the same result as `0`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const baseUint8Array = 256
    const base = BigInt(baseUint8Array)
    const result = []
    // eslint-disable-next-line functional/no-let
    let remaining = value
    // eslint-disable-next-line functional/no-loop-statement
    while (remaining >= base) {
        // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
        result.push(Number(remaining % base))
        // eslint-disable-next-line functional/no-expression-statement
        remaining /= base
    }
    // eslint-disable-next-line functional/no-conditional-statement, functional/no-expression-statement, functional/immutable-data
    if (remaining > BigInt(0)) result.push(Number(remaining))

    return Uint8Array.from(result.length > 0 ? result : [0])
}
