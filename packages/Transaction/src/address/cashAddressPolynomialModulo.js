// prettier-ignore
const bech32GeneratorMostSignificantByte = [
    0x98,
    0x79,
    0xf3,
    0xae,
    0x1e,
] // eslint-disable-line @typescript-eslint/no-magic-numbers

// prettier-ignore
const bech32GeneratorRemainingBytes = [
    0xf2bc8e61,
    0xb76d99e2,
    0x3e5fb3c4,
    0x2eabe2a8,
    0x4f43e470,
] // eslint-disable-line @typescript-eslint/no-magic-numbers

export default (v) => {
    /* eslint-disable functional/no-let, functional/no-loop-statement, functional/no-expression-statement, no-bitwise, @typescript-eslint/no-magic-numbers */
    let mostSignificantByte = 0
    let lowerBytes = 1
    let c = 0

    // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
    for (let j = 0; j < v.length; j++) {
        c = mostSignificantByte >>> 3
        mostSignificantByte &= 0x07
        mostSignificantByte <<= 5
        mostSignificantByte |= lowerBytes >>> 27
        lowerBytes &= 0x07ffffff
        lowerBytes <<= 5

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        lowerBytes ^= v[j]

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < bech32GeneratorMostSignificantByte.length; ++i) {
            // eslint-disable-next-line functional/no-conditional-statement
            if (c & (1 << i)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mostSignificantByte ^= bech32GeneratorMostSignificantByte[i]

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                lowerBytes ^= bech32GeneratorRemainingBytes[i]
            }
        }
    }

    lowerBytes ^= 1

    // eslint-disable-next-line functional/no-conditional-statement
    if (lowerBytes < 0) {
        lowerBytes ^= 1 << 31
        lowerBytes += (1 << 30) * 2
    }

    return mostSignificantByte * (1 << 30) * 4 + lowerBytes
    /* eslint-enable functional/no-let, functional/no-loop-statement, functional/no-expression-statement, no-bitwise, @typescript-eslint/no-magic-numbers */
}
