/**
 * Reduce an array of `Uint8Array`s into a single `Uint8Array`.
 * @param array - the array of `Uint8Array`s to flatten
 */
export default (_array) => {
    const totalLength = _array.reduce(
        (total, bin) => total + bin.length, 0
    )

    const flattened = new Uint8Array(totalLength)

    // eslint-disable-next-line functional/no-expression-statement
    _array.reduce((index, bin) => {
        // eslint-disable-next-line functional/no-expression-statement
        flattened.set(bin, index)

        return index + bin.length
    }, 0)

    return flattened
}
