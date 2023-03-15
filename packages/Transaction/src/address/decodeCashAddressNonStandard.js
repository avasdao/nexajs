import CashAddressDecodingError from './CashAddressDecodingError.js'
import decodeCashAddressFormat from './decodeCashAddressFormat.js'
import decodeCashAddressVersionByte from './decodeCashAddressVersionByte.js'

export default (address) => {
    const decoded = decodeCashAddressFormat(address)

    if (typeof decoded === 'string') {
        return decoded
    }

    const info = decodeCashAddressVersionByte(decoded.version)

    if (info === 'Reserved bit is set.') {
        return CashAddressDecodingError.reservedByte
    }

    if (decoded.payload.length !== info.length) {
        return CashAddressDecodingError.mismatchedPayloadLength
    }

    return {
        payload: decoded.payload,
        prefix: decoded.prefix,
        typeBits: info.typeBits,
    }
}
