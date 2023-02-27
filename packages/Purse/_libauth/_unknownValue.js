export const unknownValue = (
  value,
  message = `Received an unknown value: ${String(
    value
  )}. This should have been caught by TypeScript - are your types correct?`
) => {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(message);
};
