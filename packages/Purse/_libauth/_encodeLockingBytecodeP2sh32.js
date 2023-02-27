import { Opcodes } from './_Opcodes.js'

/**
 * Given the 32-byte {@link hash256} of a P2SH32 redeem bytecode, encode a
 * P2SH32 locking bytecode:
 * `OP_HASH256 OP_PUSHBYTES_32 redeemBytecodeHash OP_EQUAL`.
 *
 * This method does not validate `p2sh32Hash` in any way; inputs of incorrect
 * lengths will produce incorrect results.
 *
 * @param p2sh32Hash - the 32-byte, p2sh32 redeem bytecode hash
 */
export const encodeLockingBytecodeP2sh32 = (p2sh32Hash) =>
  Uint8Array.from([
    Opcodes.OP_HASH256,
    Opcodes.OP_PUSHBYTES_32,
    ...p2sh32Hash,
    Opcodes.OP_EQUAL,
  ]);
