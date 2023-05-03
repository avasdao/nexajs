import { flattenBinArray } from '@bitauth/libauth'
import { bigIntToCompactUint } from '@nexajs/utils'

import encodeTransactionInput from './encodeTransactionInput.js'

export default (inputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(inputs.length)),
        ...inputs.map(encodeTransactionInput),
    ])
