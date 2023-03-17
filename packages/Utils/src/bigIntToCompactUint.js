import {
    numberToBinUint16LE,
    numberToBinUint32LE,
    bigIntToBinUint64LE,
} from '@bitauth/libauth'

import CompactUint from './CompactUint.js'

export default (value) =>
    value <= BigInt(CompactUint.uint8MaxValue)
        ? Uint8Array.of(Number(value))
        : value <= BigInt(CompactUint.uint16MaxValue)
            ? Uint8Array.from([
                CompactUint.uint16Prefix,
                ...numberToBinUint16LE(Number(value)),
            ])
            : value <= BigInt(CompactUint.uint32MaxValue)
                ? Uint8Array.from([
                    CompactUint.uint32Prefix,
                    ...numberToBinUint32LE(Number(value)),
                ])
                : Uint8Array.from([
                    CompactUint.uint64Prefix,
                    ...bigIntToBinUint64LE(value),
                ])
