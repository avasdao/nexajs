import cashAddressLengthToSizeBits from './cashAddressLengthToSizeBits.js'

const cashAddressTypeBitsShift = 3

export default (
    typeBits,
    length
) =>
    // eslint-disable-next-line no-bitwise
    (typeBits << cashAddressTypeBitsShift) |
    cashAddressLengthToSizeBits[length]
