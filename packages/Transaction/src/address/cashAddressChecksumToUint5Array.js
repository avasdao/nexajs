const base32WordLength = 5
const base256WordLength = 8

export default (checksum) => {
    const result = []

    // eslint-disable-next-line functional/no-let, functional/no-loop-statement, no-plusplus
    for (let i = 0; i < base256WordLength; ++i) {
        // eslint-disable-next-line functional/no-expression-statement, no-bitwise, @typescript-eslint/no-magic-numbers, functional/immutable-data
        result.push(checksum & 31)

        // eslint-disable-next-line functional/no-expression-statement, @typescript-eslint/no-magic-numbers, no-param-reassign
        checksum /= 32
    }

    // eslint-disable-next-line functional/immutable-data
    return result.reverse()
}
