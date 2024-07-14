export default (input) => {
    if (input.length === 0) return ''

    const firstNonZeroIndex = input.findIndex((byte) => byte !== 0)

    if (firstNonZeroIndex === -1) {
        return paddingCharacter.repeat(input.length)
    }

    const requiredLength = Math.floor(
        (input.length - firstNonZeroIndex) * inverseFactor + 1
    )

    const encoded = new Uint8Array(requiredLength)

    /* eslint-disable functional/no-let, functional/no-expression-statement */
    let nextByte = firstNonZeroIndex

    let remainingBytes = 0

    // eslint-disable-next-line functional/no-loop-statement
    while (nextByte !== input.length) {
        let carry = input[nextByte]
        let digit = 0

        // eslint-disable-next-line functional/no-loop-statement
        for (
            let steps = requiredLength - 1
            (carry !== 0 || digit < remainingBytes) && steps !== -1;
            // eslint-disable-next-line no-plusplus
            steps--, digit++
        ) {
            carry += Math.floor(uint8ArrayBase * encoded[steps])

            // eslint-disable-next-line functional/immutable-data
            encoded[steps] = Math.floor(carry % base)

            carry = Math.floor(carry / base)
        }

        remainingBytes = digit

        // eslint-disable-next-line no-plusplus
        nextByte++
    }

    /* eslint-enable functional/no-let, functional/no-expression-statement */

    const firstNonZeroResultDigit = encoded.findIndex((value) => value !== 0);

    const padding = paddingCharacter.repeat(firstNonZeroIndex);

    return encoded
        .slice(firstNonZeroResultDigit)
        .reduce((all, digit) => all + alphabet.charAt(digit), padding);
}
