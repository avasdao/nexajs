import { encodeAddress } from './cashaddr.js'
import { decodeAddress } from './cashaddr.js'

export class Address {
    constructor(_seed) {
        console.info('\n  Creating new Address instance...\n') // eslint-disable-line no-console

        /* Set address seed. */
        this._seed = _seed

        /* Set seed type. */
        this._seedType = getSeedType(_seed)
    }

    test() {
        testAddr()
    }

    decode(_addr) {
        return decodeAddress(_addr)
    }
    static decode(_addr) {
        return decodeAddress(_addr)
    }

    encode(_prefix, _type, _hash) {
        return encodeAddress(_prefix, _type, _hash)
    }
    static encode(_prefix, _type, _hash) {
        return encodeAddress(_prefix, _type, _hash)
    }

    /**
     * To String
     *
     * Serializes (or marshalls) the Address details into a JSON package.
     *
     * (optional) Set formatting to (true) for "pretty" output styling.
     */
    toString(_formatted = false) {
        /* Build Address (data) package. */
        const pkg = {
            seed: this._seed,
            seedType: this._seedType,
        }

        /* Handle formatting flag. */
        if (_formatted) {
            console.info(JSON.stringify(pkg, null, 2))
        } else {
            console.info(pkg)
        }
    }
}

/* Export methods. */
export { encodeAddress } from './cashaddr.js'
export { decodeAddress } from './cashaddr.js'

// FIXME FOR DEV PURPOSES ONLY
export const testAddr = () => {
    console.log('NexaJS Address is a GO!')
}

/**
 * Get Seed Type
 *
 * Will parse the seed to determine the address type.
 */
const getSeedType = (_seed) => {
    if (!_seed) return null

    if (_seed.toLowerCase().startsWith('nexa:')) {
        return 'address'
    }

    // FIXME
    if (_seed.length > 0) {
        return 'privatekey'
    }

    /* Return null. */
    return null
}
