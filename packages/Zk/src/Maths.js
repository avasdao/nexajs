/* Import core modules. */
import bigInt from 'big-integer'

/**
 * Pedersen (Class)
 */
export default class Maths {
    /**
     * Constructor
     */
    constructor() {}

    /**
     * Add
     */
    add(a, b, c) {
        if (c) {
            return bigInt(a.toString()).add(b.toString()).mod(c)
        }

        return bigInt(a.toString()).add(b.toString())
    }

    /**
     * Subtract
     */
    subtract(a, b, c) {
        if (c) {
            return bigInt(a.toString()).sub(b.toString()).mod(c)
        }

        return bigInt(a.toString()).sub(b.toString())
    }

    /**
     * Multiply
     */
    multiply(a, b, c)  {
        if (c) {
            return bigInt(a.toString()).multiply(b.toString()).mod(c)
        }

        return bigInt(a.toString()).multiply(b.toString())
    }

    /**
     * Divide
     */
    divide(a, b, c) {
        if (c) {
            return bigInt(a.toString()).divide(b.toString()).mod(c)
        }

        return bigInt(a.toString()).divide(b.toString())
    }

    /**
     * Power
     */
    power(p, s, c)  {
        if (c) {
            return bigInt(p.toString()).modPow(s, c)
        }

        return bigInt(p.toString()).pow(s)
    }
}
