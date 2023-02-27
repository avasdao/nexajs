import { Opcodes } from './_Opcodes.js'

/**
 * Given the 20-byte {@link hash160} of a compressed public key, return a P2PKT
 * locking bytecode:
 * `OP_1 OP_1 publicKeyTemplate`.
 *
 * This method does not validate `publicKeyTemplate` in any way; inputs of incorrect
 * lengths will produce incorrect results.
 *
 * @param publicKeyTemplate - the 20-byte hash of the template
 * @returns
 */
export const encodeLockingBytecodeP2pkt = (publicKeyTemplate) =>
  Uint8Array.from([
    Opcodes.OP_0,
    Opcodes.OP_1,
    ...publicKeyTemplate,
  ]);
