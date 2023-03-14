import { cashAddressLengthToSizeBits } from './_cashAddressLengthToSizeBits.js'

const cashAddressTypeBitsShift = 3

export const encodeCashAddressVersionByte = (
    typeBits,
    length
  ) =>
    // eslint-disable-next-line no-bitwise
    (typeBits << cashAddressTypeBitsShift) |
    cashAddressLengthToSizeBits[length];
