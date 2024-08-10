/* Import modules. */

/* Import (local) modules. */
import _Pedersen from './src/Pedersen.js'

/* Export (local) modules. */
export const Pedersen = _Pedersen


/**
 * Zero-knowledge Proof Class
 *
 * Manages zero-knowledge proof functions.
 */
export class Zkp {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    test() {
        return 'Zero-knowledge proof (Instance) is working!'
    }
    static test() {
        return 'Zero-knowledge proof (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Zkp class. */
Nexa.Zkp = Zkp
Nexa.Pedersen = Pedersen

/* Initialize Zkp modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
