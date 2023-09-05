/* Import modules. */
import { OP } from '@nexajs/script'

/**
 * Encode a single {@link Output} for inclusion in an encoded transaction.
 *
 * @param output - the output to encode
 */
export default (_output) => {
    /* Initialize locals. */
    let version

    /* Handle version selection. */
    if (_output.lockingBytecode[1] === OP.RETURN) {
        version = new Uint8Array([0]) // v0
    } else {
        version = new Uint8Array([1]) // v1
    }

    return new Uint8Array([
        version,
        ..._output.amount,
        ..._output.lockingBytecode,
    ])
}
