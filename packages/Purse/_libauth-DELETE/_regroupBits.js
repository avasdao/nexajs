export const regroupBits = ({
  bin,
  sourceWordLength,
  resultWordLength,
  allowPadding = true,
}) => {
  let accumulator = 0;
  let bits = 0;
  const result = [];
  const maxResultInt = (1 << resultWordLength) - 1;
  // eslint-disable-next-line functional/no-loop-statement, @typescript-eslint/prefer-for-of, no-plusplus
  for (let p = 0; p < bin.length; ++p) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = bin[p];
    if (value < 0 || value >> sourceWordLength !== 0) {
      return BitRegroupingError.integerOutOfRange;
    }
    accumulator = (accumulator << sourceWordLength) | value;
    bits += sourceWordLength;
    // eslint-disable-next-line functional/no-loop-statement
    while (bits >= resultWordLength) {
      bits -= resultWordLength;
      // eslint-disable-next-line functional/immutable-data
      result.push((accumulator >> bits) & maxResultInt);
    }
  }

  if (allowPadding) {
    if (bits > 0) {
      // eslint-disable-next-line functional/immutable-data
      result.push((accumulator << (resultWordLength - bits)) & maxResultInt);
    }
  } else if (bits >= sourceWordLength) {
    return BitRegroupingError.hasDisallowedPadding;
  } else if (((accumulator << (resultWordLength - bits)) & maxResultInt) > 0) {
    return BitRegroupingError.requiresDisallowedPadding;
  }
  return result;
};
/* eslint-enable functional/no-let, no-bitwise, functional/no-expression-statement, functional/no-conditional-statement, complexity */
