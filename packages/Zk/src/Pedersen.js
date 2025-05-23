/* Import modules. */
import bigInt from 'big-integer'
import { randomBytes } from '@nexajs/crypto'
import { binToHex } from '@nexajs/utils'

import ZkMaths from './Maths.js'

// import { Zk } from '../index.js'

/* Initialize bit security. */
const bitSecurity = 32


/**
 * Pedersen (Class)
 */
export default class Pedersen {
    /**
     * Constructor
     */
    constructor(_p, _G, _AbsctractMath = ZkMaths) {
        /* Set abstraction math. */
        this.absctractMath = _AbsctractMath
        // console.log('ABS MATHS', this.absctractMath)

        /* Validate `P` value. */
        if (typeof _p === 'undefined' || !_p) {
            _p = binToHex(randomBytes(32)) // FIXME Verify less than N
        }

        /* Validate Generator. */
        // if (typeof _G === 'undefined' || !_G) {
        //     _G = Zk.G()
        // }

        /* Set p. */
        this.p = bigInt(_p, 16)

        /* Set g (Generator). */
        this.G = bigInt(_G, 16)

        /* Calculate q. */
        // NOTE: Double `p`, then add `1`.
        this.q = this.absctractMath
            .multiply(this.p, 2)
            .add(1)
    }

    /**
     * New Offset
     */
    newOffset() {
        /* Initialize r value. */
        let r = bigInt.zero

        /* Loop. */
        // NOTE: r value MUST be greater than zero, but less than p.
        while (r.compare(0) !== 1 || r.compare(this.p) !== -1) {
            r = bigInt.fromArray([ ...randomBytes(bitSecurity) ], 256)
            r = r.mod(this.p)
        }

        /* Set `r` to within our set. */
        r = r.mod(this.p)

        /* Return a padded 20-byte string. */
        return r.toString(16).padStart(40, '0')
    }

    /**
     * New Secret
     *
     * NOTE: This is an alias for newOffset.
     */
    newSecret() {
        return this.newOffset()
    }

    /**
     * Commit
     */
    commit(message, secret, r = this.newOffset()){
        /* Initialize r value. */
        // NOTE: This is a new secret / offset, set to base (16).
        r = bigInt(r, 16)

        /* Initialize m value. */
        let m = null

        /* Validate message. */
        if (bigInt.isInstance(message)) {
            /* Set m to base (10) value. */
            m = bigInt(message)
        } else {
            /* Set m to base (16) value. */
            m = bigInt(message, 16)
        }

        /* Generate h value. */
        const h = bigInt(this.G).modPow(bigInt(secret, 16), this.q)

        /* Generate c (Commitment) value. */
        const c = this.absctractMath.multiply(
            this.absctractMath.power(this.G, m, this.q),
            this.absctractMath.power(h, r, this.q),
            this.q
        )

        /* Return c (Commitment) values. */
        return [c.toString(16), r.toString(16)]
    }

    /**
     * Verify
     */
    verify(message, commitments, secret) {
        /* Combine all commitments. */
        const commitment = this.combine(commitments)

        /* Initialize r value. */
        const r = commitment[1]

        /* Generate c (Commitment). */
        // NOTE: We set the r value. */
        const c = this.commit(message.toString(16), secret, r)

        /* Return validation. */
        return c.toString() === commitment.toString()
    }

    /**
     * Combine
     */
    combine(commitments) {
        /* Initialize c (Commitment) value. */
        let c = bigInt.one

        /* Initialize r value. */
        let r = bigInt.zero

        /* Loop through commitment(s). */
        for (const commitment of commitments) {
            /* Multiply commitment values. */
            c = c.multiply(bigInt(commitment[0], 16)).mod(this.q)

            /* Add r values. */
            r = r.add(bigInt(commitment[1], 16))
        }

        /* Return combined c (Commitment). */
        return [c.toString(16), r.toString(16)]
    }
}
