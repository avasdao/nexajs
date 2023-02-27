import { CashAddressDecodingError } from './_CashAddressDecodingError.js'
import { cashAddressTypeBitsToType } from './_cashAddressTypeBitsToType.js'
import { decodeCashAddressNonStandard } from './_decodeCashAddressNonStandard.js'

export const decodeCashAddress = (address) => {
  const decoded = decodeCashAddressNonStandard(address);
  if (typeof decoded === 'string') {
    return decoded;
  }
  const type = cashAddressTypeBitsToType[decoded.typeBits];
  if (type === undefined) {
    return `${CashAddressDecodingError.unknownAddressType} Type bit value: ${decoded.typeBits}.`;
  }
  return {
    payload: decoded.payload,
    prefix: decoded.prefix,
    type,
  };
};
