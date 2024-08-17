/* Import core modules. */
import bigInt from 'big-integer'

/**
 * Pedersen (Class)
 */
export default class Maths {
    // NOTE: No constructor required.

    /**
     * Add
     */
    static add(a, b, c) {
        if (c) {
            return bigInt(a.toString()).add(b.toString()).mod(c)
        }

        return bigInt(a.toString()).add(b.toString())
    }

    /**
     * Subtract
     */
    static subtract(a, b, c) {
        if (c) {
            return bigInt(a.toString()).sub(b.toString()).mod(c)
        }

        return bigInt(a.toString()).sub(b.toString())
    }

    /**
     * Multiply
     */
    static multiply(a, b, c)  {
        if (c) {
            return bigInt(a.toString()).multiply(b.toString()).mod(c)
        }

        return bigInt(a.toString()).multiply(b.toString())
    }

    /**
     * Divide
     */
    static divide(a, b, c) {
        if (c) {
            return bigInt(a.toString()).divide(b.toString()).mod(c)
        }

        return bigInt(a.toString()).divide(b.toString())
    }

    /**
     * Power
     */
    static power(p, s, c)  {
        if (c) {
            return bigInt(p.toString()).modPow(s, c)
        }

        return bigInt(p.toString()).pow(s)
    }
}
