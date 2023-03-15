import Opcodes from '../utils/Opcodes.js'

/**
 * Given the 20-byte {@link hash160} of a compressed public key, return a P2PKH
 * locking bytecode:
 * `OP_DUP OP_HASH160 OP_PUSHBYTES_20 publicKeyHash OP_EQUALVERIFY OP_CHECKSIG`.
 *
 * This method does not validate `publicKeyHash` in any way; inputs of incorrect
 * lengths will produce incorrect results.
 *
 * @param publicKeyHash - the 20-byte hash of the compressed public key
 * @returns
 */
export default (publicKeyHash) =>
    Uint8Array.from([
        Opcodes.OP_DUP,
        Opcodes.OP_HASH160,
        Opcodes.OP_PUSHBYTES_20,
        ...publicKeyHash,
        Opcodes.OP_EQUALVERIFY,
        Opcodes.OP_CHECKSIG,
    ])
