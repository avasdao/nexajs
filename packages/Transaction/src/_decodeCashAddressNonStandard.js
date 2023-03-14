import { CashAddressDecodingError } from './_CashAddressDecodingError.js'
import { decodeCashAddressFormat } from './_decodeCashAddressFormat.js'
import { decodeCashAddressVersionByte } from './_decodeCashAddressVersionByte.js'

export const decodeCashAddressNonStandard = (address) => {
  const decoded = decodeCashAddressFormat(address);
  if (typeof decoded === 'string') {
    return decoded;
  }
  const info = decodeCashAddressVersionByte(decoded.version);

  if (info === 'Reserved bit is set.') {
    return CashAddressDecodingError.reservedByte;
  }

  if (decoded.payload.length !== info.length) {
    return CashAddressDecodingError.mismatchedPayloadLength;
  }

  return {
    payload: decoded.payload,
    prefix: decoded.prefix,
    typeBits: info.typeBits,
  };
};
