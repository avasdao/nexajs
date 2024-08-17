/* Import modules. */
import { Point } from '@nexajs/crypto'

/* Import (local) modules. */
import _Pedersen from './src/Pedersen.js'

/* Export (local) modules. */
export const Pedersen = _Pedersen


/**
 * Zero Knowledge Class
 *
 * Manages zero-knowledge functions.
 */
export class Zk {
    // NOTE: We won't use a constructor, as this is a "pure" class.

    test() {
        return 'Zero Knowledge (Instance) is working!'
    }
    static test() {
        return 'Zero Knowledge (Static) is working!'
    }

    static G() {
        return Point.getG()
    }

    static g() { // an alias for `G`
        return this.G
    }

    static Gx() {
        return this.G.x
    }

    static Gy() {
        return this.G.y
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Zk class. */
Nexa.Zk = Zk
Nexa.Pedersen = Pedersen

/* Initialize Zk modules. */
// TBD

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
