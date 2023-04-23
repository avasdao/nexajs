// TODO Add test for BigInt
import bigIntToBinUint64LE from './bigIntToBinUint64LE.js'
import CompactUint from './CompactUint.js'
import numberToBinUint16LE from './numberToBinUint16LE.js'
import numberToBinUint32LE from './numberToBinUint32LE.js'

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
