import addressContentsToLockingBytecode from './addressContentsToLockingBytecode.js'
import CashAddressType from './CashAddressType.js'
import decodeCashAddress from './decodeCashAddress.js'
import formatError from './formatError.js'
import LockingBytecodeType from './LockingBytecodeType.js'
import unknownValue from './unknownValue.js'

const AddressPayload = {
    p2pkhStart: 3,
    p2pkhEnd: 23,

    p2sh20Start: 2,
    p2sh20End: 22,

    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    p2sh32Start: 2,
    p2sh32End: 34,

    p2pkUncompressedStart: 1,
    p2pkUncompressedEnd: 66,

    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    p2pkCompressedStart: 1,
    p2sh20Length: 20,
    p2sh32Length: 32,
    compressedPublicKeyLength: 33,

    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    p2pkCompressedEnd: 34,

    p2pktStart: 3,
    p2pktEnd: 23,
}

export default (address) => {
    const decoded = decodeCashAddress(address)

    if (typeof decoded === 'string') return decoded

    // p2sh20 & p2sh32
    if (
        decoded.payload.length !== AddressPayload.p2sh20Length &&
        decoded.payload.length !== AddressPayload.p2sh32Length
    ) {
        return formatError(
            LockingBytecodeGenerationError.unsupportedPayloadLength,
            `Payload length: ${decoded.payload.length}`
        )
    }

    // p2pkh
    if (
        decoded.type === CashAddressType.p2pkh ||
        decoded.type === CashAddressType.p2pkhWithTokens
    ) {
        return {
            bytecode: addressContentsToLockingBytecode({
                payload: decoded.payload,
                type: LockingBytecodeType.p2pkh,
            }),
            options: {
                tokenSupport: decoded.type === CashAddressType.p2pkhWithTokens,
            },
            prefix: decoded.prefix,
        }
    }

    // p2sh
    if (
        decoded.type === CashAddressType.p2sh ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        decoded.type === CashAddressType.p2shWithTokens
    ) {
        return {
            bytecode: addressContentsToLockingBytecode({
                payload: decoded.payload,
                type:
                decoded.payload.length === AddressPayload.p2sh32Length
                ? LockingBytecodeType.p2sh32
                : LockingBytecodeType.p2sh20,
            }),
            options: {
                tokenSupport: decoded.type === CashAddressType.p2shWithTokens,
            },
            prefix: decoded.prefix,
        }
    }

    // TODO Add p2pkt

    return unknownValue(
        decoded.type,
        `Unrecognized address type: ${decoded.type}`,
    )
}
