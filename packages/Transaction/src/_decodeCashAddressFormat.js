import {
  decodeBech32,
  isBech32CharacterSet,
  regroupBits,
} from './bech32.js';

import { CashAddressDecodingError } from './_CashAddressDecodingError.js'
import { cashAddressPolynomialModulo } from './_cashAddressPolynomialModulo.js'
import { maskCashAddressPrefix } from './_maskCashAddressPrefix.js'

const Constants = {
  cashAddressTypeBitsShift: 3,
  base32WordLength: 5,
  base256WordLength: 8,
  payloadSeparator: 0,
  asciiLowerCaseStart: 96,
  finiteFieldOrder: 32,
  cashAddressReservedBitMask: 0b10000000,
  cashAddressTypeBits: 0b1111,
  cashAddressSizeBits: 0b111,
  /**
   * In ASCII, each pair of upper and lower case characters share the same 5 least
   * significant bits.
   */
  asciiCaseInsensitiveBits: 0b11111,
}

export const decodeCashAddressFormat = (address) => {
  const parts = address.toLowerCase().split(':');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return CashAddressDecodingError.invalidFormat;
  }
  const [prefix, payload] = parts;
  if (!isBech32CharacterSet(payload)) {
    return CashAddressDecodingError.invalidCharacters;
  }
  const decodedPayload = decodeBech32(payload);

  const polynomial = [
    ...maskCashAddressPrefix(prefix),
    Constants.payloadSeparator,
    ...decodedPayload,
  ];
  if (cashAddressPolynomialModulo(polynomial) !== 0) {
    return CashAddressDecodingError.invalidChecksum;
  }

  const checksum40BitPlaceholderLength = 8;
  const payloadContents = regroupBits({
    allowPadding: false,
    bin: decodedPayload.slice(0, -checksum40BitPlaceholderLength),
    resultWordLength: Constants.base256WordLength,
    sourceWordLength: Constants.base32WordLength,
  });

  if (typeof payloadContents === 'string') {
    return CashAddressDecodingError.improperPadding;
  }

  const [version, ...contents] = payloadContents;
  const result = Uint8Array.from(contents);

  return { payload: result, prefix, version };
};
