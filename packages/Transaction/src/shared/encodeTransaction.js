/* Import modules. */
import {
    flattenBinArray,
    numberToBinUintLE,
    numberToBinUint32LE,
} from '@nexajs/utils'

import encodeTransactionInputs from './encodeTransactionInputs.js'
import encodeTransactionOutputs from './encodeTransactionOutputs.js'

export default (tx) =>
    tx.version === 0 ?
    new Uint8Array([
        tx.version,
        ...flattenBinArray([
            encodeTransactionInputs(tx.inputs),
            encodeTransactionOutputs(tx.outputs),
            numberToBinUint32LE(tx.locktime),
        ])
    ])
    : flattenBinArray([
        numberToBinUintLE(tx.version), // FIXME This will not support (0) value.
        encodeTransactionInputs(tx.inputs),
        encodeTransactionOutputs(tx.outputs),
        numberToBinUint32LE(tx.locktime),
    ])
