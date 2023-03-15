import { flattenBinArray } from '@bitauth/libauth'

/**
 * Encode a single {@link Output} for inclusion in an encoded transaction.
 *
 * @param output - the output to encode
 */
export default (output) => {
    // const lockingBytecodeField = flattenBinArray([
    // //   encodeTokenPrefix(output.token),
    //   output.lockingBytecode,
    // ]);
    return flattenBinArray([0
    //   valueSatoshisToBin(output.valueSatoshis),
    //   bigIntToCompactUint(BigInt(lockingBytecodeField.length)),
    //   lockingBytecodeField,
    ])
}
