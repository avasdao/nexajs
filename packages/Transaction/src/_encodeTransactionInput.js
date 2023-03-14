import {
  flattenBinArray,
  numberToBinUintLE,
  numberToBinUint32LE,
  bigIntToBinUint64LE,
} from '@bitauth/libauth'

import { bigIntToCompactUint } from './_bigIntToCompactUint.js'

export const encodeTransactionInput = (input) =>
  flattenBinArray([
    numberToBinUintLE(0), // Type MUST be (0)
    input.outpointTransactionHash.slice().reverse(),
    // numberToBinUint32LE(input.outpointIndex),
    bigIntToCompactUint(BigInt(input.unlockingBytecode.length)),
    input.unlockingBytecode,
    numberToBinUint32LE(input.sequenceNumber),
    // bigIntToBinUint64LE(BigInt(input.amount)),
    bigIntToBinUint64LE(BigInt(1337)),
  ]);
