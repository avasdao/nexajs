/**
 * Parse (Derivation) Path
 *
 * Parse derivation path into its parts:
 *   1. purpose
 *   2. coin type
 *   3. account index
 *   4. is change? (0 or 1)
 *   5. address index
 */
export default function (_path) {
    /* Parse the path. */
    const parsed = _path.split('/')

    /* Validate (parsed) length. */
    if (parsed.length !== 6) {
        throw new Error('Invalid derivation path schema.')
    }

    /* Validate (parsed) schema. */
    if (parsed[0] !== 'm') {
        throw new Error('Invalid derivation path schema.')
    }

    /* Validate (parsed) purpose. */
    if (parsed[1] !== `44'`) {
        throw new Error('Invalid derivation path schema.')
    }

    /* Return parsed derivation path. */
    return [
        parsed[1], // purpose
        parsed[2], // coin type
        parsed[3], // account index
        parsed[4], // is change? (0 or 1)
        parsed[5], // address index
    ]
}
