import cashAddressLengthToSizeBits from './cashAddressLengthToSizeBits.js'

export default (length) =>
    (cashAddressLengthToSizeBits[length] | undefined) !== undefined
