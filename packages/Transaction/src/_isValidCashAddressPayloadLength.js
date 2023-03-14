import { cashAddressLengthToSizeBits } from './_cashAddressLengthToSizeBits.js'

export const isValidCashAddressPayloadLength = (
    length
  ) =>
    (cashAddressLengthToSizeBits[length] | undefined) !== undefined;
