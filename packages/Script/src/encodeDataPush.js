/* Import modules. */
import {
    numberToBinUint16LE,
    numberToBinUint32LE,
} from '@nexajs/utils'

import { OP } from '../index.js'

const PushOperationConstants = {
    OP_0: 0,
    /**
     * OP_PUSHBYTES_75
     */
    maximumPushByteOperationSize: 0x4b,
    OP_PUSHDATA_1: 0x4c,
    OP_PUSHDATA_2: 0x4d,
    OP_PUSHDATA_4: 0x4e,
    /**
     * OP_PUSHDATA_4
     */
    highestPushDataOpcode: 0x4e,
    /**
     * For OP_1 to OP_16, `opcode` is the number offset by `0x50` (80):
     *
     * `OP_N: 0x50 + N`
     *
     * OP_0 is really OP_PUSHBYTES_0 (`0x00`), so it does not follow this pattern.
     */
    pushNumberOpcodesOffset: 0x50,
    /** OP_1 through OP_16 */
    pushNumberOpcodes: 16,
    negativeOne: 0x81,
    OP_1NEGATE: 79,
    /**
     * 256 - 1
     */
    maximumPushData1Size: 255,
    /**
     * Standard consensus parameter for most Bitcoin forks.
     */
    maximumPushSize: 520,
    /**
     * 256 ** 2 - 1
     */
    maximumPushData2Size: 65535,
    /**
     * 256 ** 4 - 1
     */
    maximumPushData4Size: 4294967295,
}

/**
 * Encode Data Push
 */
export default (_data) => {
    return _data.length <= PushOperationConstants.maximumPushByteOperationSize
        ? _data.length === 0
            ? Uint8Array.of(0)
            : _data.length === 1
            ? _data[0] !== 0 && _data[0] <= PushOperationConstants.pushNumberOpcodes
                ? Uint8Array.of(
                    _data[0] + PushOperationConstants.pushNumberOpcodesOffset
                )
                : _data[0] === PushOperationConstants.negativeOne
                ? Uint8Array.of(PushOperationConstants.OP_1NEGATE)
                : Uint8Array.from([1, ..._data])
            : Uint8Array.from([_data.length, ..._data])
        : _data.length <= PushOperationConstants.maximumPushData1Size
        ? Uint8Array.from([
            PushOperationConstants.OP_PUSHDATA_1,
            _data.length,
            ..._data,
        ])
        : _data.length <= PushOperationConstants.maximumPushData2Size
        ? Uint8Array.from([
            PushOperationConstants.OP_PUSHDATA_2,
            ...numberToBinUint16LE(_data.length),
            ..._data,
        ])
        : Uint8Array.from([
            PushOperationConstants.OP_PUSHDATA_4,
            ...numberToBinUint32LE(_data.length),
            ..._data,
        ])
}
