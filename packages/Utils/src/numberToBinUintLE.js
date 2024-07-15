/**
 * Encode a positive integer as a little-endian Uint8Array. For values exceeding
 * `Number.MAX_SAFE_INTEGER` (`9007199254740991`), use `bigIntToBinUintLE`.
 * Negative values will return the same result as `0`.
 *
 * @param value - the number to encode
 */
export default (value) => {
    const baseUint8Array = 256
    const result = []

    // eslint-disable-next-line functional/no-let
    let remaining = value

    // eslint-disable-next-line functional/no-loop-statement
    while (remaining >= baseUint8Array) {
        // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
        result.push(remaining % baseUint8Array)

        // eslint-disable-next-line functional/no-expression-statement
        remaining = Math.floor(remaining / baseUint8Array)
    }

    // eslint-disable-next-line functional/no-conditional-statement, functional/no-expression-statement, functional/immutable-data
    if (remaining > 0)
        result.push(remaining)

    return Uint8Array.from(result)
}
