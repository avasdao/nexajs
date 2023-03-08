/* Import modules. */
import { EventEmitter } from 'events'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:address')

/* Import (local) modules. */
import { encodeAddress as _encodeAddress } from './src/cashaddr.js'
import { decodeAddress as _decodeAddress } from './src/cashaddr.js'

/* Export (local) modules. */
export const encodeAddress = _encodeAddress
export const decodeAddress = _decodeAddress

/**
 * Address Class
 *
 * Manages address functions.
 */
export class Address extends EventEmitter {
    constructor(_params) {
        /* Initialize Address class. */
        debug('Initializing Address...')
        debug(JSON.stringify(_params, null, 2))
        super()

        /* Set (address) seed. */
        this._seed = _params?.seed

        /* Validate seed. */
        if (!this._seed) {
            /* Set (address) seed. */
            this._seed = _params
        }

        /* Set seed type. */
        this._seedType = getSeedType(_params)

        /* Validate seed type. */
        if (!this._seedType) {
            throw new Error(`Oops! Invalid address seed.`)
        }
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
            return JSON.stringify(pkg, null, 2)
        } else {
            return pkg
        }
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
        return '(Mainnet) address'
    }

    if (_seed.toLowerCase().startsWith('nexatest:')) {
        return '(Testnet) address'
    }

    // FIXME
    if (_seed.length > 0) {
        return 'privatekey'
    }

    /* Return null. */
    return null
}
