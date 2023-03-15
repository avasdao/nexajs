import Opcodes from '../utils/Opcodes.js'

/**
 * Given the 20-byte {@link hash160} of a P2SH20 redeem bytecode, encode a
 * P2SH20 locking bytecode:
 * `OP_HASH160 OP_PUSHBYTES_20 redeemBytecodeHash OP_EQUAL`.
 *
 * This method does not validate `p2sh20Hash` in any way; inputs of incorrect
 * lengths will produce incorrect results.
 *
 * @param p2sh20Hash - the 20-byte, p2sh20 redeem bytecode hash
 */
export default (p2sh20Hash) =>
    Uint8Array.from([
        Opcodes.OP_HASH160,
        Opcodes.OP_PUSHBYTES_20,
        ...p2sh20Hash,
        Opcodes.OP_EQUAL,
    ])
