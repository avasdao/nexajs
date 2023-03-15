/**
 * In ASCII, each pair of upper and lower case characters share the same 5 least
 * significant bits.
 */
const asciiCaseInsensitiveBits = 0b11111

export default (prefix) => {
    const result = []

    // eslint-disable-next-line functional/no-let, functional/no-loop-statement, no-plusplus
    for (let i = 0; i < prefix.length; i++) {
        // eslint-disable-next-line functional/no-expression-statement, no-bitwise, functional/immutable-data
        result.push(prefix.charCodeAt(i) & asciiCaseInsensitiveBits)
    }

    return result
}
