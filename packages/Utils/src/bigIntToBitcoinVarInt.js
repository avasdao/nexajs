import numberToBinUint16LE from './numberToBinUint16LE.js'
import numberToBinUint32LE from './numberToBinUint32LE.js'
import bigIntToBinUint64LE from './bigIntToBinUint64LE.js'

const VarInt = {
    uint8MaxValue: 0xfc,
    uint16Prefix: 0xfd,
    uint16MaxValue: 0xffff,
    uint32Prefix: 0xfe,
    uint32MaxValue: 0xffffffff,
    uint64Prefix: 0xff,
}

/**
 * Encode a positive BigInt as a Bitcoin VarInt (Variable-length integer).
 *
 * Note: the maximum value of a Bitcoin VarInt is `0xffff_ffff_ffff_ffff`. This
 * method will return an incorrect result for values outside of the range `0` to
 * `0xffff_ffff_ffff_ffff`.
 *
 * @param value - the BigInt to encode (no larger than `0xffff_ffff_ffff_ffff`)
 */
export default (value) =>
    value <= BigInt(VarInt.uint8MaxValue)
        ? Uint8Array.of(Number(value))
        : value <= BigInt(VarInt.uint16MaxValue)
        ? Uint8Array.from([
            VarInt.uint16Prefix,
            ...numberToBinUint16LE(Number(value)),
        ])
        : value <= BigInt(VarInt.uint32MaxValue)
        ? Uint8Array.from([
            VarInt.uint32Prefix,
            ...numberToBinUint32LE(Number(value)),
        ])
        : Uint8Array.from([VarInt.uint64Prefix, ...bigIntToBinUint64LE(value)]);
