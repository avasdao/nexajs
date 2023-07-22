/* Import modules. */
import { OP } from '../index.js'

/**
 * Get Opcode
 *
 * Searches the OPs database by ID.
 */
export default (_opid) => {
    /* Find the OP by ID. */
    const op = Object.keys(OP).find(_op => {
        return OP[_op] === _opid
    })

    /* Return OP. */
    return op
}
