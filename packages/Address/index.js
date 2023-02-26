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

    print() {
        console.info(JSON.stringify({
            seed: this._seed,
            seedType: this._seedType,
        }, null, 2))
    }
}

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
