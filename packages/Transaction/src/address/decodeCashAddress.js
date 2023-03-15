import CashAddressDecodingError from './CashAddressDecodingError.js'
import cashAddressTypeBitsToType from './cashAddressTypeBitsToType.js'
import decodeCashAddressNonStandard from './decodeCashAddressNonStandard.js'

export default (address) => {
    const decoded = decodeCashAddressNonStandard(address)

    if (typeof decoded === 'string') {
        return decoded
    }

    const type = cashAddressTypeBitsToType[decoded.typeBits]

    if (type === undefined) {
        return `${CashAddressDecodingError.unknownAddressType} Type bit value: ${decoded.typeBits}.`
    }

    return {
        payload: decoded.payload,
        prefix: decoded.prefix,
        type,
    }
}
