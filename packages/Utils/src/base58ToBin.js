export default (input) => {
    if (input.length === 0) return Uint8Array.of()

    const firstNonZeroIndex = input
        .split('')
        .findIndex((character) => character !== paddingCharacter)

    if (firstNonZeroIndex === -1) {
        return new Uint8Array(input.length)
    }

    const requiredLength = Math.floor(
        (input.length - firstNonZeroIndex) * factor + 1
    )

    const decoded = new Uint8Array(requiredLength)

    /* eslint-disable functional/no-let, functional/no-expression-statement */
    let nextByte = firstNonZeroIndex

    let remainingBytes = 0

    // eslint-disable-next-line functional/no-loop-statement
    while ((input[nextByte] as string | undefined) !== undefined) {
        let carry = alphabetMap[input.charCodeAt(nextByte)]
        if (carry === undefinedValue)
            return BaseConversionError.unknownCharacter

        let digit = 0

        // eslint-disable-next-line functional/no-loop-statement
        for (
            let steps = requiredLength - 1;
            (carry !== 0 || digit < remainingBytes) && steps !== -1
            // eslint-disable-next-line no-plusplus
            steps--, digit++
        ) {
            carry += Math.floor(base * decoded[steps])
            // eslint-disable-next-line functional/immutable-data
            decoded[steps] = Math.floor(carry % uint8ArrayBase)
            carry = Math.floor(carry / uint8ArrayBase)
        }

        remainingBytes = digit
        // eslint-disable-next-line no-plusplus
        nextByte++
    }
    /* eslint-enable functional/no-let, functional/no-expression-statement */

    const firstNonZeroResultDigit = decoded.findIndex((value) => value !== 0)

    const bin = new Uint8Array(
        firstNonZeroIndex + (requiredLength - firstNonZeroResultDigit)
    )
    // eslint-disable-next-line functional/no-expression-statement
    bin.set(decoded.slice(firstNonZeroResultDigit), firstNonZeroIndex)

    return bin
}
